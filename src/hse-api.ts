/**
 * Base URL for the HSE Service Finder API.
 * All endpoint requests are built relative to this URL.
 */
const BASE_URL = "https://servicefinder.hse.ie/servicefinder/v1";

/**
 * Generic wrapper for paginated API responses from the HSE Service Finder API.
 *
 * @typeParam T - The type of each item in the `results` array.
 */
export interface PaginatedResponse<T> {
  /** The current page number. */
  current_page: number;
  /** Total number of results matching the query across all pages. */
  count: number;
  /** URL to the next page of results, or `null` if this is the last page. */
  next: string | null;
  /** URL to the previous page of results, or `null` if this is the first page. */
  previous: string | null;
  /** Array of result items for the current page. */
  results: T[];
}

/**
 * Represents an HSE health service location (e.g., hospital, health centre, pharmacy).
 */
export interface LocationResult {
  /** Unique numeric identifier for the location. */
  id: number;
  /** Display name of the location. */
  name: string;
  /** URL-friendly unique slug identifier for the location. */
  slug: string;
  /** Primary address line. */
  address1: string;
  /** Secondary address line. */
  address2?: string;
  /** Town where the location is situated. */
  town: string;
  /** County where the location is situated. */
  county: string;
  /** Irish postal code (Eircode) for the location. */
  eircode?: string;
  /** URL linking to the location on Google Maps. */
  google_maps_link?: string;
  /** Whether the location is currently active. */
  active?: boolean;
  /** Free-text description of the location. */
  description?: string;
  /** Human-readable kind/type of the location (e.g., "Hospital"). */
  kind?: string;
  /** URL-friendly slug for the location kind. */
  kind_slug?: string;
  /** Geolocation coordinates as a string (e.g., "POINT(longitude latitude)"). */
  geolocation?: string;
  /** URL of the location's website. */
  website?: string;
  /** Distance from a search point, when a geo-location query is used. */
  distance?: string;
  /** ISO 8601 timestamp of the last update. */
  updated_at?: string;
  /** Active disruption notices for this location. */
  disruptions?: Disruption[];
  /** The Integrated Health Area (IHA) this location belongs to. */
  iha?: NestedIHA;
  /** Regular weekly opening hours for this location. */
  opening_hours?: OpeningHour[];
  /** Opening hours that apply on special days (e.g., public holidays). */
  special_day_opening_hour?: SpecialDayOpeningHours[];
  /** Contact persons and their contact details. */
  contact_names?: ContactName[];
  /** Age-based availability restrictions for this location. */
  availability?: Availability[];
  /** Facilities available at this location (e.g., parking, wheelchair access). */
  facilities?: Facility[];
  /** Additional external links related to this location. */
  additional_links?: AdditionalLink[];
  /** Visiting information and policies. */
  visiting_informations?: VisitingInformation[];
  /** Support information and resources. */
  support_informations?: SupportInformation[];
  /** Departments within this location. */
  departments?: Department[];
  /** Social media profiles for this location. */
  social_media?: SocialMedia[];
  /** Minimal service records associated with this location. */
  services?: ServiceMinimum[];
  /** Tags associated with this location. */
  tags?: Tag[];
}

/**
 * A compact representation of an HSE Health Region.
 */
export interface NestedHealthRegion {
  /** Unique numeric identifier for the health region. */
  id?: number;
  /** Display name of the health region. */
  name: string;
}

/**
 * A compact representation of an Integrated Health Area (IHA), including its parent health region.
 */
export interface NestedIHA {
  /** Unique numeric identifier for the IHA. */
  id?: number;
  /** Display name of the IHA. */
  name: string;
  /** The health region this IHA belongs to. */
  health_region: NestedHealthRegion;
}

/**
 * Represents a regular weekly opening-hour entry for a location or service.
 */
export interface OpeningHour {
  /** Day of the week as a number (1 = Monday, 7 = Sunday). */
  day: number;
  /** Human-readable name of the day (e.g., "Monday"). */
  day_name?: string;
  /** Opening time in HH:MM format. */
  opening_hour: string;
  /** Closing time in HH:MM format. */
  closing_hour: string;
}

/**
 * Represents a special day (e.g., a public holiday) that may affect service hours.
 */
export interface SpecialDay {
  /** Name of the special day (e.g., "Christmas Day"). */
  name: string;
  /** Date of the special day in ISO 8601 format (YYYY-MM-DD). */
  date: string;
  /** ISO 8601 timestamp of the last update. */
  updated_at?: string;
  /** Day of the week as a number (1 = Monday, 7 = Sunday). */
  day?: number;
  /** Human-readable name of the day (e.g., "Wednesday"). */
  day_name?: string;
}

