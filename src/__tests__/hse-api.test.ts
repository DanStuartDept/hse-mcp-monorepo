import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  buildQueryString,
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
  findServicesAtLocation,
  BASE_URL,
} from "../hse-api.js";

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

describe("buildQueryString", () => {
  it("returns empty string for empty params", () => {
    expect(buildQueryString({})).toBe("");
  });

  it("builds query string from simple params", () => {
    const result = buildQueryString({ name: "Dublin", county: "Dublin" });
    expect(result).toBe("?name=Dublin&county=Dublin");
  });

  it("skips undefined values", () => {
    const result = buildQueryString({ name: "test", county: undefined });
    expect(result).toBe("?name=test");
  });

  it("handles numeric values", () => {
    const result = buildQueryString({ page: 2, page_size: 10 });
    expect(result).toBe("?page=2&page_size=10");
  });

  it("handles array values with multiple entries", () => {
    const result = buildQueryString({ tag: ["urgent", "walk-in"] });
    expect(result).toBe("?tag=urgent&tag=walk-in");
  });
});

function mockSuccessResponse(data: unknown) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(data),
  });
}

function mockErrorResponse(status: number, statusText: string) {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    statusText,
  });
}

describe("searchLocations", () => {
  it("calls the correct URL with no params", async () => {
    const mockData = { count: 0, next: null, previous: null, results: [] };
    mockSuccessResponse(mockData);

    const result = await searchLocations();
    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/location/`);
    expect(result).toEqual(mockData);
  });

  it("calls the correct URL with params", async () => {
    const mockData = { count: 1, next: null, previous: null, results: [{ name: "Test" }] };
    mockSuccessResponse(mockData);

    await searchLocations({ name: "Dublin", county: "Dublin" });
    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/location/?name=Dublin&county=Dublin`,
    );
  });

  it("throws on API error", async () => {
    mockErrorResponse(500, "Internal Server Error");
    await expect(searchLocations()).rejects.toThrow("HSE API error: 500");
  });
});

describe("getLocation", () => {
  it("calls the correct URL with slug", async () => {
    const mockData = { id: 1, name: "Test Location", slug: "test-location" };
    mockSuccessResponse(mockData);

    const result = await getLocation("test-location");
    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/location/test-location/`);
    expect(result).toEqual(mockData);
  });

  it("encodes special characters in slug", async () => {
    mockSuccessResponse({ id: 1, name: "Test" });
    await getLocation("test location");
    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/location/test%20location/`);
  });
});

describe("searchServices", () => {
  it("calls the correct URL with no params", async () => {
    const mockData = { count: 0, next: null, previous: null, results: [] };
    mockSuccessResponse(mockData);

    const result = await searchServices();
    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/service/`);
    expect(result).toEqual(mockData);
  });

  it("calls the correct URL with params", async () => {
    mockSuccessResponse({ count: 0, next: null, previous: null, results: [] });
    await searchServices({ kind: "pharmacy", page: 1 });
    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/service/?kind=pharmacy&page=1`,
    );
  });
});

describe("getService", () => {
  it("calls the correct URL with slug", async () => {
    const mockData = { name: "Test Service", slug: "test-service" };
    mockSuccessResponse(mockData);

    const result = await getService("test-service");
    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/service/test-service/`);
    expect(result).toEqual(mockData);
  });
});

describe("searchServiceProviders", () => {
  it("calls the correct URL with no params", async () => {
    const mockData = { count: 0, next: null, previous: null, results: [] };
    mockSuccessResponse(mockData);

    const result = await searchServiceProviders();
    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/service-provider/`);
    expect(result).toEqual(mockData);
  });

  it("calls the correct URL with params", async () => {
    mockSuccessResponse({ count: 0, next: null, previous: null, results: [] });
    await searchServiceProviders({ name: "HSE", kind: "hospital" });
    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/service-provider/?name=HSE&kind=hospital`,
    );
  });
});

describe("getServiceProvider", () => {
  it("calls the correct URL with id", async () => {
    const mockData = { name: "Test Provider" };
    mockSuccessResponse(mockData);

    const result = await getServiceProvider(42);
    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/service-provider/42/`);
    expect(result).toEqual(mockData);
  });
});

