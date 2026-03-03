#!/usr/bin/env node

/**
 * @module index
 *
 * MCP server entry point for the HSE Service Finder API.
 *
 * Registers all MCP tools for searching and retrieving health service
 * locations, services, service providers, and special days, then starts
 * the server using the stdio transport.
 */

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
  searchServiceKinds,
  getServiceKind,
} from "./hse-api.js";

/**
 * The MCP server instance for the HSE Service Finder.
 * Exposes tools that wrap the public HSE Service Finder REST API.
 */
const server = new McpServer({
  name: "hse-servicefinder",
  version: "1.0.0",
});

/**
 * Builds a structured error response for MCP tool handlers.
 * Parses the HTTP status code from the error message thrown by fetchJson.
 *
 * @param err - The caught error.
 * @param suggestion - Optional suggestion to help the AI assistant self-correct.
 * @returns An MCP tool response containing a JSON error object.
 */
function errorResponse(err: unknown, suggestion?: string) {
  const message = err instanceof Error ? err.message : String(err);
  const statusMatch = message.match(/HSE API error: (\d+)/);
  const status = statusMatch ? parseInt(statusMatch[1], 10) : undefined;
  return {
    content: [{
      type: "text" as const,
      text: JSON.stringify({
        error: true,
        ...(status ? { status } : {}),
        message,
        ...(suggestion ? { suggestion } : {}),
      }, null, 2),
    }],
  };
}

// ---------------------------------------------------------------------------
// Location Tools
// ---------------------------------------------------------------------------

/**
 * Tool: search_locations
 *
 * Searches for HSE health service locations in Ireland with rich filtering
 * options including geo-coordinates, county, kind, opening hours, and tags.
 */
server.tool(
  "search_locations",
  "Search for HSE health service locations in Ireland. Filter by name, county, kind, geo-coordinates, opening hours, and more.",
  {
    /** @param page - Page number for pagination. */
    page: z.number().int().optional().describe("Page number for pagination"),
    /** @param page_size - Number of results per page. */
    page_size: z.number().int().optional().describe("Number of results per page"),
    /** @param loc - GeoLocation point in `longitude,latitude` format. */
    loc: z.string().optional().describe("GeoLocation point: longitude,latitude"),
    /** @param kind - Filter by kind (partial match, comma-separated). */
    kind: z.string().optional().describe("Filter by kind (partial match, comma-separated)"),
    /** @param name - Filter by name (partial match). */
    name: z.string().optional().describe("Filter by name (partial match)"),
    /** @param county - Filter by county name (exact match). */
    county: z.string().optional().describe("Filter by county name (exact match)"),
    /** @param iha - Filter by IHA name (partial match). */
    iha: z.string().optional().describe("Filter by IHA name (partial match)"),
    /** @param health_region - Filter by Health Region name (partial match). */
    health_region: z.string().optional().describe("Filter by Health Region name (partial match)"),
    /** @param day - Day filter: MM-DD for special days, 1–7 for weekdays. */
    day: z.string().optional().describe("Filter by day: MM-DD for special days, weekday number 1-7 for regular days"),
    /** @param time - Time of day in HH:MM format. Must be combined with `day`. */
    time: z.string().optional().describe("Filter by time of day (HH:MM). Must be used with 'day'"),
    /** @param order_by - Sort field: `name` or `created_at`. Prefix `-` for descending. */
    order_by: z.string().optional().describe("Sort by 'name' or 'created_at' (prefix with '-' for descending)"),
    /** @param kind_slugs - Kind slug filter (exact match, comma-separated). */
    kind_slugs: z.string().optional().describe("Filter by kind slugs (exact match, comma-separated)"),
    /** @param collection - Collection slug filter. */
    collection: z.string().optional().describe("Filter by collection slug"),
    /** @param locale - Locale for disruption text language. */
    locale: z.string().optional().describe("Language for disruption text"),
    /** @param external_id - External ID value. Use with `external_system`. */
    external_id: z.string().optional().describe("Filter by external ID (use with external_system)"),
    /** @param external_system - External system kind. Use with `external_id`. */
    external_system: z.string().optional().describe("Filter by external system (use with external_id)"),
    /** @param tag - List of tag values to filter by. */
    tag: z.array(z.string()).optional().describe("Filter by tags"),
  },
  async (args) => {
    try {
      return { content: [{ type: "text" as const, text: JSON.stringify(await searchLocations(args), null, 2) }] };
    } catch (err) {
      return errorResponse(err);
    }
  },
);

