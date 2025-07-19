import 'server-only';

const BASE_FLIGHT_API_URL = process.env.BASE_FLIGHT_API_URL;
const API_KEY = process.env.FLIGHT_API_KEY; 
import { DepartureFlight } from "@/types/flights";
import { mockDepartureFlights } from '@/lib/mock/mockFlightData'; 

/**
 * Fetches current departure flight data for Belfast City Airport.
 *
 * @returns {Promise<FlightData>}
 */
export async function getDepartureFlightData(): Promise<DepartureFlight[]> {
    const url = `${BASE_FLIGHT_API_URL}airports/EGAC/flights/departures`;
    console.log("Fetching departure flight data from:", url);
    console.log("Using API Key:", API_KEY);
  
    try {
      
      // const res = await fetch(url, {
      //   headers: API_KEY ? { 'x-apikey': API_KEY } : {},
      // });
  
      // if (!res.ok) {
      //   console.error(`Failed to fetch departure data: ${res.status} ${res.statusText}`);
      //   throw new Error(`Failed to fetch departure data: ${res.statusText}`);
      // }
      const data = mockDepartureFlights;
      console.log("Departure data fetched successfully:", data);
      return data as DepartureFlight[];
  
    } catch (error) {
      console.error("Error fetching departure data:", error);
      return [];
    }
  }
