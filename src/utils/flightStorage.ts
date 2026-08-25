import { Flight } from "@/types/flights";

export const flightStorage = {
    get: (): Flight[] | null => {
        if (typeof window === "undefined") return null;
        try {
            const data = localStorage.getItem("flights");
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error("Failed to read flights from storage:", error);
            return null;
        }
    },

    set: (flights: Flight[]) => {
        if (typeof window === "undefined") return;
        try {
            localStorage.setItem("flights", JSON.stringify(flights));
        } catch (error) {
            console.error("Failed to save flights to storage:", error);
        }
    },

    clear: () => {
        if (typeof window === "undefined") return;
        localStorage.removeItem("flights");
    }
};