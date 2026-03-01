# HSE ServiceFinder MCP Server

A TypeScript [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that wraps the **HSE Service Finder API** — Ireland's public health service directory. It runs locally via **stdio transport** and exposes tools for searching and retrieving health service locations, services, service providers, and special days.

## Features

- Search & retrieve **locations** (hospitals, health centres, pharmacies, etc.)
- Search & retrieve **services** with age, kind, and geo-location filters
- Search & retrieve **service providers**
- List and look up **special days** (public holidays affecting opening hours)

## Tech Stack

- **TypeScript** with ES modules (target: ES2022, module: Node16)
- **@modelcontextprotocol/sdk** — `McpServer` + `StdioServerTransport`
- **Zod** for input validation
- **Node.js native `fetch`** (Node 18+)

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later

## Setup

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test
```

## Available Scripts

| Script             | Description                                    |
| ------------------ | ---------------------------------------------- |
| `npm run build`    | Compile TypeScript and make the entry executable |
| `npm test`         | Run unit tests with Vitest                     |
| `npm run test:watch` | Run tests in watch mode                      |
| `npm run lint`     | Lint source files with ESLint                  |
| `npm run typecheck`| Type-check without emitting files              |
| `npm run inspector`| Launch the MCP Inspector UI                   |

## Tools

### Location Tools

| Tool                | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| `search_locations`  | Search locations by name, county, kind, geo-coordinates, tags, opening hours, and more |
| `get_location`      | Get full details for a single location by its slug           |

### Service Tools

| Tool                | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| `search_services`   | Search services by name, kind, location, age eligibility, and more |
| `get_service`       | Get full details for a single service by its slug            |

### Service Provider Tools

| Tool                       | Description                                           |
| -------------------------- | ----------------------------------------------------- |
| `search_service_providers` | Search service providers by name or kind              |
| `get_service_provider`     | Get full details for a single service provider by ID  |

### Special Days Tools

| Tool                | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| `list_special_days` | List special days (e.g., public holidays) affecting opening hours |
| `get_special_day`   | Get details for a single special day by ID                   |

## Claude Desktop Configuration

Add the following to your Claude Desktop configuration file:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "hse-servicefinder": {
      "command": "node",
      "args": ["/absolute/path/to/hse-servicefinder-mcp/build/index.js"]
    }
  }
}
```

Replace `/absolute/path/to/` with the actual path to this project.

## Project Structure

```
hse-servicefinder-mcp/
├── .github/workflows/
│   ├── ci.yml                # Lint + build + typecheck + test on PRs and pushes
│   └── release.yml           # Semantic version tag + changelog on main
├── src/
│   ├── index.ts              # MCP server entry point — registers all tools, starts stdio transport
│   ├── hse-api.ts            # HSE API client — typed fetch wrapper and endpoint functions
│   └── __tests__/
│       ├── hse-api.test.ts   # Unit tests for the API client
│       └── tools.test.ts     # Unit tests for tool registration and input validation
├── package.json
├── tsconfig.json
├── eslint.config.js
├── README.md
└── CHANGELOG.md
```

## License

MIT