/**
 * Opening hours that apply on a specific special day.
 */
export interface SpecialDayOpeningHours {
  /** The special day these hours apply to. */
  special_day: SpecialDay;
  /** Opening time in HH:MM format, or `null` if closed. */
  opening_hour?: string | null;
  /** Closing time in HH:MM format, or `null` if closed. */
  closing_hour?: string | null;
  /** Whether the location/service is closed on this special day. */
  closed: boolean;
}

/**
 * A single contact detail entry (e.g., phone number, email address).
 */
export interface Contact {
  /** The type of contact (e.g., "phone", "email", "fax"). */
  kind?: string;
  /** The contact value (e.g., a phone number or email address). */
  value: string;
}

/**
 * A named contact person or department with associated contact details.
 */
export interface ContactName {
  /** Name of the contact person or department. */
  name?: string | null;
  /** Title or role of the contact. */
  title?: string;
  /** List of contact detail entries for this person/department. */
  contacts: Contact[];
  /** Whether this is a consultant-level contact. */
  consultant_contact?: boolean;
  /** The kind/category of this contact entry. */
  kind?: string;
}

/**
 * Age-based availability restrictions for a service or location.
 */
export interface Availability {
  /** Minimum age eligible for the service, or `null` if unrestricted. */
  min_age?: number | null;
  /** Maximum age eligible for the service, or `null` if unrestricted. */
  max_age?: number | null;
}

/**
 * A facility available at a location (e.g., parking, wheelchair access).
 */
export interface Facility {
  /** Name of the facility. */
  name: string;
}

/**
 * An additional external link related to a location or service.
 */
export interface AdditionalLink {
  /** Display title for the link. */
  title: string;
  /** URL of the link. */
  url: string;
}

/**
 * Visiting information and policies for a location.
 */
export interface VisitingInformation {
  /** The kind/category of visiting information. */
  kind: string;
  /** Detailed description of the visiting policy. */
  description: string;
}

/**
 * Support information and resources available at a location.
 */
export interface SupportInformation {
  /** The kind/category of support information. */
  kind: string;
  /** Detailed description of the support resource. */
  description: string;
}

/**
 * A department within a location.
 */
export interface Department {
  /** Name of the department. */
  name: string;
}

/**
 * A social media profile associated with a location.
 */
export interface SocialMedia {
  /** Unique numeric identifier for the social media entry. */
  id?: number;
  /** Social media platform name (e.g., "Twitter", "Facebook"). */
  platform: string;
  /** URL of the social media profile. */
  url: string;
}

/**
 * A minimal service record containing only name and slug.
 * Used when services are embedded within location responses.
 */
export interface ServiceMinimum {
  /** Display name of the service. */
  name: string;
  /** URL-friendly unique slug identifier for the service. */
  slug: string;
}

/**
 * A tag used to categorize locations.
 */
export interface Tag {
  /** Unique numeric identifier for the tag. */
  id?: number;
  /** Display name of the tag. */
  name: string;
  /** URL-friendly slug for the tag. */
  slug: string;
}

/**
 * An active disruption notice for a location or service.
 */
export interface Disruption {
  /** Unique numeric identifier for the disruption. */
  id: number;
  /** Short title of the disruption. */
  title: string;
  /** Full description of the disruption. */
  description: string;
  /** ISO 8601 timestamp of the last update. */
  updated_at: string;
  /** ISO 8601 date when the disruption expires. */
  expiration_date: string;
  /** Whether to show a chip/badge indicator for this disruption. */
  disruption_chip: boolean;
}

/**
 * An additional custom field attached to a service.
 */
export interface AdditionalField {
  /** Human-readable label for the field. */
  label: string;
  /** The field type identifier. */
  field_type: string;
  /** URL-friendly clean name for the field. */
  clean_name: string;
  /** Value of the field, or `null` if not set. */
  value: string | null;
}

/**
 * A medical specialty nested inside a service kind.
 */
export interface Specialty {
  /** Display name of the specialty. */
  name: string;
  /** Optional description of the specialty. */
  description?: string | null;
}

/**
 * Detailed representation of a service kind as embedded in a service response.
 */
