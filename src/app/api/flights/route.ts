import { getFlightData } from "@/lib/data";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const flights = await getFlightData();
        return new Response(JSON.stringify(flights), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',

            },
        });
    } catch (error) {
        console.error("[API Route] Error in /api/flights:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch flight data" }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}