#!/bin/sh
# Single SemVer source for vease.app; see docs/semver-release.md.
set -eu
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd -P)
exec python3 -B "$ROOT/scripts/semver_release.py" --root "$ROOT" --repository vease.app \
  --source=package.json \
  --derived=package-lock.json \
  "$@"