export interface ServiceKindDetail {
  /** Display name of the service kind. */
  name: string;
  /** URL-friendly slug for the service kind. */
  slug: string;
  /** Optional description of the service kind. */
  description?: string | null;
  /** Name of the associated service provider, or `null`. */
  service_provider?: string | null;
  /** Optional specialty associated with this service kind. */
  specialty?: Specialty | null;
}

/**
 * A service kind entry returned by the service-kind list or detail endpoints.
 */
export interface ServiceKindResult {
  /** Unique numeric identifier for the service kind. */
  id?: number;
  /** Display name of the service kind. */
  name: string;
  /** URL-friendly slug for the service kind. */
  slug: string;
}

/**
 * Query parameters for the service-kind list endpoint (`GET /service-kind/`).
 */
export interface ServiceKindSearchParams {
  /** Page number within the paginated result set. */
  page?: number;
  /** Number of results to return per page. */
  page_size?: number;
  /** Filter by collection slug. */
  collection?: string;
}

/**
 * Represents an HSE health service returned by the service search or detail endpoints.
 */
export interface ServiceResult {
  /** Unique numeric identifier for the service. */
  id?: number;
  /** Display name of the service. */
  name: string;
  /** URL-friendly unique slug identifier for the service. */
  slug: string;
  /** Free-text description of the service. */
  description?: string;
  /** The kind/type of service. */
  kind?: string;
  /** Detailed service kind information. */
  service_kind?: ServiceKindDetail;
  /** The location where this service is provided. */
  location?: LocationResult;
  /** Regular weekly opening hours for this service. */
  opening_hours?: OpeningHour[];
  /** Opening hours that apply on special days. */
  special_day_opening_hour?: SpecialDayOpeningHours[];
  /** Contact persons and their contact details. */
  contact_names?: ContactName[];
  /** Age-based availability restrictions for this service. */
  availability?: Availability[];
  /** ISO 8601 timestamp of the last update. */
  updated_at?: string;
  /** URL of the service's website. */
  website_url?: string;
  /** Whether the service is currently active. */
  active?: boolean;
  /** Additional custom fields attached to this service. */
  additional_fields?: AdditionalField[];
  /** ISO 8601 timestamp when this service was created. */
  created_at?: string;
  /** Social media profiles for this service. */
  social_media?: SocialMedia[];
  /** Active disruption notices for this service. */
  disruptions?: Disruption[];
  /** The department this service belongs to, or `null`. */
  department?: Department | null;
}

/**
 * Represents an HSE service provider returned by the service-provider endpoints.
 */
export interface ServiceProviderResult {
  /** Display name of the service provider. */
  name: string;
  /** The kind/type of service provider. */
  kind?: string;
  /** The location associated with this service provider. */
  location?: { name: string };
  /** Regular weekly opening hours for this service provider. */
  opening_hours?: OpeningHour[];
}

/**
 * Represents a special day entry returned by the special-days endpoints.
 */
export interface SpecialDayResult {
  /** Unique numeric identifier for the special day. */
  id?: number;
  /** Name of the special day (e.g., "St. Patrick's Day"). */
  name: string;
  /** Date in ISO 8601 format (YYYY-MM-DD). */
  date: string;
  /** ISO 8601 timestamp of the last update. */
  updated_at?: string;
  /** Day of the week as a number (1 = Monday, 7 = Sunday). */
  day?: number;
  /** Human-readable name of the day. */
  day_name?: string;
}

/**
 * Query parameters for the location search endpoint (`GET /location/`).
 */
export interface LocationSearchParams {
  /** Page number within the paginated result set. */
  page?: number;
  /** Number of results to return per page. */
  page_size?: number;
  /** GeoLocation point to search by distance. Format: `longitude,latitude`. */
  loc?: string;
  /** Filter by kind (partial match, comma-separated for multiple values). */
  kind?: string;
  /** Filter by name (partial match). */
  name?: string;
  /** Filter by county name (exact match). */
  county?: string;
  /** Filter by Integrated Health Area name (partial match). */
  iha?: string;
  /** Filter by Health Region name (partial match). */
  health_region?: string;
  /** Filter by day: use MM-DD for special days, or a weekday number (1–7) for regular days. Use with `time`. */
  day?: string;
  /** Filter by time of day in HH:MM format. Must be used together with `day`. */
  time?: string;
  /** Sort order: `name` or `created_at`. Prefix with `-` for descending. */
  order_by?: string;
  /** Filter by kind slugs (exact match, comma-separated for multiple). */
  kind_slugs?: string;
  /** Filter by collection slug — returns locations with at least one service in the given collection. */
  collection?: string;
  /** Locale for disruption text language. */
  locale?: string;
  /** Filter by external ID. Must be used together with `external_system`. */
  external_id?: string;
  /** Filter by external system kind. Must be used together with `external_id`. */
  external_system?: string;
  /** List of tags to filter locations by. */
  tag?: string[];
}

