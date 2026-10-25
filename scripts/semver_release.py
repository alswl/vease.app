#!/usr/bin/env python3
"""Read, set and release-check a repository's single SemVer source.

The checker only runs read-only Git commands. It never creates, moves or
deletes tags; a release tag is created by a human after candidate freeze.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
from pathlib import Path

SEMVER = re.compile(
    r"^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)"
    r"(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)"
    r"(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?"
    r"(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$"
)
PEP440_PRE = re.compile(r"^(alpha|a|beta|b|rc)(?:\.(0|[1-9]\d*))?$|^dev(?:\.(0|[1-9]\d*))?$")
IMAGE_DIGEST = re.compile(r"^sha256:[0-9a-f]{64}$")
# Variables that would make Git operate on a repository other than --root.
GIT_REDIRECTS = (
    "GIT_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE", "GIT_OBJECT_DIRECTORY",
    "GIT_ALTERNATE_OBJECT_DIRECTORIES", "GIT_COMMON_DIR", "GIT_NAMESPACE", "GIT_PREFIX",
)


class CheckError(Exception):
    pass


def git(root: Path, *args: str, check: bool = True) -> subprocess.CompletedProcess[str]:
    env = {k: v for k, v in os.environ.items() if k not in GIT_REDIRECTS}
    return subprocess.run(
        ["git", "--no-optional-locks", "-C", str(root), *args],
        env=env, text=True, capture_output=True, check=check,
    )


def require_semver(version: str) -> None:
    if not SEMVER.fullmatch(version):
        raise CheckError(f"version is not SemVer MAJOR.MINOR.PATCH[-pre][+build]: {version!r}")


def python_version(version: str) -> str:
    """Map SemVer onto the PEP 440 spelling written by pyproject/uv.lock."""
    match = SEMVER.fullmatch(version)
    if not match or match.group(5):
        raise CheckError(f"{version} has no PEP 440 form (build metadata is not allowed)")
    core, pre = ".".join(match.group(1, 2, 3)), match.group(4)
    if pre is None:
        return core
    parts = PEP440_PRE.fullmatch(pre)
    if not parts:
        raise CheckError(f"{version} has no PEP 440 form; use -alpha.N, -beta.N, -rc.N or -dev.N")
    if parts.group(1):
        label = {"alpha": "a", "beta": "b"}.get(parts.group(1), parts.group(1))
        return f"{core}{label}{parts.group(2) or 0}"
    return f"{core}.dev{parts.group(3) or 0}"


# Each version file kind: how to read the recorded value(s), and how to rewrite it.
def _json_read(file: Path) -> list[str]:
    data = json.loads(file.read_text(encoding="utf-8"))
    values = [str(data.get("version"))]
    if file.name == "package-lock.json":
        values.append(str(data.get("packages", {}).get("", {}).get("version")))
    return values


def _json_write(file: Path, version: str) -> None:
    data = json.loads(file.read_text(encoding="utf-8"))
    data["version"] = version
    if file.name == "package-lock.json":
        data["packages"][""]["version"] = version
    file.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def _pyproject_line(text: str, file: Path) -> re.Match[str]:
    """`version = "..."` inside [project] in pyproject, or the project's [[package]] in uv.lock."""
    if file.name == "uv.lock":
        project = file.with_name("pyproject.toml").read_text(encoding="utf-8")
        name = re.search(r'(?m)^name = "([^"]+)"', project)
        if not name:
            raise CheckError(f"{file}: sibling pyproject.toml has no project name")
        block = rf'(?m)^\[\[package\]\]\nname = "{re.escape(name.group(1))}"\n(version = "([^"]*)")$'
    else:
        block = r'(?ms)^\[project\]\n(?:(?!^\[).)*?^(version = "([^"]*)")$'
    match = re.search(block, text)
    if not match:
        raise CheckError(f"{file}: project version line not found")
    return match


def read_values(file: Path) -> list[str]:
    if file.name in ("package.json", "package-lock.json"):
        return _json_read(file)
    if file.name in ("pyproject.toml", "uv.lock"):
        return [_pyproject_line(file.read_text(encoding="utf-8"), file).group(2)]
    return [file.read_text(encoding="utf-8").strip()]


def expected_value(file: Path, version: str) -> str:
    return python_version(version) if file.name in ("pyproject.toml", "uv.lock") else version


def write_value(file: Path, version: str) -> None:
    if file.name in ("package.json", "package-lock.json"):
        _json_write(file, version)
    elif file.name in ("pyproject.toml", "uv.lock"):
        text = file.read_text(encoding="utf-8")
        match = _pyproject_line(text, file)
        line = f'version = "{python_version(version)}"'
        file.write_text(text[: match.start(1)] + line + text[match.end(1) :], encoding="utf-8")
    else:
        file.write_text(version + "\n", encoding="utf-8")


