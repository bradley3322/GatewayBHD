import 'server-only';

const BASE_FLIGHT_API_URL = process.env.BASE_FLIGHT_API_URL;
const API_KEY = process.env.FLIGHT_API_KEY;

import {
  FlightApiResponse,
  RawFlightData,
  ArrivalFlight,
  DepartureFlight,
  Flight,
  ScheduledArrivalFlight,
  ScheduledDepartureFlight
} from "@/types/flights";
import { getCurrentAndNextDayUtcTime } from '@/utils/utils';


export async function getFlightData(): Promise<Flight[]> {
  const { startTimeUTC, endTimeUTC } = getCurrentAndNextDayUtcTime();

  console.log(`[SERVER] Fetching flight data at ${new Date().toLocaleString()} from: ${BASE_FLIGHT_API_URL}airports/EGAC/flights?type=Airline&start=${startTimeUTC}&end=${endTimeUTC}`);

  if (!API_KEY) {
    console.error("[SERVER] API_KEY is not defined. Cannot fetch live data.");
    return [];
  }
  console.log("[SERVER] Using API Key:", API_KEY.substring(0, 5) + '...');

  try {
    const url = `${BASE_FLIGHT_API_URL}airports/EGAC/flights?type=Airline&start=${startTimeUTC}&end=${endTimeUTC}`;
    const res = await fetch(url, {
      headers: {
        'x-apikey': API_KEY
      },

      cache: 'no-store'
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`[SERVER] Failed to fetch flight data: ${res.status} ${res.statusText}. Response: ${errorBody}`);
      throw new Error(`Failed to fetch flight data: ${res.statusText}`);
    }

    const apiResponse: FlightApiResponse = await res.json();
    console.log("[SERVER] Raw flight data fetched successfully:", apiResponse);

    const arrivals: ArrivalFlight[] = apiResponse.arrivals.map(
      (flight: RawFlightData) => ({ ...flight, kind: 'arrival' })
    );
    const scheduledArrivals: ScheduledArrivalFlight[] = apiResponse.scheduled_arrivals.map(
      (flight: RawFlightData) => ({ ...flight, kind: 'arrival' })
    );

    const departures: DepartureFlight[] = apiResponse.departures.map(
      (flight: RawFlightData) => ({ ...flight, kind: 'departure' })
    );

    const scheduledDepartures: ScheduledDepartureFlight[] = apiResponse.scheduled_departures.map(
      (flight: RawFlightData) => ({ ...flight, kind: 'departure' })
    );

    const allFlights: Flight[] = [...arrivals, ...departures, ...scheduledArrivals, ...scheduledDepartures];

    console.log("[SERVER] Processed flights data:", allFlights.length, "flights");
    return allFlights;

  } catch (error) {
    console.error("[SERVER] Error fetching or processing flights data:", error);
    return [];
  }
}