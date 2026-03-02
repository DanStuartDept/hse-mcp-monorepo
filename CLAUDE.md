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

This is an MCP (Model Context Protocol) server that wraps Ireland's HSE Service Finder REST API (`https://servicefinder.hse.ie/servicefinder/v1`), exposing health service data to AI assistants via 10 tools.

**Two-file source structure:**

- `src/hse-api.ts` — API client layer. Contains all TypeScript interfaces for the HSE API response shapes, a generic `fetchJson<T>()` wrapper over native `fetch`, a `buildQueryString()` helper (supports array params), and 10 typed async functions (one per MCP tool).
- `src/index.ts` — MCP server entry point. Instantiates `McpServer`, registers the 10 tools with Zod-validated input schemas, maps each tool to its `hse-api.ts` function, and connects a `StdioServerTransport`.

**Tool ↔ API function mapping:**

| Tool | API function |
|---|---|
| `search_locations` | `searchLocations()` |
| `get_location` | `getLocation(slug)` |
| `search_services` | `searchServices()` |
| `get_service` | `getService(slug)` |
| `search_service_providers` | `searchServiceProviders()` |
| `get_service_provider` | `getServiceProvider(id)` |
| `search_service_kinds` | `searchServiceKinds()` |
| `get_service_kind` | `getServiceKind(slug)` |
| `list_special_days` | `listSpecialDays()` |
| `get_special_day` | `getSpecialDay(id)` |

**Transport:** stdio only — no HTTP server. The built `build/index.js` is invoked as a child process by MCP clients.

**Publishing:** Scoped to `@danstuartdept` on GitHub Packages (`https://npm.pkg.github.com`). Releases are automated via release-please; commits must follow Conventional Commits (`type(scope): message`).

## Key conventions

- All tool responses are returned as JSON strings via `JSON.stringify(..., null, 2)`
- Slug parameters are `encodeURIComponent()`-encoded before being appended to URLs
- Search functions return `PaginatedResponse<T>` (`current_page`, `count`, `next`, `previous`, `results[]`)
- Tests mock the API functions to avoid network calls; don't add live API calls to tests
- Node.js ≥ 18 required (uses native `fetch`)
