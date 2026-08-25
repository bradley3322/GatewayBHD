export interface AirlineInfo {
    name: string;
    iata: string;
    icao: string;
    callsign?: string;
}

const AIRLINE_DATABASE: Record<string, AirlineInfo> = {
    EZY: { name: "easyJet", iata: "U2", icao: "EZY", callsign: "EASY" },
    EZS: { name: "easyJet Switzerland", iata: "DS", icao: "EZS", callsign: "TOPJET" },
    RYR: { name: "Ryanair", iata: "FR", icao: "RYR", callsign: "RYANAIR" },
    RUK: { name: "Ryanair UK", iata: "RK", icao: "RUK", callsign: "BLUEFIN" },
    BAW: { name: "British Airways", iata: "BA", icao: "BAW", callsign: "SPEEDBIRD" },
    SHT: { name: "British Airways Shuttle", iata: "BA", icao: "SHT", callsign: "SHUTTLE" },
    EIN: { name: "Aer Lingus", iata: "EI", icao: "EIN", callsign: "SHAMROCK" },
    EAI: { name: "Aer Lingus Regional (Emerald Airlines)", iata: "EA", icao: "EAI", callsign: "GEMSTONE" },
    EXS: { name: "Jet2.com", iata: "LS", icao: "EXS", callsign: "CHANEX" },
    LOG: { name: "Loganair", iata: "LM", icao: "LOG", callsign: "LOGAN" },
    TOM: { name: "TUI Airways", iata: "BY", icao: "TOM", callsign: "TOMJET" },
    KLM: { name: "KLM Royal Dutch Airlines", iata: "KL", icao: "KLM", callsign: "KLM" },
    KLC: { name: "KLM Cityhopper", iata: "WA", icao: "KLC", callsign: "CITY" },

    DAL: { name: "Delta Air Lines", iata: "DL", icao: "DAL", callsign: "DELTA" },
    AAL: { name: "American Airlines", iata: "AA", icao: "AAL", callsign: "AMERICAN" },
    UAL: { name: "United Airlines", iata: "UA", icao: "UAL", callsign: "UNITED" },
    ACA: { name: "Air Canada", iata: "AC", icao: "ACA", callsign: "AIR CANADA" },
    DLH: { name: "Lufthansa", iata: "LH", icao: "DLH", callsign: "LUFTHANSA" },
    AFR: { name: "Air France", iata: "AF", icao: "AFR", callsign: "AIRFRANS" },
    VIR: { name: "Virgin Atlantic", iata: "VS", icao: "VIR", callsign: "VIRGIN" },
    UAE: { name: "Emirates", iata: "EK", icao: "UAE", callsign: "EMIRATES" },
    QTR: { name: "Qatar Airways", iata: "QR", icao: "QTR", callsign: "QATARI" },
    ETH: { name: "Ethiopian Airlines", iata: "ET", icao: "ETH", callsign: "ETHIOPIAN" },
    SAS: { name: "SAS Scandinavian Airlines", iata: "SK", icao: "SAS", callsign: "SCANDINAVIAN" },
    ICE: { name: "Icelandair", iata: "FI", icao: "ICE", callsign: "ICEAIR" },
    SWR: { name: "Swiss International Air Lines", iata: "LX", icao: "SWR", callsign: "SWISS" },
    WZZ: { name: "Wizz Air", iata: "W6", icao: "WZZ", callsign: "WIZZAIR" },
    THY: { name: "Turkish Airlines", iata: "TK", icao: "THY", callsign: "TURKISH" },

    FDX: { name: "FedEx Express", iata: "FX", icao: "FDX", callsign: "FEDEX" },
    UPS: { name: "UPS Airlines", iata: "5X", icao: "UPS", callsign: "UPS" },
    DHL: { name: "DHL Air UK", iata: "D0", icao: "DHK", callsign: "WORLDEX" },
};

export function getAirlineName(codeOrName: string): string {
    if (!codeOrName) return "Unknown Airline";

    const cleanInput = codeOrName.trim().toUpperCase();

    if (AIRLINE_DATABASE[cleanInput]) {
        return AIRLINE_DATABASE[cleanInput].name;
    }

    const entry = Object.values(AIRLINE_DATABASE).find(
        (airline) =>
            airline.icao === cleanInput ||
            airline.iata === cleanInput ||
            airline.name.toUpperCase().includes(cleanInput)
    );

    return entry ? entry.name : "Unknown Airline";
}