/**
 * Tool: get_location
 *
 * Retrieves detailed information about a specific HSE location
 * identified by its unique slug.
 */
server.tool(
  "get_location",
  "Get detailed information about a specific HSE location by its slug identifier.",
  {
    /** @param slug - The unique slug identifier of the location. */
    slug: z.string().describe("The location slug identifier"),
  },
  async (args) => {
    try {
      return { content: [{ type: "text" as const, text: JSON.stringify(await getLocation(args.slug), null, 2) }] };
    } catch (err) {
      return errorResponse(err, "Use search_locations to find a valid slug first");
    }
  },
);

// ---------------------------------------------------------------------------
// Service Tools
// ---------------------------------------------------------------------------

/**
 * Tool: search_services
 *
 * Searches for HSE health services with filters for name, kind,
 * location, opening hours, age eligibility, and more.
 */
server.tool(
  "search_services",
  "Search for HSE health services. Filter by name, kind, location, opening hours, age, and more.",
  {
    /** @param page - Page number for pagination. */
    page: z.number().int().optional().describe("Page number for pagination"),
    /** @param page_size - Number of results per page. */
    page_size: z.number().int().optional().describe("Number of results per page"),
    /** @param loc - GeoLocation point in `longitude,latitude` format. */
    loc: z.string().optional().describe("GeoLocation point: longitude,latitude"),
    /** @param name - Filter by service name (partial match). */
    name: z.string().optional().describe("Filter by name (partial match)"),
    /** @param location_slug - Filter by location slug (exact match). */
    location_slug: z.string().optional().describe("Filter by location slug (exact match)"),
    /** @param kind - Filter by service kind (partial match). */
    kind: z.string().optional().describe("Filter by service kind (partial match)"),
    /** @param day - Day filter: MM-DD for special days, 1–7 for weekdays. */
    day: z.string().optional().describe("Filter by day: MM-DD for special days, weekday number 1-7 for regular days"),
    /** @param time - Time of day in HH:MM format. Must be combined with `day`. */
    time: z.string().optional().describe("Filter by time of day (HH:MM). Must be used with 'day'"),
    /** @param age - Filter services available for a specific age. */
    age: z.string().optional().describe("Filter by age eligibility"),
    /** @param iha - Filter by IHA name (partial match). */
    iha: z.string().optional().describe("Filter by IHA name (partial match)"),
    /** @param health_region - Filter by Health Region name (partial match). */
    health_region: z.string().optional().describe("Filter by Health Region name (partial match)"),
    /** @param service_provider - Filter by ServiceProvider name (partial match). */
    service_provider: z.string().optional().describe("Filter by ServiceProvider name (partial match)"),
    /** @param department_name - Filter by department name (partial match). */
    department_name: z.string().optional().describe("Filter by department name (partial match)"),
    /** @param order_by - Sort field. Prefix `-` for descending. */
    order_by: z.string().optional().describe("Sort results (prefix with '-' for descending)"),
    /** @param collection - Collection slug filter. */
    collection: z.string().optional().describe("Filter by collection slug"),
    /** @param locale - Locale for disruption text language. */
    locale: z.string().optional().describe("Language for disruption text"),
    /** @param external_id - External ID value. Use with `external_system`. */
    external_id: z.string().optional().describe("Filter by external ID (use with external_system)"),
    /** @param external_system - External system kind. Use with `external_id`. */
    external_system: z.string().optional().describe("Filter by external system (use with external_id)"),
    /** @param additional_field - Filter by additional field value. */
    additional_field: z.string().optional().describe("Filter by additional field value"),
  },
  async (args) => {
    try {
      return { content: [{ type: "text" as const, text: JSON.stringify(await searchServices(args), null, 2) }] };
    } catch (err) {
      return errorResponse(err);
    }
  },
);

/**
 * Tool: get_service
 *
 * Retrieves detailed information about a specific HSE service
 * identified by its unique slug.
 */
server.tool(
  "get_service",
  "Get detailed information about a specific HSE service by its slug identifier.",
  {
    /** @param slug - The unique slug identifier of the service. */
    slug: z.string().describe("The service slug identifier"),
  },
  async (args) => {
    try {
      return { content: [{ type: "text" as const, text: JSON.stringify(await getService(args.slug), null, 2) }] };
    } catch (err) {
      return errorResponse(err, "Use search_services to find a valid slug first");
    }
  },
);

// ---------------------------------------------------------------------------
// Service Provider Tools
// ---------------------------------------------------------------------------

