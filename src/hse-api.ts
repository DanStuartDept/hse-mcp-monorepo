const BASE_URL = "https://servicefinder.hse.ie/api";

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface LocationResult {
  id: number;
  name: string;
  slug: string;
  address1: string;
  address2?: string;
  town: string;
  county: string;
  eircode?: string;
  google_maps_link?: string;
  active?: boolean;
  description?: string;
  kind?: string;
  kind_slug?: string;
  geolocation?: string;
  website?: string;
  distance?: string;
  updated_at?: string;
  disruptions?: string;
  iha?: NestedIHA;
  opening_hours?: OpeningHour[];
  special_day_opening_hour?: SpecialDayOpeningHours[];
  contact_names?: ContactName[];
  availability?: Availability[];
  facilities?: Facility[];
  additional_links?: AdditionalLink[];
  visiting_informations?: VisitingInformation[];
  support_informations?: SupportInformation[];
  departments?: Department[];
  social_media?: SocialMedia[];
  services?: ServiceMinimum[];
  tags?: Tag[];
}

export interface NestedHealthRegion {
  id?: number;
  name: string;
}

export interface NestedIHA {
  id?: number;
  name: string;
  health_region: NestedHealthRegion;
}

export interface OpeningHour {
  day: number;
  day_name?: string;
  opening_hour: string;
  closing_hour: string;
}

export interface SpecialDay {
  name: string;
  date: string;
  updated_at?: string;
  day?: number;
  day_name?: string;
}

export interface SpecialDayOpeningHours {
  special_day: SpecialDay;
  opening_hour?: string | null;
  closing_hour?: string | null;
  closed: boolean;
}

export interface Contact {
  kind?: string;
  value: string;
}

export interface ContactName {
  name?: string | null;
  title?: string;
  contacts: Contact[];
  consultant_contact?: boolean;
  kind?: string;
}

export interface Availability {
  min_age?: number | null;
  max_age?: number | null;
}

export interface Facility {
  name: string;
}

export interface AdditionalLink {
  title: string;
  url: string;
}

export interface VisitingInformation {
  kind: string;
  description: string;
}

export interface SupportInformation {
  kind: string;
  description: string;
}

export interface Department {
  name: string;
}

export interface SocialMedia {
  id?: number;
  platform: string;
  url: string;
}

export interface ServiceMinimum {
  name: string;
  slug: string;
}

export interface Tag {
  id?: number;
  name: string;
  slug: string;
}

export interface ServiceResult {
  id?: number;
  name: string;
  slug: string;
  description?: string;
  kind?: string;
  location?: LocationResult;
  opening_hours?: OpeningHour[];
  special_day_opening_hour?: SpecialDayOpeningHours[];
  contact_names?: ContactName[];
  availability?: Availability[];
  updated_at?: string;
}

export interface ServiceProviderResult {
  name: string;
  kind?: string;
  location?: { name: string };
  opening_hours?: OpeningHour[];
}

export interface SpecialDayResult {
  id?: number;
  name: string;
  date: string;
  updated_at?: string;
  day?: number;
  day_name?: string;
}

export interface LocationSearchParams {
  page?: number;
  page_size?: number;
  loc?: string;
  kind?: string;
  name?: string;
  county?: string;
  iha?: string;
  health_region?: string;
  day?: string;
  time?: string;
  order_by?: string;
  kind_slugs?: string;
  collection?: string;
  locale?: string;
  external_id?: string;
  external_system?: string;
  tag?: string[];
}

export interface ServiceSearchParams {
  page?: number;
  page_size?: number;
  loc?: string;
  name?: string;
  location_slug?: string;
  kind?: string;
  day?: string;
  time?: string;
  age?: string;
  iha?: string;
  health_region?: string;
  service_provider?: string;
  department_name?: string;
  order_by?: string;
  collection?: string;
  locale?: string;
  external_id?: string;
  external_system?: string;
  additional_field?: string;
}

export interface ServiceProviderSearchParams {
  page?: number;
  kind?: string;
  name?: string;
}

export interface SpecialDaysSearchParams {
  page?: number;
}

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

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HSE API error: ${response.status} ${response.statusText} for ${url}`);
  }
  return response.json() as Promise<T>;
}

export async function searchLocations(params: LocationSearchParams = {}): Promise<PaginatedResponse<LocationResult>> {
  const qs = buildQueryString(params as Record<string, string | number | string[] | undefined>);
  return fetchJson<PaginatedResponse<LocationResult>>(`${BASE_URL}/location/${qs}`);
}

export async function getLocation(slug: string): Promise<LocationResult> {
  return fetchJson<LocationResult>(`${BASE_URL}/location/${encodeURIComponent(slug)}/`);
}

export async function searchServices(params: ServiceSearchParams = {}): Promise<PaginatedResponse<ServiceResult>> {
  const qs = buildQueryString(params as Record<string, string | number | string[] | undefined>);
  return fetchJson<PaginatedResponse<ServiceResult>>(`${BASE_URL}/service/${qs}`);
}

export async function getService(slug: string): Promise<ServiceResult> {
  return fetchJson<ServiceResult>(`${BASE_URL}/service/${encodeURIComponent(slug)}/`);
}

export async function searchServiceProviders(params: ServiceProviderSearchParams = {}): Promise<PaginatedResponse<ServiceProviderResult>> {
  const qs = buildQueryString(params as Record<string, string | number | string[] | undefined>);
  return fetchJson<PaginatedResponse<ServiceProviderResult>>(`${BASE_URL}/service-provider/${qs}`);
}

export async function getServiceProvider(id: number): Promise<ServiceProviderResult> {
  return fetchJson<ServiceProviderResult>(`${BASE_URL}/service-provider/${id}/`);
}

export async function listSpecialDays(params: SpecialDaysSearchParams = {}): Promise<PaginatedResponse<SpecialDayResult>> {
  const qs = buildQueryString(params as Record<string, string | number | string[] | undefined>);
  return fetchJson<PaginatedResponse<SpecialDayResult>>(`${BASE_URL}/special-days/${qs}`);
}

export async function getSpecialDay(id: number): Promise<SpecialDayResult> {
  return fetchJson<SpecialDayResult>(`${BASE_URL}/special-days/${id}/`);
}

// Exported for testing
export { BASE_URL, buildQueryString, fetchJson };
