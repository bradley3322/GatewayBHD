import { getFlightDataByLocation, getFlightDataByRouteSet } from "@/lib/flightData";
import { LocationAircraftData, routeSetRequest } from "@/types/flights";

const CACHE_TTL_MS = 50 * 1000;
const apiCache = new Map<string, { expiresAt: number; responseData: unknown }>();

const cacheKeyForBody = (body: unknown) => JSON.stringify(body);

const makeJsonResponse = (data: unknown, cacheStatus: string) =>
    new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'x-cache-status': cacheStatus,
        },
    });

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

        const key = cacheKeyForBody({ type: 'location', lat, lon });
        const cached = apiCache.get(key);
        if (cached && cached.expiresAt > Date.now()) {
            return makeJsonResponse(cached.responseData, 'HIT');
        }

        try {
            const flights = await getFlightDataByLocation(lat, lon);
            apiCache.set(key, { expiresAt: Date.now() + CACHE_TTL_MS, responseData: flights });
            return makeJsonResponse(flights, 'MISS');
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
        const key = cacheKeyForBody({ type: 'routeSet', ...routeRequest });
        const cached = apiCache.get(key);
        if (cached && cached.expiresAt > Date.now()) {
            return makeJsonResponse(cached.responseData, 'HIT');
        }

        try {
            const routes = await getFlightDataByRouteSet(routeRequest);
            apiCache.set(key, { expiresAt: Date.now() + CACHE_TTL_MS, responseData: routes });
            return makeJsonResponse(routes, 'MISS');
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