def repo_root(root: Path) -> Path:
    result = git(root, "rev-parse", "--show-toplevel", check=False)
    if result.returncode != 0 or Path(result.stdout.strip()).resolve() != root:
        raise CheckError(f"--root must be a Git repository top level: {root}")
    return root


def read_version(root: Path, source: str) -> str:
    values = read_values(root / source)
    require_semver(values[0])
    return values[0]


def check_derived(root: Path, version: str, derived: list[str]) -> None:
    drift = []
    for path in derived:
        want = expected_value(root / path, version)
        drift += [f"{path}={got!r} (want {want!r})" for got in read_values(root / path) if got != want]
    if drift:
        raise CheckError("version drift from authoritative source: " + ", ".join(drift))


def tag_target(root: Path, tag: str) -> str | None:
    result = git(root, "rev-parse", "--verify", "--quiet", f"refs/tags/{tag}^{{commit}}", check=False)
    return result.stdout.strip() if result.returncode == 0 else None


def artifact_row(path: Path) -> dict[str, object]:
    if not path.is_file():
        raise CheckError(f"artifact not found: {path}")
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1 << 20), b""):
            digest.update(chunk)
    return {"name": path.name, "sha256": digest.hexdigest(), "size": path.stat().st_size}


def check(args: argparse.Namespace) -> dict[str, object]:
    root = repo_root(args.root.resolve())
    version = read_version(root, args.source)
    check_derived(root, version, args.derived)
    # Ignored files are omitted by Git; anything listed (tracked, staged or untracked) could enter a build.
    status = git(root, "status", "--porcelain=v1", "--untracked-files=all").stdout
    if status.strip():
        raise CheckError("worktree is dirty (tracked, staged or non-ignored untracked files):\n" + status.rstrip())
    commit = git(root, "rev-parse", "HEAD").stdout.strip()
    if args.expected_commit and commit != args.expected_commit:
        raise CheckError(f"HEAD {commit} is not the expected candidate commit {args.expected_commit}")
    tag = f"v{version}"
    target = tag_target(root, tag)
    if target is not None and target != commit:
        raise CheckError(f"tag {tag} already exists at {target}; it is never moved or reused, bump the version")
    if target is None and args.release:
        raise CheckError(f"release requires tag {tag} to exist and point at candidate commit {commit}")
    if args.image_digest and not IMAGE_DIGEST.fullmatch(args.image_digest):
        raise CheckError(f"image digest must be sha256:<64 hex>: {args.image_digest}")
    return {
        "repository": args.repository,
        "version": version,
        "source": args.source,
        "derived": args.derived,
        "tag": tag,
        "tag_state": "at-commit" if target else "absent",
        "commit": commit,
        "release": args.release,
        "artifacts": [artifact_row(path) for path in args.artifact],
        "image_digest": args.image_digest,
    }


def set_version(args: argparse.Namespace) -> str:
    root = repo_root(args.root.resolve())
    require_semver(args.version)
    files = [args.source, *args.derived]
    for path in files:
        expected_value(root / path, args.version)  # fail before writing anything
    if tag_target(root, f"v{args.version}") is not None:
        raise CheckError(f"tag v{args.version} already exists; released versions are never reused")
    for path in files:
        write_value(root / path, args.version)
    return f"set {', '.join(files)} to {args.version}"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--repository", required=True)
    parser.add_argument("--source", required=True, help="authoritative version file, relative to --root")
    parser.add_argument("--derived", action="append", default=[], help="file that must carry the same version")
    commands = parser.add_subparsers(dest="command", required=True)
    commands.add_parser("show", help="print the authoritative version")
    checker = commands.add_parser("check", help="validate a candidate and print its manifest row")
    checker.add_argument("--release", action="store_true", help="require v<version> at HEAD")
    checker.add_argument("--expected-commit")
    checker.add_argument("--artifact", type=Path, action="append", default=[], help="record SHA256 of a file")
    checker.add_argument("--image-digest", help="record an image digest (sha256:...)")
    checker.add_argument("--manifest", type=Path, help="also write the manifest row to this file")
    setter = commands.add_parser("set", help="write a new version to the source and derived files")
    setter.add_argument("version")
    args = parser.parse_args()
    try:
        if args.command == "show":
            print(read_version(repo_root(args.root.resolve()), args.source))
        elif args.command == "set":
            print(set_version(args))
        else:
            output = json.dumps(check(args), indent=2, sort_keys=True) + "\n"
            if args.manifest:
                args.manifest.parent.mkdir(parents=True, exist_ok=True)
                args.manifest.write_text(output, encoding="utf-8")
            print(output, end="")
        return 0
    except (CheckError, OSError, ValueError, KeyError, subprocess.CalledProcessError) as exc:
        detail = exc.stderr.strip() if isinstance(exc, subprocess.CalledProcessError) else exc
        print(f"semver-release: {detail}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
