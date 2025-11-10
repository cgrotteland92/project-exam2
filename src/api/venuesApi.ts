import toast from "react-hot-toast";

const API_BASE = "https://v2.api.noroff.dev";

/**
 * Fetches a list of venues from the API.
 * @async
 * @returns A list of venues.
 */

export async function getVenues() {
  try {
    const res = await fetch(`${API_BASE}/holidaze/venues`);

    if (!res.ok) throw new Error("Failed to fetch venues");

    const data = await res.json();
    return data.data;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch venues";
    toast.error(message);
    throw error;
  }
}
