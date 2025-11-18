import type { Venue } from "../types/api";

const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

/**
 * Fetches a list of venues from the API.
 * @async
 * @returns A list of venues.
 */

export async function getVenues(): Promise<Venue[]> {
  const res = await fetch(`${API_BASE}/holidaze/venues`, {
    headers: {
      "X-Noroff-API-Key": API_KEY,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(
      errorBody?.errors?.[0]?.message ||
        errorBody?.message ||
        "Failed to fetch venues"
    );
  }

  const json = await res.json();
  return json.data as Venue[];
}

/**
 * Fetch a single venue by ID, owner + bookings.
 */
export async function getVenueById(id: string): Promise<Venue> {
  const res = await fetch(
    `${API_BASE}/holidaze/venues/${id}?_owner=true&_bookings=true`,
    {
      headers: {
        "X-Noroff-API-Key": API_KEY,
      },
    }
  );

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(
      errorBody?.errors?.[0]?.message ||
        errorBody?.message ||
        "Failed to load venue"
    );
  }

  const json = await res.json();
  return json.data as Venue;
}
