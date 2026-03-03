# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the repo root via Turborepo + pnpm:

```bash
pnpm build        # Build all packages (tsc + chmod 755 on MCP server)
pnpm typecheck    # Type-check all packages
pnpm lint         # ESLint all packages
pnpm test         # Run Vitest suite across all packages
```

Target a single package with `--filter`:
```bash
pnpm --filter @danstuartdept/hse-servicefinder-mcp build
pnpm --filter @danstuartdept/hse-servicefinder-mcp test
```

Run a single test file directly:
```bash
cd packages/hse-servicefinder-mcp && npx vitest run src/__tests__/hse-api.test.ts
```

Launch MCP Inspector against the built server:
```bash
cd packages/hse-servicefinder-mcp && npm run inspector
```

## Architecture

**pnpm monorepo** with Turborepo orchestration. Pipeline: `build → typecheck`, `build → test`, `build → lint`. Internal packages declare `workspace:*` deps and are not published.

### Packages

| Package | Published | Purpose |
|---|---|---|
| `packages/hse-servicefinder-mcp` | yes (`@danstuartdept/hse-servicefinder-mcp`) | MCP server for Ireland's HSE Service Finder REST API |
| `packages/tsconfig` | no | Shared TypeScript config (`base.json`, `node.json`) |
| `packages/eslint-config` | no | Shared ESLint config (`typescript-eslint` recommended) |
| `packages/vitest-config` | no | Shared Vitest config (re-exported `defineConfig`) |
| `packages/release-please-config` | no | Shared release-please defaults + `scripts/generate-config.js` |

### `packages/hse-servicefinder-mcp`

MCP server that wraps `https://servicefinder.hse.ie/servicefinder/v1`, exposing HSE health service data via tools, prompts, and resources.

**Two-file source structure:**

- `src/hse-api.ts` — API client layer. TypeScript interfaces for HSE API shapes, generic `fetchJson<T>()` over native `fetch`, `buildQueryString()` (supports array params), and typed async functions (one per endpoint). Exports `BASE_URL`, `buildQueryString`, `fetchJson`, and the `cache` map for tests.
- `src/index.ts` — MCP server entry point. Instantiates `McpServer`, registers all tools/prompts/resources with Zod-validated schemas, connects `StdioServerTransport`. Contains `errorResponse()` and `fetchAllPages<T>()` helpers.

**Tool ↔ API function mapping:**

| Tool | API function | Identifier |
|---|---|---|
| `search_locations` | `searchLocations()` | — |
| `get_location` | `getLocation(slug)` | slug |
| `search_services` | `searchServices()` | — |
| `get_service` | `getService(slug)` | slug |
| `search_service_providers` | `searchServiceProviders()` | — |
| `get_service_provider` | `getServiceProvider(id)` | numeric id |
| `search_service_kinds` | `searchServiceKinds()` | — |
| `get_service_kind` | `getServiceKind(slug)` | slug |
| `list_special_days` | `listSpecialDays()` | — |
| `get_special_day` | `getSpecialDay(id)` | numeric id |
| `find_services_at_location` | `findServicesAtLocation()` | compound — resolves location by name, then fetches services |

**Prompts** (in `index.ts`): `find-local-services`, `check-opening-hours`, `find-gp`.

**Resources** (in `index.ts`): `hse://service-kinds`, `hse://special-days`. Both use `fetchAllPages<T>()` (20-page safety cap) to merge paginated results into a single JSON array.

**Transport:** stdio only — no HTTP server. `stdout` is reserved for MCP protocol; all logging goes to `stderr`.

## Key conventions

- All tool responses return JSON strings via `JSON.stringify(..., null, 2)`
- Slug parameters are `encodeURIComponent()`-encoded before appending to URLs
- Search functions return `PaginatedResponse<T>` (`current_page`, `count`, `next`, `previous`, `results[]`)
- **TTL cache (1 hour):** only `searchServiceKinds` and `listSpecialDays` are cached; `cache` map exported from `hse-api.ts` for test clearing
- **Error pattern:** detail/get tools call `errorResponse(err, suggestion)` pointing to the corresponding search tool; search tools call `errorResponse(err)` without suggestion
- Tests use `vi.mock("../hse-api.js", ...)` — no live network calls in tests
- Commits must follow Conventional Commits (`type(scope): message`) — enforced by commitlint
- **Release:** manifest mode release-please; only `packages/hse-servicefinder-mcp` is versioned. Workflow output keys use double-dash: `packages/hse-servicefinder-mcp--release_created`. Publish uses `pnpm --filter`.
- Internal packages (`tsconfig`, `eslint-config`, `vitest-config`, `release-please-config`) use `version: "0.0.0"` and `private: true` — never added to `release-please-config.json`
