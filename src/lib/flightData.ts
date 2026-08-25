import 'server-only';

const FLIGHT_API_URL = "https://api.adsb.lol/v2";



import {
    LocationAircraftResponse,
    LocationAircraftData,
    RouteResponse,
    routeSetRequest
} from "@/types/flights";

export async function getFlightDataByLocation(lat: number, lon: number): Promise<LocationAircraftData[]> {
    const url = `${FLIGHT_API_URL}/point/${lat}/${lon}/100`;
    console.log(`[SERVER] Fetching flight data for location: lat=${lat}, lon=${lon} from ${url}`);

    try {
        const response = await fetch(url, {
            cache: 'no-store',
            headers: {
                "User-Agent": "Flipboard Plane Tracker (personal) (https://github.com/bradley3322)"
            }
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`[SERVER] Failed to fetch flight data: ${response.status} ${response.statusText}. Response: ${errorBody}`);
            throw new Error(`Failed to fetch flight data: ${response.statusText}`);
        }

        const locationFlightsResponse: LocationAircraftResponse = await response.json();
        const flights: LocationAircraftData[] = locationFlightsResponse.ac;
        return flights;

    } catch (error) {
        console.error("[SERVER] Error fetching or processing flights data by location:", error);
        return [];
    }
}

export async function getFlightDataByRouteSet(planes: routeSetRequest): Promise<RouteResponse | null> {
    const url = `https://api.adsb.lol/api/0/routeset`;
    console.log(`[SERVER] Fetching route data for planes: ${JSON.stringify(planes)} from ${url}`);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Origin": "https://api.adsb.lol",
                "Referer": "https://api.adsb.lol/docs",
                "User-Agent": "Flipboard Plane Tracker (personal) (https://github.com/bradley3322)"
            },
            body: JSON.stringify(planes),
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`[SERVER] Failed to fetch route data: ${response.status} ${response.statusText}. Response: ${errorBody}`);
            throw new Error(`Failed to fetch route data: ${response.statusText}`);
        }
        console.log(`[SERVER] response of route response: ${JSON.stringify(response)} from ${url}`);

        const flightRouteResponse: RouteResponse = await response.json();
        console.log(`[SERVER] response of route lookup: ${JSON.stringify(flightRouteResponse)} from ${url}`);
        return flightRouteResponse;
    } catch (error) {
        console.error("[SERVER] Error fetching or processing route data:", error);
        return null;
    }
}


