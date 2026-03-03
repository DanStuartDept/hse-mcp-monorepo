# HSE ServiceFinder MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that wraps Ireland's **HSE Service Finder API** — the public health service directory. It runs locally via stdio transport and gives AI assistants access to health service locations, services, providers, and more.

## Installation

Requires [Node.js](https://nodejs.org/) **18 or later**.

The package is published to **GitHub Packages**, which requires a GitHub Personal Access Token (PAT) with `read:packages` scope. Add the following to your `~/.npmrc` once:

```
@danstuartdept:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_PAT
```

Then add the server to your MCP client using the config below. The `-y` flag auto-confirms the npx install prompt. Package updates are picked up automatically on next launch.

```json
{
  "mcpServers": {
    "hse-servicefinder": {
      "command": "npx",
      "args": ["-y", "@danstuartdept/hse-servicefinder-mcp"]
    }
  }
}
```

### Where to put the config

| Client | Config location | Notes |
|--------|----------------|-------|
| **Claude Code** | Run: `claude mcp add hse-servicefinder npx -- -y @danstuartdept/hse-servicefinder-mcp` | No file editing needed |
| **Claude Desktop** | `claude_desktop_config.json` | Restart after editing |
| **Cursor** | `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project) | |
| **VS Code + Copilot** | `.vscode/mcp.json` | Use key `"servers"` instead of `"mcpServers"` |
| **JetBrains IDEs** | `.mcp.json` in project root | Requires 2025.2+ with AI Assistant |
| **Windsurf** | `~/.codeium/windsurf/mcp_config.json` | Restart after editing |

## Features

- Search and retrieve **locations** (hospitals, health centres, pharmacies, etc.)
- Search and retrieve **services** with age, kind, and geo-location filters
- Search and retrieve **service providers**
- Search and retrieve **service kinds**, optionally filtered by collection
- List and look up **special days** (public holidays affecting opening hours)
- **Find services at a location** in a single step (no multi-tool round-trips)

## Tools

| Tool | Description |
|------|-------------|
| `search_locations` | Search locations by name, county, kind, geo-coordinates, opening hours, health region, or tags |
| `get_location` | Get full details for a specific location (address, hours, contacts, facilities, services) |
| `search_services` | Search for health services -- filter by name, kind, age, location, health region |
| `get_service` | Get full details for a specific service |
| `search_service_providers` | Search for service provider organisations |
| `get_service_provider` | Get details for a specific service provider |
| `search_service_kinds` | List service kinds, optionally filtered by collection slug |
| `get_service_kind` | Get details for a specific service kind by slug |
| `list_special_days` | List bank holidays and special days affecting service hours |
| `get_special_day` | Get details for a specific special day |
| `find_services_at_location` | Resolve a location by name and fetch its services in one step |

## Prompts

Pre-built prompt templates for common queries. MCP clients can present these as quick-start actions.

| Prompt | Arguments | Description |
|--------|-----------|-------------|
| `find-local-services` | `service_type`, `location` | Find health services of a given type near a location |
| `check-opening-hours` | `service_name`, `day`, `time` (optional) | Check if a service is open on a specific day/time |
| `find-gp` | `location` | Find GP services in a location |

## Resources

Pre-aggregated reference data that clients can read directly, without pagination.

| URI | Description |
|-----|-------------|
| `hse://service-kinds` | Complete list of HSE health service kind taxonomies |
| `hse://special-days` | Bank holidays and exceptional closures affecting service hours |

## Example Queries

Once connected, try asking your AI assistant:

- "Find hospitals in Cork"
- "What pharmacies are open on Sundays in Dublin?"
- "Show me mental health services near Galway"
- "What services does Beaumont Hospital offer?"
- "Are there any bank holiday opening hour changes coming up?"

## Troubleshooting

- **Tools not showing up** -- Some clients require a full quit and restart (not just closing the window). Check your client's MCP or developer logs.
- **Permission errors on macOS** -- Grant the prompted permissions on first run; subsequent launches should work without prompts.
- **Test the server independently** -- Run `npx @modelcontextprotocol/inspector npx -y @danstuartdept/hse-servicefinder-mcp` to open the MCP Inspector UI.

## Development

```bash
git clone https://github.com/DanStuartDept/hse-servicefinder-mcp.git
cd hse-servicefinder-mcp
npm install
npm run build
```

> **Running from source instead of npx?** Replace the `npx` command/args in any client config with `"command": "node"` and `"args": ["/absolute/path/to/build/index.js"]`.

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript and make the entry executable |
| `npm test` | Run unit tests with Vitest |
| `npm run lint` | Lint source files with ESLint |
| `npm run typecheck` | Type-check without emitting files |
| `npm run inspector` | Launch the MCP Inspector UI |

### Project Structure

```
hse-servicefinder-mcp/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── hse-api.ts            # HSE API client
│   └── __tests__/
│       ├── hse-api.test.ts   # API client tests
│       └── tools.test.ts     # Tool registration tests
├── package.json
├── tsconfig.json
├── eslint.config.js
└── CHANGELOG.md
```

## License

[MIT](https://opensource.org/licenses/MIT)
