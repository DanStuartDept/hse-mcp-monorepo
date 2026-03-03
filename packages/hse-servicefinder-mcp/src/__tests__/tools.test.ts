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

import {
  getLocation,
  getService,
  getServiceProvider,
  getServiceKind,
  getSpecialDay,
  searchLocations,
  searchServices,
} from "../hse-api.js";

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
      server.tool("search_locations", "Search for HSE health service locations", {
        name: z.string().optional().describe("Filter by name"),
        county: z.string().optional().describe("Filter by county"),
        page: z.number().int().optional().describe("Page number"),
      }, async () => ({ content: [{ type: "text" as const, text: "{}" }] }));

      server.tool("get_location", "Get a specific location", {
        slug: z.string().describe("Location slug"),
      }, async () => ({ content: [{ type: "text" as const, text: "{}" }] }));

      server.tool("search_services", "Search for HSE services", {
        name: z.string().optional().describe("Filter by name"),
        kind: z.string().optional().describe("Filter by kind"),
      }, async () => ({ content: [{ type: "text" as const, text: "{}" }] }));

      server.tool("get_service", "Get a specific service", {
        slug: z.string().describe("Service slug"),
      }, async () => ({ content: [{ type: "text" as const, text: "{}" }] }));

      server.tool("search_service_providers", "Search for HSE service providers", {
        name: z.string().optional().describe("Filter by name"),
      }, async () => ({ content: [{ type: "text" as const, text: "{}" }] }));

      server.tool("get_service_provider", "Get a specific service provider", {
        id: z.number().int().describe("Provider ID"),
      }, async () => ({ content: [{ type: "text" as const, text: "{}" }] }));

      server.tool("list_special_days", "List special days", {
        page: z.number().int().optional().describe("Page number"),
      }, async () => ({ content: [{ type: "text" as const, text: "{}" }] }));

      server.tool("get_special_day", "Get a specific special day", {
        id: z.number().int().describe("Special day ID"),
      }, async () => ({ content: [{ type: "text" as const, text: "{}" }] }));

      server.tool("search_service_kinds", "List HSE service kinds", {
        page: z.number().int().optional().describe("Page number"),
        page_size: z.number().int().optional().describe("Results per page"),
        collection: z.string().optional().describe("Filter by collection slug"),
      }, async () => ({ content: [{ type: "text" as const, text: "{}" }] }));

      server.tool("get_service_kind", "Get a specific service kind", {
        slug: z.string().describe("Service kind slug"),
      }, async () => ({ content: [{ type: "text" as const, text: "{}" }] }));
    }).not.toThrow();
  });

  it("validates required parameters with zod schemas", () => {
    const schema = { slug: z.string().describe("Required slug") };
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
    const schema = { page: z.number().int().describe("Page number") };
    const result = z.object(schema).safeParse({ page: "not-a-number" });
    expect(result.success).toBe(false);
  });
});

