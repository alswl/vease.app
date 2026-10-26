import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateMetadata, releaseSource } from "../src/lib/releases.ts";

const fixture = (name: string): any =>
  JSON.parse(
    readFileSync(
      new URL(`../public/fixtures/${name}.json`, import.meta.url),
      "utf8",
    ),
  );

for (const name of ["available", "alpha-candidate", "zip-only", "no-artifacts", "withdrawn"]) {
  test(`accept ${name} and preserve release metadata`, () => {
    const input = fixture(name);
    const result = validateMetadata(input);
    const release = input.releases.find(
      (item: any) => item.version === input.latest,
    );
    assert.equal(result.release.version, release.version);
    assert.equal(result.release.releasedAt, release.releasedAt);
    assert.equal(result.data.updatedAt, input.updatedAt);
    assert.equal(result.withdrawn, Boolean(release.withdrawn));
    if (!result.withdrawn)
      assert.deepEqual(result.release.artifacts, release.artifacts);
  });
}
for (const name of ["invalid", "untrusted-url"]) {
  test(`reject ${name}`, () =>
    assert.throws(() => validateMetadata(fixture(name))));
}

const invalidChanges: Record<string, (data: any) => void> = {
  "wrong schema": (data) => {
    data.schemaVersion = 2;
  },
  "wrong channel": (data) => {
    data.channel = "beta";
  },
  "invalid date": (data) => {
    data.updatedAt = "invalid";
  },
  "missing latest release": (data) => {
    data.latest = "1.2.3";
  },
  "duplicate format": (data) => {
    data.releases[0].artifacts.push(data.releases[0].artifacts[0]);
  },
  "wrong platform": (data) => {
    data.releases[0].artifacts[0].arch = "x64";
  },
  "bad checksum": (data) => {
    data.releases[0].artifacts[0].sha256 = "A".repeat(64);
  },
  "zero size": (data) => {
    data.releases[0].artifacts[0].size = 0;
  },
  "fractional size": (data) => {
    data.releases[0].artifacts[0].size = 1.5;
  },
  "unsafe size": (data) => {
    data.releases[0].artifacts[0].size = Number.MAX_SAFE_INTEGER + 1;
  },
  "string size": (data) => {
    data.releases[0].artifacts[0].size = "123";
  },
  "http URL": (data) => {
    data.releases[0].artifacts[0].url =
      data.releases[0].artifacts[0].url.replace("https:", "http:");
  },
  "wrong release path": (data) => {
    data.releases[0].artifacts[0].url =
      "https://dl-vease.dijingchao.com/releases/1.2.3/file.dmg";
  },
  "invalid URL": (data) => {
    data.releases[0].artifacts[0].url = "invalid";
  },
  "malformed withdrawal": (data) => {
    data.releases[0].withdrawn = { reason: 123 };
  },
};
for (const [name, mutate] of Object.entries(invalidChanges)) {
  test(`fail closed: ${name}`, () => {
    const data = fixture("available");
    mutate(data);
    assert.throws(() => validateMetadata(data));
  });
}
for (const version of [
  "1.2.3",
  "0.0.0",
  "1.2.3-beta.1",
  "1.2.3-0",
  "1.2.3-1a",
]) {
  test(`accept canonical version ${version}`, () => {
    const data = fixture("no-artifacts");
    data.latest = data.releases[0].version = version;
    assert.equal(validateMetadata(data).release.version, version);
  });
}
for (const version of [
  "v1.2.3",
  "=1.2.3",
  " 1.2.3",
  "1.2.3 ",
  "1.2",
  "01.2.3",
  "1.2.3-01",
  "1.2.3+build.1",
]) {
  test(`reject non-contract version ${version}`, () => {
    const data = fixture("no-artifacts");
    data.latest = data.releases[0].version = version;
    assert.throws(() => validateMetadata(data));
  });
}
test("ignore unrelated historical releases", () => {
  const data = fixture("available");
  data.releases.push(null, { version: "old", artifacts: "invalid" });
  assert.equal(validateMetadata(data).release.version, data.latest);
});
test("withdrawn releases retain reason and replacement without exposing old artifacts", () => {
  const data = fixture("withdrawn");
  const release = data.releases.find(
    (item: any) => item.version === data.latest,
  );
  release.artifacts = [{ url: "https://untrusted.example/file.dmg" }];
  const result = validateMetadata(data);
  assert.equal(result.withdrawn, true);
  assert.deepEqual(result.release.withdrawn, release.withdrawn);
  assert.deepEqual(result.release.artifacts, []);
});
test("fixtures are limited to loopback and recognized names", () => {
  try {
    for (const hostname of ["localhost", "127.0.0.1", "[::1]", "vease.app"]) {
      Object.defineProperty(globalThis, "location", {
        configurable: true,
        value: { hostname, search: "?fixture=available" },
      });
      assert.equal(
        releaseSource(),
        hostname === "vease.app"
          ? "https://dl-vease.dijingchao.com/releases/channels/stable.json"
          : "/fixtures/available.json",
      );
    }
    Object.defineProperty(globalThis, "location", {
      configurable: true,
      value: { hostname: "localhost", search: "?fixture=unknown" },
    });
    assert.equal(
      releaseSource(),
      "https://dl-vease.dijingchao.com/releases/channels/stable.json",
    );
  } finally {
    Reflect.deleteProperty(globalThis, "location");
  }
});
