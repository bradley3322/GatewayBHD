'use client';

import { useState, useEffect } from 'react';
import { BoardContainer } from "@/components/boardContainer";
import { Flight } from "@/types/flights";


export default function Home() {
  const [flights, setFlights] = useState<Flight[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlights = async () => {
      console.log(`[CLIENT] Fetching flights from /api/flights at ${new Date().toLocaleTimeString()}`);
      try {
        setLoading(true);
        const response = await fetch('/api/flights');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
        }

        const data: Flight[] = await response.json();
        setFlights(data);
        setError(null);
        console.log("[CLIENT] Flights data updated.");
      } catch (e: unknown) {
        console.error("[CLIENT] Error fetching flights data:", e);
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
    const intervalId = setInterval(fetchFlights, 60000);

    return () => clearInterval(intervalId);
  }, []);


  if (loading && !flights) {
    return (
      <div className="font-sans">
        <main className="flex items-center justify-center min-h-screen">
          <p>Loading flight data...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-sans">
        <main className="flex items-center justify-center min-h-screen">
          <p className="text-red-500">Error: {error}</p>
        </main>
      </div>
    );
  }

  if (!flights || flights.length === 0) {
    return (
      <div className="font-sans">
        <main className="flex items-center justify-center min-h-screen">
          <p>No flights found for the current period.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <main className="">
        <BoardContainer flights={flights} />
      </main>
    </div>
  );
}