describe("listSpecialDays", () => {
  it("calls the correct URL with no params", async () => {
    const mockData = { count: 0, next: null, previous: null, results: [] };
    mockSuccessResponse(mockData);

    const result = await listSpecialDays();
    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/special-days/`);
    expect(result).toEqual(mockData);
  });

  it("calls the correct URL with page param", async () => {
    mockSuccessResponse({ count: 0, next: null, previous: null, results: [] });
    await listSpecialDays({ page: 2 });
    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/special-days/?page=2`);
  });
});

describe("getSpecialDay", () => {
  it("calls the correct URL with id", async () => {
    const mockData = { id: 1, name: "Christmas Day", date: "2024-12-25" };
    mockSuccessResponse(mockData);

    const result = await getSpecialDay(1);
    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/special-days/1/`);
    expect(result).toEqual(mockData);
  });
});

describe("searchServiceKinds", () => {
  it("calls the correct URL with no params", async () => {
    const mockData = { current_page: 1, count: 0, next: null, previous: null, results: [] };
    mockSuccessResponse(mockData);

    const result = await searchServiceKinds();
    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/service-kind/`);
    expect(result).toEqual(mockData);
  });

  it("calls the correct URL with params", async () => {
    mockSuccessResponse({ current_page: 1, count: 0, next: null, previous: null, results: [] });
    await searchServiceKinds({ collection: "vaccine", page: 1 });
    expect(mockFetch).toHaveBeenCalledWith(
      `${BASE_URL}/service-kind/?collection=vaccine&page=1`,
    );
  });

  it("throws on API error", async () => {
    mockErrorResponse(404, "Not Found");
    await expect(searchServiceKinds()).rejects.toThrow("HSE API error: 404");
  });
});

describe("getServiceKind", () => {
  it("calls the correct URL with slug", async () => {
    const mockData = { id: 1, name: "Vaccine", slug: "vaccine" };
    mockSuccessResponse(mockData);

    const result = await getServiceKind("vaccine");
    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/service-kind/vaccine/`);
    expect(result).toEqual(mockData);
  });

  it("encodes special characters in slug", async () => {
    mockSuccessResponse({ id: 2, name: "Test Kind", slug: "test kind" });
    await getServiceKind("test kind");
    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/service-kind/test%20kind/`);
  });
});

describe("findServicesAtLocation", () => {
  it("returns location and services when location is found", async () => {
    const mockLocation = { id: 1, name: "Cork University Hospital", slug: "cork-university-hospital", address1: "Wilton", town: "Cork", county: "Cork" };
    const mockLocResponse = { current_page: 1, count: 1, next: null, previous: null, results: [mockLocation] };
    const mockServices = { current_page: 1, count: 2, next: null, previous: null, results: [{ name: "Service A", slug: "service-a" }, { name: "Service B", slug: "service-b" }] };

    mockSuccessResponse(mockLocResponse);
    mockSuccessResponse(mockServices);

    const result = await findServicesAtLocation("Cork University Hospital");

    expect(result.location).toEqual(mockLocation);
    expect(result.services).toEqual(mockServices);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/location/?name=Cork+University+Hospital&page_size=1`);
    expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/service/?location_slug=cork-university-hospital`);
  });

  it("returns null location and empty services when location is not found", async () => {
    const mockLocResponse = { current_page: 1, count: 0, next: null, previous: null, results: [] };

    mockSuccessResponse(mockLocResponse);

    const result = await findServicesAtLocation("Nonexistent Hospital");

    expect(result.location).toBeNull();
    expect(result.services.count).toBe(0);
    expect(result.services.results).toEqual([]);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
