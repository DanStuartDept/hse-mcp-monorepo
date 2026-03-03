# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build       # Compile TypeScript → build/index.js (also chmod 755)
npm run typecheck   # Type-check without emitting
npm run lint        # ESLint over src/
npm test            # Run Vitest suite once
npm run test:watch  # Run Vitest in watch mode
npm run inspector   # Launch MCP Inspector UI against the built server
```

Run a single test file:
```bash
npx vitest run src/__tests__/hse-api.test.ts
```

## Architecture

This is an MCP (Model Context Protocol) server that wraps Ireland's HSE Service Finder REST API (`https://servicefinder.hse.ie/servicefinder/v1`), exposing health service data to AI assistants via tools, prompts, and resources.

**Two-file source structure:**

- `src/hse-api.ts` — API client layer. All TypeScript interfaces for HSE API response shapes, a generic `fetchJson<T>()` wrapper over native `fetch`, `buildQueryString()` (supports array params), and typed async functions (one per API endpoint). Exports `BASE_URL`, `buildQueryString`, `fetchJson`, and the `cache` map for testing.
- `src/index.ts` — MCP server entry point. Instantiates `McpServer`, registers all tools, prompts, and resources with Zod-validated input schemas, and connects a `StdioServerTransport`. Contains `errorResponse()` and `fetchAllPages<T>()` helpers.

**Tool ↔ API function mapping:**

| Tool | API function | Identifier type |
|---|---|---|
| `search_locations` | `searchLocations()` | — |
| `get_location` | `getLocation(slug)` | slug (string) |
| `search_services` | `searchServices()` | — |
| `get_service` | `getService(slug)` | slug (string) |
| `search_service_providers` | `searchServiceProviders()` | — |
| `get_service_provider` | `getServiceProvider(id)` | numeric id |
| `search_service_kinds` | `searchServiceKinds()` | — |
| `get_service_kind` | `getServiceKind(slug)` | slug (string) |
| `list_special_days` | `listSpecialDays()` | — |
| `get_special_day` | `getSpecialDay(id)` | numeric id |
| `find_services_at_location` | `findServicesAtLocation()` | compound (resolves location by name, then fetches services) |

**Prompts** (pre-built templates in `index.ts`): `find-local-services`, `check-opening-hours`, `find-gp`.

**Resources** (static, pre-aggregated, in `index.ts`): `hse://service-kinds`, `hse://special-days`. Both use `fetchAllPages<T>()` (20-page safety cap) to merge all paginated results into a single JSON array.

**Transport:** stdio only — no HTTP server. `stdout` is reserved for MCP protocol traffic; all logging goes to `stderr`.

## Key conventions

- All tool responses return JSON strings via `JSON.stringify(..., null, 2)`
- Slug parameters are `encodeURIComponent()`-encoded before appending to URLs
- Search functions return `PaginatedResponse<T>` (`current_page`, `count`, `next`, `previous`, `results[]`)
- **In-memory TTL cache (1 hour):** only `searchServiceKinds` and `listSpecialDays` are cached; the `cache` map is exported from `hse-api.ts` for test inspection/clearing
- **Error pattern:** detail/get tools call `errorResponse(err, suggestion)` with a `suggestion` field pointing to the corresponding search tool; search tools call `errorResponse(err)` without a suggestion. HTTP status is parsed from the error message string `"HSE API error: {status} ..."`.
- Tests mock the API functions (`vi.mock("../hse-api.js", ...)`) to avoid network calls — don't add live API calls to tests
- Commits must follow Conventional Commits (`type(scope): message`) — enforced by commitlint
- Node.js ≥ 18 required (uses native `fetch`)
- **Publishing:** scoped to `@danstuartdept` on GitHub Packages (`https://npm.pkg.github.com`); releases are automated via release-please
