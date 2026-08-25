export function formatTime(input: string): string {
    const date = new Date(input);
    return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

export function getCurrentAndNextDayUtcTime(): { startTimeUTC: string; endTimeUTC: string } {
    const now = new Date();

    const fiveHoursBeforeNow = new Date(now.getTime() - (5 * 60 * 60 * 1000));
    const currentHourNextDay = new Date(now.getTime() + (24 * 60 * 60 * 1000));

    let startTimeUTC = fiveHoursBeforeNow.toISOString();
    let endTimeUTC = currentHourNextDay.toISOString();

    startTimeUTC = startTimeUTC.split('.')[0] + 'Z';
    endTimeUTC = endTimeUTC.split('.')[0] + 'Z';

    return {
        startTimeUTC: startTimeUTC,
        endTimeUTC: endTimeUTC,
    };
}

function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

export function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const earthRadiusKm = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
        + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2))
        * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
}

const nauticalMilesToKm = (nauticalMiles: number) => nauticalMiles * 1.852;

export function classifyRouteByNearbyAirport(
    routeInformation: {
        _airports?: Array<{
            lat?: number;
            lon?: number;
            name?: string;
            iata?: string;
            icao?: string;
        }>;
    } | null | undefined,
    userPosition: { lat: number; lon: number } | null,
    radiusNm = 25
): 'UNKNOWN' | 'DEPARTURE' | 'ARRIVAL' | 'OVERHEAD' {
    if (!userPosition || !routeInformation || !routeInformation._airports) return 'UNKNOWN';

    const radiusKm = nauticalMilesToKm(radiusNm);
    const airports = routeInformation._airports;

    const origin = airports[0];
    const destination = airports[1];

    if (!origin || origin.lat == null || origin.lon == null) return 'UNKNOWN';
    if (!destination || destination.lat == null || destination.lon == null) return 'UNKNOWN';

    const originDistanceKm = getDistanceKm(userPosition.lat, userPosition.lon, origin.lat, origin.lon);
    if (originDistanceKm <= radiusKm) {
        return 'DEPARTURE';
    }

    const destinationDistanceKm = getDistanceKm(userPosition.lat, userPosition.lon, destination.lat, destination.lon);
    if (destinationDistanceKm <= radiusKm) {
        return 'ARRIVAL';
    }

    return 'OVERHEAD';
}

export function calculateFlightStatus(
    aircraftLocationData: {
        lat: number;
        lon: number;
        alt_geom?: number;
        alt_baro?: string;
        gs?: number;
    },
    routeInformation?: {
        _airports?: { lat: number; lon: number }[];
    } | null
): string {
    const altitude = aircraftLocationData.alt_geom ?? Number(aircraftLocationData.alt_baro ?? 0);
    const speed = aircraftLocationData.gs ?? 0;
    const origin = routeInformation?._airports?.[0];
    const destination = routeInformation?._airports?.[1];

    const airborne = altitude >= 1000 && speed > 30;
    const onGround = !airborne;

    if (!origin || !destination) {
        return onGround ? 'On ground' : 'In flight';
    }

    const distanceToOriginKm = getDistanceKm(aircraftLocationData.lat, aircraftLocationData.lon, origin.lat, origin.lon);
    const distanceToDestinationKm = getDistanceKm(aircraftLocationData.lat, aircraftLocationData.lon, destination.lat, destination.lon);

    if (onGround) {
        if (distanceToOriginKm < 10) {
            return speed > 20 ? 'Taxiing' : 'At gate';
        }
        if (distanceToDestinationKm < 10) {
            return 'Landed';
        }
        return 'On ground';
    }

    if (distanceToDestinationKm < 5) return 'Landing';
    if (distanceToDestinationKm < 20) return 'Approaching';
    if (distanceToOriginKm < 20) return 'Departed';
    if (altitude < 5000 && distanceToDestinationKm < 100) return 'Descending';

    return 'En route';
}

export function estimateArrivalTime(
    aircraftLocationData: {
        lat: number;
        lon: number;
        gs?: number;
    },
    routeInformation?: {
        _airports?: { lat: number; lon: number }[];
    } | null
): string {
    const destination = routeInformation?._airports?.[1];
    if (!destination || !aircraftLocationData.gs || aircraftLocationData.gs <= 0) {
        return '';
    }

    const distanceKm = getDistanceKm(aircraftLocationData.lat, aircraftLocationData.lon, destination.lat, destination.lon);
    const speedKmh = aircraftLocationData.gs * 1.852;
    if (speedKmh <= 0) return '';

    const hours = distanceKm / speedKmh;
    const arrivalDate = new Date(Date.now() + hours * 3600 * 1000);
    return arrivalDate.toISOString();
}