/**
 * Query parameters for the service search endpoint (`GET /service/`).
 */
export interface ServiceSearchParams {
  /** Page number within the paginated result set. */
  page?: number;
  /** Number of results to return per page. */
  page_size?: number;
  /** GeoLocation point to search by distance. Format: `longitude,latitude`. */
  loc?: string;
  /** Filter by service name (partial match). */
  name?: string;
  /** Filter by location slug (exact match). */
  location_slug?: string;
  /** Filter by service kind (partial match). */
  kind?: string;
  /** Filter by day: use MM-DD for special days, or a weekday number (1–7) for regular days. Use with `time`. */
  day?: string;
  /** Filter by time of day in HH:MM format. Must be used together with `day`. */
  time?: string;
  /** Filter services available for a specific age. */
  age?: string;
  /** Filter by Integrated Health Area name (partial match). */
  iha?: string;
  /** Filter by Health Region name (partial match). */
  health_region?: string;
  /** Filter by ServiceProvider name (partial match). */
  service_provider?: string;
  /** Filter by department name (partial match). */
  department_name?: string;
  /** Sort order. Prefix with `-` for descending. */
  order_by?: string;
  /** Filter by collection slug. */
  collection?: string;
  /** Locale for disruption text language. */
  locale?: string;
  /** Filter by external ID. Must be used together with `external_system`. */
  external_id?: string;
  /** Filter by external system kind. Must be used together with `external_id`. */
  external_system?: string;
  /** Filter by an additional field value. */
  additional_field?: string;
}

/**
 * Query parameters for the service-provider search endpoint (`GET /service-provider/`).
 */
export interface ServiceProviderSearchParams {
  /** Page number within the paginated result set. */
  page?: number;
  /** Filter by kind (exact match). */
  kind?: string;
  /** Filter by name (partial match). */
  name?: string;
}

/**
 * Query parameters for the special-days list endpoint (`GET /special-days/`).
 */
export interface SpecialDaysSearchParams {
  /** Page number within the paginated result set. */
  page?: number;
}

/**
 * Builds a URL query string from a key-value parameter record.
 * Skips `undefined` values and supports arrays (each element is appended separately).
 *
 * @param params - Record of parameter names to values.
 * @returns A query string prefixed with `?`, or an empty string if no params are set.
 */
