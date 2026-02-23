# Komfi Output Mockups (Notion-Only Snapshot)

The `/mockups` page now renders from a generated data snapshot instead of hardcoded constants.

## Route

- `/` -> landing page
- `/mockups` -> Komfi intelligence mockups (`v0.9 Preview`)

## Data Contract

The page reads:

- `src/data/komfiSnapshot.generated.json`
- `src/data/komfiSnapshot.sources.json`
- `src/data/komfiSnapshot.meta.json`

All cards in the mockup should be source-linked to Notion page IDs from:

- `config/komfi-notion-sources.json`

## Refresh Workflow

1. Set env vars:
- `ANTHROPIC_API_KEY`
- `NOTION_API_KEY`

2. Generate snapshot:

```bash
npm run snapshot:komfi
```

3. Validate generated files:

```bash
npm run snapshot:check
```

## Notes

- Source mode is `core` (startup/product strategy pages only).
- Snapshot regeneration is manual by design.
- UI includes citation links, confidence values, and stale snapshot warning.
- If snapshot is older than `snapshotDaysValid`, `/mockups` shows a stale badge.
