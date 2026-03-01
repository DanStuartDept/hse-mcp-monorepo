#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import {
  searchLocations,
  getLocation,
  searchServices,
  getService,
  searchServiceProviders,
  getServiceProvider,
  listSpecialDays,
  getSpecialDay,
} from "./hse-api.js";

const server = new McpServer({
  name: "hse-servicefinder",
  version: "1.0.0",
});

// --- Location Tools ---

server.tool(
  "search_locations",
  "Search for HSE health service locations in Ireland. Filter by name, county, kind, geo-coordinates, opening hours, and more.",
  {
    page: z.number().int().optional().describe("Page number for pagination"),
    page_size: z.number().int().optional().describe("Number of results per page"),
    loc: z.string().optional().describe("GeoLocation point: longitude,latitude"),
    kind: z.string().optional().describe("Filter by kind (partial match, comma-separated)"),
    name: z.string().optional().describe("Filter by name (partial match)"),
    county: z.string().optional().describe("Filter by county name (exact match)"),
    iha: z.string().optional().describe("Filter by IHA name (partial match)"),
    health_region: z.string().optional().describe("Filter by Health Region name (partial match)"),
    day: z.string().optional().describe("Filter by day: MM-DD for special days, weekday number 1-7 for regular days"),
    time: z.string().optional().describe("Filter by time of day (HH:MM). Must be used with 'day'"),
    order_by: z.string().optional().describe("Sort by 'name' or 'created_at' (prefix with '-' for descending)"),
    kind_slugs: z.string().optional().describe("Filter by kind slugs (exact match, comma-separated)"),
    collection: z.string().optional().describe("Filter by collection slug"),
    locale: z.string().optional().describe("Language for disruption text"),
    external_id: z.string().optional().describe("Filter by external ID (use with external_system)"),
    external_system: z.string().optional().describe("Filter by external system (use with external_id)"),
    tag: z.array(z.string()).optional().describe("Filter by tags"),
  },
  async (args) => {
    const result = await searchLocations(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
);

server.tool(
  "get_location",
  "Get detailed information about a specific HSE location by its slug identifier.",
  {
    slug: z.string().describe("The location slug identifier"),
  },
  async (args) => {
    const result = await getLocation(args.slug);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
);

// --- Service Tools ---

server.tool(
  "search_services",
  "Search for HSE health services. Filter by name, kind, location, opening hours, age, and more.",
  {
    page: z.number().int().optional().describe("Page number for pagination"),
    page_size: z.number().int().optional().describe("Number of results per page"),
    loc: z.string().optional().describe("GeoLocation point: longitude,latitude"),
    name: z.string().optional().describe("Filter by name (partial match)"),
    location_slug: z.string().optional().describe("Filter by location slug (exact match)"),
    kind: z.string().optional().describe("Filter by service kind (partial match)"),
    day: z.string().optional().describe("Filter by day: MM-DD for special days, weekday number 1-7 for regular days"),
    time: z.string().optional().describe("Filter by time of day (HH:MM). Must be used with 'day'"),
    age: z.string().optional().describe("Filter by age eligibility"),
    iha: z.string().optional().describe("Filter by IHA name (partial match)"),
    health_region: z.string().optional().describe("Filter by Health Region name (partial match)"),
    service_provider: z.string().optional().describe("Filter by ServiceProvider name (partial match)"),
    department_name: z.string().optional().describe("Filter by department name (partial match)"),
    order_by: z.string().optional().describe("Sort results (prefix with '-' for descending)"),
    collection: z.string().optional().describe("Filter by collection slug"),
    locale: z.string().optional().describe("Language for disruption text"),
    external_id: z.string().optional().describe("Filter by external ID (use with external_system)"),
    external_system: z.string().optional().describe("Filter by external system (use with external_id)"),
    additional_field: z.string().optional().describe("Filter by additional field value"),
  },
  async (args) => {
    const result = await searchServices(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
);

server.tool(
  "get_service",
  "Get detailed information about a specific HSE service by its slug identifier.",
  {
    slug: z.string().describe("The service slug identifier"),
  },
  async (args) => {
    const result = await getService(args.slug);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
);

// --- Service Provider Tools ---

server.tool(
  "search_service_providers",
  "Search for HSE service providers. Filter by name or kind.",
  {
    page: z.number().int().optional().describe("Page number for pagination"),
    kind: z.string().optional().describe("Filter by kind (exact match)"),
    name: z.string().optional().describe("Filter by name (partial match)"),
  },
  async (args) => {
    const result = await searchServiceProviders(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
);

server.tool(
  "get_service_provider",
  "Get detailed information about a specific HSE service provider by its ID.",
  {
    id: z.number().int().describe("The service provider ID"),
  },
  async (args) => {
    const result = await getServiceProvider(args.id);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
);

// --- Special Days Tools ---

server.tool(
  "list_special_days",
  "List special days (e.g., public holidays) that may affect HSE service opening hours.",
  {
    page: z.number().int().optional().describe("Page number for pagination"),
  },
  async (args) => {
    const result = await listSpecialDays(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
);

server.tool(
  "get_special_day",
  "Get details about a specific special day by its ID.",
  {
    id: z.number().int().describe("The special day ID"),
  },
  async (args) => {
    const result = await getSpecialDay(args.id);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
);

// --- Start Server ---

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("HSE ServiceFinder MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
