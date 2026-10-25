import { z } from "zod";
import validVersion from "semver/functions/valid";

const metadataUrl =
  "https://dl-vease.dijingchao.com/releases/channels/stable.json";
const localFixtures = new Set([
  "available",
  "zip-only",
  "withdrawn",
  "no-artifacts",
  "invalid",
  "untrusted-url",
  "missing",
]);
const allowedHost = "dl-vease.dijingchao.com";

const versionSchema = z.string().refine(
  // Preserve canonical versions without prefixes, whitespace, or build metadata.
  (value) => !value.includes("+") && validVersion(value) === value,
  "Invalid release version",
);
const dateSchema = z
  .string()
  .refine(
    (value) => Number.isFinite(Date.parse(value)),
    "Invalid release date",
  );
const artifactSchema = z.looseObject({
  os: z.literal("darwin"),
  arch: z.literal("arm64"),
  format: z.enum(["dmg", "zip"]),
  url: z.url(),
  sha256: z.string().regex(/^[0-9a-f]{64}$/),
  size: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
});
const releaseSchema = z.looseObject({
  version: versionSchema,
  releasedAt: dateSchema,
  artifacts: z.array(z.unknown()),
  withdrawn: z
    .union([
      z.literal(false),
      z.looseObject({
        reason: z.string().optional(),
        replacedBy: z.string().optional(),
      }),
    ])
    .optional(),
});
const metadataSchema = z.looseObject({
  schemaVersion: z.literal(1),
  channel: z.literal("stable"),
  updatedAt: dateSchema,
  latest: versionSchema,
  // Only the selected release is part of this page's validation contract.
  releases: z.array(z.unknown()),
});
const downloadableReleaseSchema = releaseSchema
  .extend({
    artifacts: z.array(artifactSchema),
  })
  .superRefine((release, context) => {
    const seen = new Set<string>();
    release.artifacts.forEach((artifact, index) => {
      const url = new URL(artifact.url);
      if (
        url.protocol !== "https:" ||
        url.hostname !== allowedHost ||
        !url.pathname.startsWith(`/releases/${release.version}/`)
      ) {
        context.addIssue({
          code: "custom",
          path: ["artifacts", index, "url"],
          message: "Untrusted artifact URL",
        });
      }
      if (seen.has(artifact.format)) {
        context.addIssue({
          code: "custom",
          path: ["artifacts", index, "format"],
          message: "Duplicate artifact format",
        });
      }
      seen.add(artifact.format);
    });
  });

export type Artifact = z.infer<typeof artifactSchema>;
export type ValidatedRelease = {
  data: z.infer<typeof metadataSchema>;
  release: z.infer<typeof downloadableReleaseSchema>;
  withdrawn: boolean;
};

export function validateMetadata(input: unknown): ValidatedRelease {
  const data = metadataSchema.parse(input);
  const selected = data.releases.find(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      "version" in item &&
      item.version === data.latest,
  );
  const release = releaseSchema.parse(selected);
  // Withdrawn releases never expose artifacts, even if their old entries are invalid.
  if (release.withdrawn)
    return { data, release: { ...release, artifacts: [] }, withdrawn: true };
  return {
    data,
    release: downloadableReleaseSchema.parse(release),
    withdrawn: false,
  };
}

export function releaseSource(): string {
  const requested = new URLSearchParams(location.search).get("fixture");
  const localHost = ["localhost", "127.0.0.1", "[::1]"].includes(
    location.hostname,
  );
  return localHost && requested && localFixtures.has(requested)
    ? `/fixtures/${requested}.json`
    : metadataUrl;
}
