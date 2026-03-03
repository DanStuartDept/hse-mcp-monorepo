# HSE ServiceFinder MCP Server

A TypeScript [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that wraps the **HSE Service Finder API** — Ireland's public health service directory. It runs locally via **stdio transport** and exposes tools for searching and retrieving health service locations, services, service providers, and special days.

## Supported Clients

[![Claude Code](https://img.shields.io/badge/Claude_Code-black?style=flat-square&logo=anthropic&logoColor=white)](#claude-code)
[![Claude Desktop](https://img.shields.io/badge/Claude_Desktop-black?style=flat-square&logo=anthropic&logoColor=white)](#claude-desktop)
[![Cursor](https://img.shields.io/badge/Cursor-000000?style=flat-square&logo=cursor&logoColor=white)](#cursor)
[![VS Code](https://img.shields.io/badge/VS_Code-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](#vs-code--github-copilot)
[![JetBrains](https://img.shields.io/badge/JetBrains-FF318C?style=flat-square&logo=jetbrains&logoColor=white)](#jetbrains-ides-webstorm-intellij-etc)
[![Windsurf](https://img.shields.io/badge/Windsurf-00B4D8?style=flat-square&logo=codeium&logoColor=white)](#windsurf)

## Features

- Search & retrieve **locations** (hospitals, health centres, pharmacies, etc.)
- Search & retrieve **services** with age, kind, and geo-location filters
- Search & retrieve **service providers**
- Search & retrieve **service kinds**, optionally filtered by collection
- List and look up **special days** (public holidays affecting opening hours)

## Tools

| Tool | Description |
|------|-------------|
| `search_locations` | Search locations by name, county, kind, geo-coordinates, opening hours, health region, or tags |
| `get_location` | Get full details for a specific location (address, hours, contacts, facilities, services) |
| `search_services` | Search for health services — filter by name, kind, age, location, health region |
| `get_service` | Get full details for a specific service |
| `search_service_providers` | Search for service provider organisations |
| `get_service_provider` | Get details for a specific service provider |
| `search_service_kinds` | List service kinds, optionally filtered by collection slug |
| `get_service_kind` | Get details for a specific service kind by slug |
| `list_special_days` | List bank holidays and special days affecting service hours |
| `get_special_day` | Get details for a specific special day |

## Prompts

Pre-built prompt templates for common HSE service queries. MCP clients can present these as quick-start actions.

| Prompt | Arguments | Description |
|--------|-----------|-------------|
| `find-local-services` | `service_type` (required), `location` (required) | Find health services of a given type near a location in Ireland |
| `check-opening-hours` | `service_name` (required), `day` (required), `time` (optional) | Check if a service is open on a specific day and optionally at a specific time |
| `find-gp` | `location` (required) | Find GP (General Practitioner) services in a location in Ireland |

## Resources

MCP Resources provide pre-aggregated reference data that clients can read directly, without pagination.

| Resource URI | Name | Description |
|---|---|---|
| `hse://service-kinds` | HSE Service Kinds | Complete list of HSE health service kind taxonomies |
| `hse://special-days` | HSE Special Days | Bank holidays and exceptional closures affecting HSE service hours |

Both resources automatically fetch and merge all pages from the underlying API (with a 20-page safety cap) and return a single JSON array.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **18 or later**

### Build

```bash
git clone https://github.com/DanStuartDept/hse-servicefinder-mcp.git
cd hse-servicefinder-mcp
npm install
npm run build
```

Note the **absolute path** to `build/index.js` — you'll need it for client configuration:

```bash
# Print the full path you'll use below
echo "$(pwd)/build/index.js"
```

---

## Install via GitHub Packages

The easiest way to use this MCP server — no cloning, building, or source code management required. The package is **private** and only accessible to members of the `DanStuartDept` GitHub organisation.

### One-time setup

Configure npm to use GitHub Packages for the `@danstuartdept` scope:

1. Create a GitHub **Personal Access Token (classic)** with `read:packages` scope
2. Add to your `~/.npmrc`:

```
@danstuartdept:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_PAT
```

Then add the server to any MCP client using the configs below. The `-y` flag auto-confirms the npx install prompt. Package updates are published automatically when a new version is released.

### Claude Code

```bash
claude mcp add hse-servicefinder npx -- -y @danstuartdept/hse-servicefinder-mcp
```

### Claude Desktop

Edit your `claude_desktop_config.json`:

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

### Cursor

Edit `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project-level):

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

### VS Code + GitHub Copilot

Create `.vscode/mcp.json` in your project root:

```json
{
  "servers": {
    "hse-servicefinder": {
      "command": "npx",
      "args": ["-y", "@danstuartdept/hse-servicefinder-mcp"]
    }
  }
}
```

> **Note:** VS Code uses `"servers"` as the key (not `"mcpServers"`).

### Windsurf

Edit `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "hse-servicefinder": {
      "command": "npx",
      "args": ["-y", "@danstuartdept/hse-servicefinder-mcp"],
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

### JetBrains IDEs

Create `.mcp.json` in your project root:

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

---

## Client Setup (from source)

If you prefer to run from source instead of the package, clone and build first (see [Getting Started](#getting-started)), then use the configs below.

Pick whichever client you use — each section is self-contained.

### Claude Code

Run from your terminal:

```bash
claude mcp add hse-servicefinder node /absolute/path/to/hse-servicefinder-mcp/build/index.js
```

To scope it to a specific project only:

```bash
claude mcp add --scope project hse-servicefinder node /absolute/path/to/hse-servicefinder-mcp/build/index.js
```

**Verify:** `claude mcp list` — you should see `hse-servicefinder` listed with its 10 tools.

---

### Claude Desktop

Edit your `claude_desktop_config.json`:

| OS | Config file location |
|----|---------------------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |

Add the following:

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

**Verify:**

1. **Quit** Claude Desktop completely (not just close the window) and reopen it
2. Look for the **hammer icon** (🔨) at the bottom of the chat input
3. Click it — you should see the 10 HSE Service Finder tools listed

---

### Cursor

Cursor supports both **global** and **project-level** MCP config.

**Global** — edit `~/.cursor/mcp.json`:

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

**Project-level** — create `.cursor/mcp.json` in your project root with the same content.

**Verify:**

1. Open **Cursor Settings** → **Tools & Integrations** → **MCP Tools**
2. `hse-servicefinder` should appear with a green status indicator
3. In Cursor's Agent mode chat, the tools will be available automatically

---

### VS Code + GitHub Copilot

Requires **VS Code 1.99+** and the **GitHub Copilot Chat** extension.

**Workspace config** (recommended — can be committed to version control) — create `.vscode/mcp.json` in your project root:

```json
{
  "servers": {
    "hse-servicefinder": {
      "command": "node",
      "args": ["/absolute/path/to/hse-servicefinder-mcp/build/index.js"]
    }
  }
}
```

**User-level config** — run **MCP: Open User Configuration** from the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and add the same config.

> **Note:** VS Code uses `"servers"` as the key (not `"mcpServers"`).

**Verify:**

1. Open the `.vscode/mcp.json` file — you should see a **Start** button appear via CodeLens
2. Click it to start the server
3. Open Copilot Chat, switch to **Agent** mode
4. Click the **tools icon** in the chat box to see the HSE tools listed

---

### JetBrains IDEs (WebStorm, IntelliJ, etc.)

Requires version **2025.2+** with AI Assistant enabled.

**Auto-configure** — go to **Settings** → **Tools** → **MCP Server** → **Enable MCP Server**. If you already have the server configured elsewhere, click **Auto-Configure**.

**Manual config** — create `.mcp.json` in your project root:

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

**Verify:**

1. Open **Settings** → **Tools** → **MCP Server** to see the server status
2. Tools will appear in the AI Assistant chat when using agent mode

---

### Windsurf

**Config file:**

```
~/.codeium/windsurf/mcp_config.json
```

Or open it via: **Windsurf Settings** → **Cascade** → **MCP Servers** → **Edit Config**

Add:

```json
{
  "mcpServers": {
    "hse-servicefinder": {
      "command": "node",
      "args": ["/absolute/path/to/hse-servicefinder-mcp/build/index.js"],
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

**Verify:**

1. **Quit and reopen** Windsurf
2. Open the **Cascade** panel → click the **MCPs icon** (top-right)
3. `hse-servicefinder` should show with a green status

> **Note:** Windsurf has a limit of 100 total tools across all MCP servers. This server uses 10.

---

### MCP Inspector (Testing & Debugging)

A visual tool for testing the server interactively — great for debugging.

```bash
npm run inspector
```

Or run directly:

```bash
npx @modelcontextprotocol/inspector node /absolute/path/to/hse-servicefinder-mcp/build/index.js
```

This starts a web UI at `http://127.0.0.1:6274` where you can browse tools, test with custom parameters, and inspect responses.

---

## Quick Reference

| Client | Config file | Key | Restart needed? |
|--------|------------|-----|----------------|
| Claude Code | CLI command | — | No |
| Claude Desktop | `claude_desktop_config.json` | `mcpServers` | Yes (full quit) |
| Cursor (global) | `~/.cursor/mcp.json` | `mcpServers` | Yes |
| Cursor (project) | `.cursor/mcp.json` | `mcpServers` | Yes |
| VS Code + Copilot (workspace) | `.vscode/mcp.json` | `servers` | No (click Start) |
| VS Code + Copilot (user) | Command Palette → MCP: Open User Config | `servers` | No |
| JetBrains | `.mcp.json` or Settings UI | `mcpServers` | No |
| Windsurf | `~/.codeium/windsurf/mcp_config.json` | `mcpServers` | Yes (full quit) |
| MCP Inspector | CLI command | — | — |

## Troubleshooting

### Server not connecting

1. Make sure you've run `npm run build` and the `build/index.js` file exists
2. Test the path works: `node /your/path/to/build/index.js` — it should hang (waiting for stdio input), not error
3. Use **absolute paths**, not relative ones
4. Check Node.js is v18+: `node --version`

### Tools not showing up

1. Some clients require a full quit and restart (not just close window)
2. Check the MCP server logs in your client's developer tools / output panel
3. Run the MCP Inspector to verify the server works independently

### Permission errors on macOS

If you see permission prompts on first run, grant them — the server needs to execute as a Node.js process. Subsequent runs should work without prompts.

## Example Queries

Once connected, try asking your AI assistant:

- "Find hospitals in Cork"
- "What pharmacies are open on Sundays in Dublin?"
- "Show me mental health services near Galway"
- "What services does Beaumont Hospital offer?"
- "Are there any bank holiday opening hour changes coming up?"
- "Find GPs in the South East health region"
- "What health centres are within 10km of coordinates -6.26, 53.35?"

## Development

### Available Scripts

| Script             | Description                                    |
| ------------------ | ---------------------------------------------- |
| `npm run build`    | Compile TypeScript and make the entry executable |
| `npm test`         | Run unit tests with Vitest                     |
| `npm run test:watch` | Run tests in watch mode                      |
| `npm run lint`     | Lint source files with ESLint                  |
| `npm run typecheck`| Type-check without emitting files              |
| `npm run inspector`| Launch the MCP Inspector UI                   |

### Tech Stack

- **TypeScript** with ES modules (target: ES2022, module: Node16)
- **@modelcontextprotocol/sdk** — `McpServer` + `StdioServerTransport`
- **Zod** for input validation
- **Node.js native `fetch`** (Node 18+)

### Project Structure

```
hse-servicefinder-mcp/
├── .github/workflows/
│   ├── ci.yml                # Lint + build + typecheck + test on PRs and pushes
│   └── release.yml           # Semantic version tag + changelog on main
├── .npmrc                    # Registry config for @danstuartdept scope
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

This project is licensed under the [MIT](https://opensource.org/licenses/MIT) license.
