'use client';

export interface LocationAircraftData {
  hex: string;
  type: string;
  flight: string;
  r?: string;
  t?: string;
  desc?: string;
  alt_baro?: string;
  alt_geom?: number;
  gs?: number;
  true_heading?: number;
  mag_heading?: number;
  squawk?: string;
  emergency?: string;
  category?: string;
  nav_qnh?: number;
  nav_altitude_mcp?: number;
  nav_modes?: unknown[];
  lat: number;
  lon: number;
  nic?: number;
  rc?: number;
  seen_pos?: number;
  version?: number;
  nac_p?: number;
  nac_v?: number;
  sil?: number;
  sil_type?: string;
  sda?: number;
  alert?: number;
  spi?: number;
  mlat: unknown[];
  tisb: unknown[];
  messages?: number;
  seen?: number;
  rssi?: number;
  dst?: number;
  dir?: number;
}

export interface LocationAircraftResponse {
  ac: LocationAircraftData[];
  msg: string;
  now: number;
  total: number;
  ctime: number;
  ptime: number;
}

export interface AirportInfo {
  alt_feet: number;
  alt_meters: number;
  countryiso2: string;
  iata: string;
  icao: string;
  lat: number;
  location: string;
  lon: number;
  name: string;
}

export interface RouteResponseItem {
  _airport_codes_iata: string;
  _airports: AirportInfo[];
  airline_code: string;
  airport_codes: string;
  callsign: string;
  number: string;
  plausible: boolean;
}

export type RouteResponse = RouteResponseItem[];

export interface Flight {
  routeInformation: RouteResponseItem | null;
  aircraftLocationData: LocationAircraftData | null;
}

export interface routeSetRequestPlane {
  callsign: string,
  lat: number,
  lng: number
}

export interface routeSetRequest {
  planes: routeSetRequestPlane[]
}

export interface FlightBoardData {
  callsign: string,
  ident: string,
  operator: string,
  destination: { name: string },
  origin: { name: string },
  status: string,
  estimated_off: string,
  type: string,
  kind: string,
  routeInformation: RouteResponseItem | null,
  aircraftLocationData: LocationAircraftData | null
}




