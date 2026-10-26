# Download preparation

The website keeps its existing Cloudflare Workers Static Assets hosting. This change does not deploy the site, upload packages or enable public downloads.

The download area has parallel macOS Apple Silicon, macOS Intel and Windows cards. At narrow widths the cards stack. Intel and Windows always show “敬请期待 / Coming soon” as plain text, without download actions, package claims, system requirements or release dates.

`VITE_RELEASE_DOWNLOADS_ENABLED` is disabled unless its value is exactly `true`. A default build shows Apple Silicon download preparation and does not fetch release metadata. An enabled build uses the existing stable metadata contract and fails closed on invalid, missing or withdrawn releases. Valid Apple Silicon releases show DMG/ZIP availability, exact byte sizes and SHA-256 checksums.

For local verification, run `VITE_RELEASE_DOWNLOADS_ENABLED=true npm run build`, preview on loopback, and open `?fixture=alpha-candidate#download`. Fixtures are loopback-only. The alpha mapping is a preparation draft based on an existing App candidate record; it does not establish URL availability, a production release or notarization status. Review the source/version/tag, immutable package hashes and actual URLs before separately authorizing a release switch. Never replace an existing version's bytes.

Invitations and help use the established inviter or beta-group channel, without inventing contact addresses. Original footage remains local; key frames and request/billing records are retained server-side. The bilingual notes describe email-code login, invitation activation and Credits. They promise no online purchase, automatic refund or automatic deletion deadline; compensation is investigated manually through the invitation channel.

Validate with `npm test` and builds with the flag enabled and unset. Browser coverage should include both languages, desktop and narrow widths, default-closed and valid/withdrawn/invalid/missing metadata, non-interactive future platforms, exact checksums and no horizontal overflow. Local checks do not establish remote CI success or CDN reachability.

Rollback: unset `VITE_RELEASE_DOWNLOADS_ENABLED` and rebuild to restore preparation mode. Deployment and metadata/channel changes require separate authorization.