function buildQueryString(params: Record<string, string | number | string[] | undefined>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) {
        searchParams.append(key, v);
      }
    } else {
      searchParams.append(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Performs a JSON GET request against the given URL using the native `fetch` API.
 * Throws an error if the response status is not OK.
 *
 * @typeParam T - The expected shape of the JSON response body.
 * @param url - The fully-qualified URL to fetch.
 * @returns The parsed JSON response body.
 * @throws {Error} If the HTTP response status is not in the 2xx range.
 */
async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HSE API error: ${response.status} ${response.statusText} for ${url}`);
  }
  return response.json() as Promise<T>;
}

/**
 * Searches for HSE health service locations with optional filters.
 *
 * @param params - Optional query parameters to filter and paginate results.
 * @returns A paginated response containing matching {@link LocationResult} items.
 */
export async function searchLocations(params: LocationSearchParams = {}): Promise<PaginatedResponse<LocationResult>> {
  const qs = buildQueryString(params as Record<string, string | number | string[] | undefined>);
  return fetchJson<PaginatedResponse<LocationResult>>(`${BASE_URL}/location/${qs}`);
}

/**
 * Retrieves detailed information about a single HSE location by its slug.
 *
 * @param slug - The unique slug identifier of the location.
 * @returns The full {@link LocationResult} for the requested location.
 */
export async function getLocation(slug: string): Promise<LocationResult> {
  return fetchJson<LocationResult>(`${BASE_URL}/location/${encodeURIComponent(slug)}/`);
}

/**
 * Searches for HSE health services with optional filters.
 *
 * @param params - Optional query parameters to filter and paginate results.
 * @returns A paginated response containing matching {@link ServiceResult} items.
 */
export async function searchServices(params: ServiceSearchParams = {}): Promise<PaginatedResponse<ServiceResult>> {
  const qs = buildQueryString(params as Record<string, string | number | string[] | undefined>);
  return fetchJson<PaginatedResponse<ServiceResult>>(`${BASE_URL}/service/${qs}`);
}

/**
 * Retrieves detailed information about a single HSE service by its slug.
 *
 * @param slug - The unique slug identifier of the service.
 * @returns The full {@link ServiceResult} for the requested service.
 */
export async function getService(slug: string): Promise<ServiceResult> {
  return fetchJson<ServiceResult>(`${BASE_URL}/service/${encodeURIComponent(slug)}/`);
}

/**
 * Searches for HSE service providers with optional filters.
 *
 * @param params - Optional query parameters to filter and paginate results.
 * @returns A paginated response containing matching {@link ServiceProviderResult} items.
 */
export async function searchServiceProviders(params: ServiceProviderSearchParams = {}): Promise<PaginatedResponse<ServiceProviderResult>> {
  const qs = buildQueryString(params as Record<string, string | number | string[] | undefined>);
  return fetchJson<PaginatedResponse<ServiceProviderResult>>(`${BASE_URL}/service-provider/${qs}`);
}

/**
 * Retrieves detailed information about a single HSE service provider by its numeric ID.
 *
 * @param id - The unique integer identifier of the service provider.
 * @returns The full {@link ServiceProviderResult} for the requested provider.
 */
export async function getServiceProvider(id: number): Promise<ServiceProviderResult> {
  return fetchJson<ServiceProviderResult>(`${BASE_URL}/service-provider/${id}/`);
}

/**
 * Lists special days (e.g., public holidays) that may affect service opening hours.
 *
 * @param params - Optional query parameters for pagination.
 * @returns A paginated response containing {@link SpecialDayResult} items.
 */
export async function listSpecialDays(params: SpecialDaysSearchParams = {}): Promise<PaginatedResponse<SpecialDayResult>> {
  const qs = buildQueryString(params as Record<string, string | number | string[] | undefined>);
  return fetchJson<PaginatedResponse<SpecialDayResult>>(`${BASE_URL}/special-days/${qs}`);
}

/**
 * Retrieves detailed information about a single special day by its numeric ID.
 *
 * @param id - The unique integer identifier of the special day.
 * @returns The full {@link SpecialDayResult} for the requested special day.
 */
export async function getSpecialDay(id: number): Promise<SpecialDayResult> {
  return fetchJson<SpecialDayResult>(`${BASE_URL}/special-days/${id}/`);
}

/**
 * Searches for HSE service kinds with optional filters.
 *
 * @param params - Optional query parameters to filter and paginate results.
 * @returns A paginated response containing matching {@link ServiceKindResult} items.
 */
export async function searchServiceKinds(params: ServiceKindSearchParams = {}): Promise<PaginatedResponse<ServiceKindResult>> {
  const qs = buildQueryString(params as Record<string, string | number | string[] | undefined>);
  return fetchJson<PaginatedResponse<ServiceKindResult>>(`${BASE_URL}/service-kind/${qs}`);
}

/**
 * Retrieves detailed information about a single HSE service kind by its slug.
 *
 * @param slug - The unique slug identifier of the service kind.
 * @returns The full {@link ServiceKindResult} for the requested service kind.
 */
export async function getServiceKind(slug: string): Promise<ServiceKindResult> {
  return fetchJson<ServiceKindResult>(`${BASE_URL}/service-kind/${encodeURIComponent(slug)}/`);
}

/**
 * Finds health services at a named location in a single compound operation.
 * Internally resolves the location by name and fetches matching services.
 *
 * @param locationName - Human-readable location name to search for.
 * @param serviceParams - Optional service filter parameters (location_slug is set automatically).
 * @returns The matched location (or null) and a paginated list of services.
 */
export async function findServicesAtLocation(
  locationName: string,
  serviceParams: Omit<ServiceSearchParams, "location_slug"> = {},
): Promise<{ location: LocationResult | null; services: PaginatedResponse<ServiceResult> }> {
  const locResults = await searchLocations({ name: locationName, page_size: 1 });
  const location = locResults.results[0] ?? null;

  if (!location) {
    return {
      location: null,
      services: { current_page: 1, count: 0, next: null, previous: null, results: [] },
    };
  }

  const services = await searchServices({ ...serviceParams, location_slug: location.slug });
  return { location, services };
}

// Exported for testing
export { BASE_URL, buildQueryString, fetchJson };