/**
 * Tool: search_service_providers
 *
 * Searches for HSE service providers with optional name and kind filters.
 */
server.tool(
  "search_service_providers",
  "Search for HSE service providers. Filter by name or kind.",
  {
    /** @param page - Page number for pagination. */
    page: z.number().int().optional().describe("Page number for pagination"),
    /** @param kind - Filter by kind (exact match). */
    kind: z.string().optional().describe("Filter by kind (exact match)"),
    /** @param name - Filter by name (partial match). */
    name: z.string().optional().describe("Filter by name (partial match)"),
  },
  async (args) => {
    try {
      return { content: [{ type: "text" as const, text: JSON.stringify(await searchServiceProviders(args), null, 2) }] };
    } catch (err) {
      return errorResponse(err);
    }
  },
);

/**
 * Tool: get_service_provider
 *
 * Retrieves detailed information about a specific HSE service provider
 * identified by its numeric ID.
 */
server.tool(
  "get_service_provider",
  "Get detailed information about a specific HSE service provider by its ID.",
  {
    /** @param id - The unique integer identifier of the service provider. */
    id: z.number().int().describe("The service provider ID"),
  },
  async (args) => {
    try {
      return { content: [{ type: "text" as const, text: JSON.stringify(await getServiceProvider(args.id), null, 2) }] };
    } catch (err) {
      return errorResponse(err, "Use search_service_providers to find a valid ID first");
    }
  },
);

// ---------------------------------------------------------------------------
// Service Kind Tools
// ---------------------------------------------------------------------------

/**
 * Tool: search_service_kinds
 *
 * Lists HSE service kinds with optional collection filter.
 */
server.tool(
  "search_service_kinds",
  "List HSE service kinds, optionally filtered by collection slug.",
  {
    /** @param page - Page number for pagination. */
    page: z.number().int().optional().describe("Page number for pagination"),
    /** @param page_size - Number of results per page. */
    page_size: z.number().int().optional().describe("Number of results per page"),
    /** @param collection - Collection slug filter. */
    collection: z.string().optional().describe("Filter by collection slug"),
  },
  async (args) => {
    try {
      return { content: [{ type: "text" as const, text: JSON.stringify(await searchServiceKinds(args), null, 2) }] };
    } catch (err) {
      return errorResponse(err);
    }
  },
);

/**
 * Tool: get_service_kind
 *
 * Retrieves details about a specific HSE service kind identified by its slug.
 */
server.tool(
  "get_service_kind",
  "Get details about a specific HSE service kind by its slug.",
  {
    /** @param slug - The unique slug identifier of the service kind. */
    slug: z.string().describe("The service kind slug identifier"),
  },
  async (args) => {
    try {
      return { content: [{ type: "text" as const, text: JSON.stringify(await getServiceKind(args.slug), null, 2) }] };
    } catch (err) {
      return errorResponse(err, "Use search_service_kinds to find a valid slug first");
    }
  },
);

// ---------------------------------------------------------------------------
// Special Days Tools
// ---------------------------------------------------------------------------

/**
 * Tool: list_special_days
 *
 * Lists special days (e.g., public holidays) that may affect
 * HSE service opening hours.
 */
server.tool(
  "list_special_days",
  "List special days (e.g., public holidays) that may affect HSE service opening hours.",
  {
    /** @param page - Page number for pagination. */
    page: z.number().int().optional().describe("Page number for pagination"),
  },
  async (args) => {
    try {
      return { content: [{ type: "text" as const, text: JSON.stringify(await listSpecialDays(args), null, 2) }] };
    } catch (err) {
      return errorResponse(err);
    }
  },
);

/**
 * Tool: get_special_day
 *
 * Retrieves details about a specific special day by its numeric ID.
 */
server.tool(
  "get_special_day",
  "Get details about a specific special day by its ID.",
  {
    /** @param id - The unique integer identifier of the special day. */
    id: z.number().int().describe("The special day ID"),
  },
  async (args) => {
    try {
      return { content: [{ type: "text" as const, text: JSON.stringify(await getSpecialDay(args.id), null, 2) }] };
    } catch (err) {
      return errorResponse(err, "Use list_special_days to find a valid ID first");
    }
  },
);

// ---------------------------------------------------------------------------
// Server Bootstrap
// ---------------------------------------------------------------------------

/**
 * Initialises and starts the MCP server on the stdio transport.
 *
 * Creates a {@link StdioServerTransport}, connects the server, and logs
 * a startup message to stderr (stdout is reserved for MCP protocol traffic).
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("HSE ServiceFinder MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
