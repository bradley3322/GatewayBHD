'use client';
export interface AirportInfo {
  code: string;
  code_icao: string;
  code_iata: string | null;
  code_lid: string | null;
  timezone: string;
  name: string;
  city: string;
  airport_info_url: string;
}


export interface RawFlightData {
  ident: string;
  ident_icao: string;
  ident_iata: string | null;
  actual_runway_off: string | null;
  actual_runway_on: string | null;
  fa_flight_id: string;
  operator: string | null;
  operator_icao: string | null;
  operator_iata: string | null;
  flight_number: string | null;
  registration: string | null;
  atc_ident: string | null;
  inbound_fa_flight_id: string | null;
  codeshares: string[];
  codeshares_iata: string[];
  blocked: boolean;
  diverted: boolean;
  cancelled: boolean;
  position_only: boolean;
  origin: AirportInfo;
  destination: AirportInfo;
  departure_delay: number | null;
  arrival_delay: number | null;
  filed_ete: number | null;
  scheduled_out: string | null;
  estimated_out: string | null;
  actual_out: string | null;
  scheduled_off: string | null;
  estimated_off: string | null;
  actual_off: string | null;
  scheduled_on: string | null;
  estimated_on: string | null;
  actual_on: string | null;
  scheduled_in: string | null;
  estimated_in: string | null;
  actual_in: string | null;
  progress_percent: number | null;
  status: string;
  aircraft_type: string | null;
  route_distance: number | null;
  filed_airspeed: number | null;
  filed_altitude: number | null;
  route: string | null;
  baggage_claim: string | null;
  seats_cabin_business: number | null;
  seats_cabin_coach: number | null;
  seats_cabin_first: number | null;
  gate_origin: string | null;
  gate_destination: string | null;
  terminal_origin: string | null;
  terminal_destination: string | null;
  type: string;
}

export interface FlightApiResponse {
  arrivals: RawFlightData[];
  departures: RawFlightData[];
  scheduled_arrivals: RawFlightData[];
  scheduled_departures: RawFlightData[];
}

export interface ArrivalFlight extends RawFlightData {
  kind: 'arrival';
}

export interface ScheduledArrivalFlight extends RawFlightData {
  kind: 'arrival';
}

export interface DepartureFlight extends RawFlightData {
  kind: 'departure';
}
export interface ScheduledDepartureFlight extends RawFlightData {
  kind: 'departure';
}

export type Flight = ArrivalFlight | DepartureFlight | ScheduledArrivalFlight | ScheduledDepartureFlight;