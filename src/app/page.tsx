'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { BoardContainer } from "@/components/boardContainer";
import { LocationAircraftData, RouteResponseItem, routeSetRequestPlane } from "@/types/flights";
import { calculateFlightStatus, estimateArrivalTime, classifyRouteByNearbyAirport } from "@/utils/utils";


export default function Home() {
  const [knownRoutes, setKnownRoutes] = useState<Record<string, RouteResponseItem>>({});
  const knownRoutesRef = useRef<Record<string, RouteResponseItem>>(knownRoutes);
  const [activeFlights, setActiveFlights] = useState<LocationAircraftData[]>([])
  const pendingCallsigns = useRef(new Set<string>())
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [geoStatus, setGeoStatus] = useState<string>('Default Belfast location is in use.');
  const [userPosition, setUserPosition] = useState<{ lat: number; lon: number }>({ lat: 54.5973, lon: -5.9301 });
  const [geoPermissionState, setGeoPermissionState] = useState<PermissionState | 'unsupported'>('prompt');
  const [canRetryGeolocation, setCanRetryGeolocation] = useState(false);



  const callFlights = async (lat: number, lon: number) => {
    const res = await fetch("/api/flights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lon }),
    });

    if (!res.ok) {
      console.error("[CLIENT] POST /api/flights location failed:", res.status, res.statusText);
      return [];
    }

    const locationBasedFlights: LocationAircraftData[] = await res.json();
    console.log("[CLIENT] POST /api/flights location result:", locationBasedFlights);
    return locationBasedFlights;
  }

  const callRoutes = async (missingCallsigns: routeSetRequestPlane[]): Promise<RouteResponseItem[]> => {
    const res = await fetch("/api/flights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planes: missingCallsigns,
      }),
    });

    if (!res.ok) {
      console.error("[CLIENT] POST /api/flights routes failed:", res.status, res.statusText);
      return [];
    }

    const newRoutes: RouteResponseItem[] = await res.json();
    console.log("[CLIENT] POST /api/flights routes result:", newRoutes);
    return newRoutes;
  }

  const requestGeolocation = () => {
    if (!('geolocation' in navigator)) {
      setGeoStatus('Geolocation unavailable, using default Belfast location');
      setUserPosition({ lat: 54.5973, lon: -5.9301 });
      return;
    }

    setGeoStatus('Requesting browser geolocation...');

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        setUserPosition({ lat: position.coords.latitude, lon: position.coords.longitude });
        setGeoStatus('Browser geolocation acquired');
        setGeoPermissionState('granted');
        setCanRetryGeolocation(false);
      },
      (positionError: GeolocationPositionError) => {
        setGeoStatus('Using default Belfast location');
        setUserPosition({ lat: 54.5973, lon: -5.9301 });

        if (positionError.code === positionError.PERMISSION_DENIED) {
          setGeoPermissionState('denied');
          setCanRetryGeolocation(true);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    if (!('permissions' in navigator)) {
      setGeoPermissionState('unsupported');
      setCanRetryGeolocation(true);
      return;
    }

    let permissionStatus: PermissionStatus | null = null;
    navigator.permissions.query({ name: 'geolocation' }).then((status) => {
      permissionStatus = status;
      setGeoPermissionState(status.state);
      setCanRetryGeolocation(status.state !== 'granted');
      status.onchange = () => {
        setGeoPermissionState(status.state);
        setCanRetryGeolocation(status.state !== 'granted');
      };
    });

    return () => {
      if (permissionStatus) {
        permissionStatus.onchange = null;
      }
    };
  }, []);

  useEffect(() => {
    knownRoutesRef.current = knownRoutes;
  }, [knownRoutes]);

  useEffect(() => {
    if (!userPosition) return;

    const fetchFlightsAndRoutes = async () => {
      setLoading(true);
      setError(null);
      console.log(`[CLIENT] Fetching flights for browser location: lat=${userPosition.lat}, lon=${userPosition.lon}`);

      const activeFlightsResponse = await callFlights(userPosition.lat, userPosition.lon);
      setActiveFlights(activeFlightsResponse);

      const missingCallsigns = activeFlightsResponse.filter(
        flight => {
          if (!flight.flight) return false;
          const callsign = flight.flight.trim();
          return !knownRoutesRef.current[callsign] && !pendingCallsigns.current.has(callsign);
        }
      );

      if (missingCallsigns.length > 0) {
        const routeSetRequestPlaneList: routeSetRequestPlane[] = [];
        missingCallsigns.forEach(flight => {
          if (!flight.flight) return;
          const callsign = flight.flight.trim();
          pendingCallsigns.current.add(callsign);
          routeSetRequestPlaneList.push({
            callsign,
            lat: 0,
            lng: 0,
          });
        });

        console.log(`[CLIENT] Fetching routes for missing callsigns: ${routeSetRequestPlaneList.map(p => p.callsign).join(", ")}`);
        const newRoutes = await callRoutes(routeSetRequestPlaneList);
        setKnownRoutes(prev => ({
          ...prev,
          ...Object.fromEntries(newRoutes.map(r => [r.callsign, r]))
        }));
      }

      setLoading(false);
    };

    fetchFlightsAndRoutes();
    const interval = window.setInterval(fetchFlightsAndRoutes, 60000);

    return () => window.clearInterval(interval);
  }, [userPosition]);

  const displayFlights = useMemo(() => {
    return activeFlights.map((aircraft) => {
      const callsign = aircraft.flight?.trim() ?? "";
      const route: RouteResponseItem | null = knownRoutes[callsign] ?? null;
      const status = calculateFlightStatus(aircraft, route);
      const estimatedOff = estimateArrivalTime(aircraft, route);
      let kind = "OVERHEAD"; // Default kind
      let type = "UNKNOWN"; // Default type
      if (route && userPosition) {
        kind = classifyRouteByNearbyAirport(route, userPosition);
        type = "Airline";
      }

      return {
        callsign,
        ident: callsign,
        operator: route?.airline_code ?? "",
        destination: { name: route?._airports[1]?.name ?? "" },
        origin: { name: route?._airports[0]?.name ?? "" },
        status,
        estimated_off: estimatedOff,
        type: type,
        kind: kind,
        routeInformation: route,
        aircraftLocationData: aircraft,
      };
    });
  }, [activeFlights, knownRoutes, userPosition]);


  if (loading && !activeFlights) {
    return (
      <div className="font-sans">
        <main className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p>Loading flight data...</p>
            <p className="text-sm text-slate-500">{geoStatus}</p>
          </div>
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

  if (!activeFlights || activeFlights.length === 0) {
    return (
      <div className="font-sans">
        <main className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p>No flights found for the current period.</p>
            <p className="text-sm text-slate-500">{geoStatus}</p>
            {canRetryGeolocation && (
              <div className="mt-4 flex flex-col items-center gap-2 text-sm sm:flex-row sm:justify-center">
                <span className=" px-3 py-1">
                  {geoPermissionState === 'denied'
                    ? 'Location denied. Use browser settings to allow it, then retry.'
                    : 'Use your browser location for more accurate results.'}
                </span>
                <button
                  type="button"
                  onClick={requestGeolocation}
                  className="inline-flex items-center gap-2"
                >
                  <span>↻</span>
                  {geoPermissionState === 'denied' ? 'Retry location' : 'Allow location'}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <main className="">
        {canRetryGeolocation && (
          <div className="mb-4 flex flex-wrap items-center gap-2 px-3 py-1 text-sm">
            <span>
              {geoPermissionState === 'denied'
                ? 'Location denied. Enable it in browser settings and retry.'
                : 'Using default Belfast location.'}
            </span>
            <button
              type="button"
              onClick={requestGeolocation}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white"
            >
              <span>↻</span>
              {geoPermissionState === 'denied' ? 'Retry location' : 'Allow location'}
            </button>
          </div>
        )}
        <BoardContainer flights={displayFlights} />
      </main>
    </div>
  );
}