import { getFlightDataByLocation, getFlightDataByRouteSet } from "@/lib/flightData";
import { routeSetRequest } from "@/types/flights";

export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<Response> {
    const body = await request.json();

    if (body?.lat != null && body?.lon != null) {
        const lat = Number(body.lat);
        const lon = Number(body.lon);

        if (Number.isNaN(lat) || Number.isNaN(lon)) {
            return new Response(JSON.stringify({ error: "Latitude and longitude must be valid numbers" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        try {
            const flights = await getFlightDataByLocation(lat, lon);
            return new Response(JSON.stringify(flights), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            console.error("[API Route] Error in /api/flights location lookup:", error);
            return new Response(JSON.stringify({ error: "Failed to fetch flight data based on location" }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    }

    if (Array.isArray(body?.planes)) {
        const routeRequest = body as routeSetRequest;

        try {
            const routes = await getFlightDataByRouteSet(routeRequest);
            return new Response(JSON.stringify(routes), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            console.error("[API Route] Error in /api/flights route lookup:", error);
            return new Response(JSON.stringify({ error: "Failed to fetch route data for planes" }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    }

    return new Response(JSON.stringify({ error: "Request body must contain either { lat, lon } or { planes: [...] }" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function GET(request: Request): Promise<Response> {
    return new Response(JSON.stringify({ error: "GET is not supported for /api/flights. Use POST with { lat, lon } or { planes: [...] }." }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
    });
}