describe("Structured Error Responses", () => {
  // Mirror the errorResponse function from index.ts for testing
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

  async function simulateToolHandler(
    apiFn: () => Promise<unknown>,
    suggestion?: string,
  ) {
    try {
      const result = await apiFn();
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    } catch (err) {
      return errorResponse(err, suggestion);
    }
  }

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("get_location 404 returns structured error with status and suggestion", async () => {
    vi.mocked(getLocation).mockRejectedValueOnce(
      new Error("HSE API error: 404 Not Found for https://servicefinder.hse.ie/servicefinder/v1/location/bad-slug/"),
    );
    const result = await simulateToolHandler(
      () => getLocation("bad-slug"),
      "Use search_locations to find a valid slug first",
    );
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toBe(true);
    expect(parsed.status).toBe(404);
    expect(parsed.message).toContain("HSE API error: 404");
    expect(parsed.suggestion).toBe("Use search_locations to find a valid slug first");
  });

  it("get_service 404 returns structured error with status and suggestion", async () => {
    vi.mocked(getService).mockRejectedValueOnce(
      new Error("HSE API error: 404 Not Found for https://servicefinder.hse.ie/servicefinder/v1/service/bad-slug/"),
    );
    const result = await simulateToolHandler(
      () => getService("bad-slug"),
      "Use search_services to find a valid slug first",
    );
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toBe(true);
    expect(parsed.status).toBe(404);
    expect(parsed.suggestion).toBe("Use search_services to find a valid slug first");
  });

  it("get_service_provider 404 returns structured error with suggestion", async () => {
    vi.mocked(getServiceProvider).mockRejectedValueOnce(
      new Error("HSE API error: 404 Not Found for https://servicefinder.hse.ie/servicefinder/v1/service-provider/999/"),
    );
    const result = await simulateToolHandler(
      () => getServiceProvider(999),
      "Use search_service_providers to find a valid ID first",
    );
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toBe(true);
    expect(parsed.status).toBe(404);
    expect(parsed.suggestion).toBe("Use search_service_providers to find a valid ID first");
  });

  it("get_service_kind 404 returns structured error with suggestion", async () => {
    vi.mocked(getServiceKind).mockRejectedValueOnce(
      new Error("HSE API error: 404 Not Found for https://servicefinder.hse.ie/servicefinder/v1/service-kind/bad-slug/"),
    );
    const result = await simulateToolHandler(
      () => getServiceKind("bad-slug"),
      "Use search_service_kinds to find a valid slug first",
    );
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toBe(true);
    expect(parsed.status).toBe(404);
    expect(parsed.suggestion).toBe("Use search_service_kinds to find a valid slug first");
  });

  it("get_special_day 404 returns structured error with suggestion", async () => {
    vi.mocked(getSpecialDay).mockRejectedValueOnce(
      new Error("HSE API error: 404 Not Found for https://servicefinder.hse.ie/servicefinder/v1/special-days/999/"),
    );
    const result = await simulateToolHandler(
      () => getSpecialDay(999),
      "Use list_special_days to find a valid ID first",
    );
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toBe(true);
    expect(parsed.status).toBe(404);
    expect(parsed.suggestion).toBe("Use list_special_days to find a valid ID first");
  });

  it("unexpected network error returns error without status", async () => {
    vi.mocked(getService).mockRejectedValueOnce(new Error("fetch failed"));
    const result = await simulateToolHandler(
      () => getService("any-slug"),
      "Use search_services to find a valid slug first",
    );
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toBe(true);
    expect(parsed.status).toBeUndefined();
    expect(parsed.message).toBe("fetch failed");
    expect(parsed.suggestion).toBe("Use search_services to find a valid slug first");
  });

  it("search tool error returns error without suggestion", async () => {
    vi.mocked(searchLocations).mockRejectedValueOnce(
      new Error("HSE API error: 500 Internal Server Error for https://servicefinder.hse.ie/servicefinder/v1/location/"),
    );
    const result = await simulateToolHandler(() => searchLocations({}));
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toBe(true);
    expect(parsed.status).toBe(500);
    expect(parsed.suggestion).toBeUndefined();
  });

  it("non-Error thrown values are handled gracefully", async () => {
    vi.mocked(searchServices).mockRejectedValueOnce("string error");
    const result = await simulateToolHandler(() => searchServices({}));
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toBe(true);
    expect(parsed.message).toBe("string error");
    expect(parsed.status).toBeUndefined();
  });

  it("success path returns valid JSON without error field", async () => {
    vi.mocked(getLocation).mockResolvedValueOnce({
      id: 1, name: "Test Location", slug: "test-location",
      address1: "123 Main St", town: "Dublin", county: "Dublin",
    });
    const result = await simulateToolHandler(
      () => getLocation("test-location"),
      "Use search_locations to find a valid slug first",
    );
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toBeUndefined();
    expect(parsed.name).toBe("Test Location");
  });

  it("parses 500 status from API error message", async () => {
    vi.mocked(getLocation).mockRejectedValueOnce(
      new Error("HSE API error: 500 Internal Server Error for https://servicefinder.hse.ie/servicefinder/v1/location/test/"),
    );
    const result = await simulateToolHandler(
      () => getLocation("test"),
      "Use search_locations to find a valid slug first",
    );
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toBe(true);
    expect(parsed.status).toBe(500);
    expect(parsed.suggestion).toBe("Use search_locations to find a valid slug first");
  });
});
