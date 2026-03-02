import { describe, it, expect, vi, beforeEach } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Mock the hse-api module
vi.mock("../hse-api.js", () => ({
  searchLocations: vi.fn().mockResolvedValue({ current_page: 1, count: 0, next: null, previous: null, results: [] }),
  getLocation: vi.fn().mockResolvedValue({ id: 1, name: "Test", slug: "test" }),
  searchServices: vi.fn().mockResolvedValue({ current_page: 1, count: 0, next: null, previous: null, results: [] }),
  getService: vi.fn().mockResolvedValue({ name: "Test Service", slug: "test-service" }),
  searchServiceProviders: vi.fn().mockResolvedValue({ current_page: 1, count: 0, next: null, previous: null, results: [] }),
  getServiceProvider: vi.fn().mockResolvedValue({ name: "Test Provider" }),
  listSpecialDays: vi.fn().mockResolvedValue({ current_page: 1, count: 0, next: null, previous: null, results: [] }),
  getSpecialDay: vi.fn().mockResolvedValue({ id: 1, name: "Christmas", date: "2024-12-25" }),
  searchServiceKinds: vi.fn().mockResolvedValue({ current_page: 1, count: 0, next: null, previous: null, results: [] }),
  getServiceKind: vi.fn().mockResolvedValue({ id: 1, name: "Vaccine", slug: "vaccine" }),
}));

describe("MCP Server Tool Registration", () => {
  let server: McpServer;

  beforeEach(() => {
    server = new McpServer({
      name: "hse-servicefinder-test",
      version: "1.0.0",
    });
  });

  it("can register a tool with name, description, and schema", () => {
    expect(() => {
      server.tool(
        "test_tool",
        "A test tool",
        {
          name: z.string().describe("A name"),
        },
        async () => ({
          content: [{ type: "text" as const, text: "test" }],
        }),
      );
    }).not.toThrow();
  });

  it("can register a tool with no parameters", () => {
    expect(() => {
      server.tool(
        "no_params_tool",
        "A tool with no parameters",
        async () => ({
          content: [{ type: "text" as const, text: "test" }],
        }),
      );
    }).not.toThrow();
  });

  it("can register all HSE ServiceFinder tools", () => {
    expect(() => {
      // search_locations
      server.tool(
        "search_locations",
        "Search for HSE health service locations",
        {
          name: z.string().optional().describe("Filter by name"),
          county: z.string().optional().describe("Filter by county"),
          page: z.number().int().optional().describe("Page number"),
        },
        async () => ({
          content: [{ type: "text" as const, text: "{}" }],
        }),
      );

      // get_location
      server.tool(
        "get_location",
        "Get a specific location",
        {
          slug: z.string().describe("Location slug"),
        },
        async () => ({
          content: [{ type: "text" as const, text: "{}" }],
        }),
      );

      // search_services
      server.tool(
        "search_services",
        "Search for HSE services",
        {
          name: z.string().optional().describe("Filter by name"),
          kind: z.string().optional().describe("Filter by kind"),
        },
        async () => ({
          content: [{ type: "text" as const, text: "{}" }],
        }),
      );

      // get_service
      server.tool(
        "get_service",
        "Get a specific service",
        {
          slug: z.string().describe("Service slug"),
        },
        async () => ({
          content: [{ type: "text" as const, text: "{}" }],
        }),
      );

      // search_service_providers
      server.tool(
        "search_service_providers",
        "Search for HSE service providers",
        {
          name: z.string().optional().describe("Filter by name"),
        },
        async () => ({
          content: [{ type: "text" as const, text: "{}" }],
        }),
      );

      // get_service_provider
      server.tool(
        "get_service_provider",
        "Get a specific service provider",
        {
          id: z.number().int().describe("Provider ID"),
        },
        async () => ({
          content: [{ type: "text" as const, text: "{}" }],
        }),
      );

      // list_special_days
      server.tool(
        "list_special_days",
        "List special days",
        {
          page: z.number().int().optional().describe("Page number"),
        },
        async () => ({
          content: [{ type: "text" as const, text: "{}" }],
        }),
      );

      // get_special_day
      server.tool(
        "get_special_day",
        "Get a specific special day",
        {
          id: z.number().int().describe("Special day ID"),
        },
        async () => ({
          content: [{ type: "text" as const, text: "{}" }],
        }),
      );

      // search_service_kinds
      server.tool(
        "search_service_kinds",
        "List HSE service kinds",
        {
          page: z.number().int().optional().describe("Page number"),
          page_size: z.number().int().optional().describe("Results per page"),
          collection: z.string().optional().describe("Filter by collection slug"),
        },
        async () => ({
          content: [{ type: "text" as const, text: "{}" }],
        }),
      );

      // get_service_kind
      server.tool(
        "get_service_kind",
        "Get a specific service kind",
        {
          slug: z.string().describe("Service kind slug"),
        },
        async () => ({
          content: [{ type: "text" as const, text: "{}" }],
        }),
      );
    }).not.toThrow();
  });

  it("validates required parameters with zod schemas", () => {
    const schema = {
      slug: z.string().describe("Required slug"),
    };

    const parseResult = z.object(schema).safeParse({});
    expect(parseResult.success).toBe(false);

    const validResult = z.object(schema).safeParse({ slug: "test-slug" });
    expect(validResult.success).toBe(true);
  });

  it("validates optional parameters with zod schemas", () => {
    const schema = {
      name: z.string().optional().describe("Optional name"),
      page: z.number().int().optional().describe("Optional page"),
    };

    const emptyResult = z.object(schema).safeParse({});
    expect(emptyResult.success).toBe(true);

    const fullResult = z.object(schema).safeParse({ name: "test", page: 1 });
    expect(fullResult.success).toBe(true);
  });

  it("rejects invalid parameter types", () => {
    const schema = {
      page: z.number().int().describe("Page number"),
    };

    const result = z.object(schema).safeParse({ page: "not-a-number" });
    expect(result.success).toBe(false);
  });
});
