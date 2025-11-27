import type { Venue } from "../types/api";

const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

/**
 * Fetches a list of venues from the API.
 * UPDATED: Fetches 100 newest venues with owner and booking info.
 */
export async function getVenues(): Promise<Venue[]> {
  const res = await fetch(
    `${API_BASE}/holidaze/venues?sort=created&sortOrder=desc&limit=100&_owner=true&_bookings=true`,
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

/**
 * Fetch all venues owned by a specific profile (venue manager), including bookings.
 */
export async function getManagerVenuesWithBookings(
  name: string,
  token: string
): Promise<Venue[]> {
  const res = await fetch(
    `${API_BASE}/holidaze/profiles/${name}/venues?_bookings=true`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    }
  );

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(
      errorBody?.errors?.[0]?.message ||
        errorBody?.message ||
        "Failed to fetch managed venues"
    );
  }

  const json = await res.json();
  return json.data as Venue[];
}

export interface CreateVenueInput {
  name: string;
  description?: string;
  price: number;
  maxGuests: number;
  rating?: number;
  media?: { url: string; alt?: string }[];
  meta?: {
    wifi?: boolean;
    parking?: boolean;
    breakfast?: boolean;
    pets?: boolean;
  };
  location?: {
    address?: string;
    city?: string;
    country?: string;
  };
}

/**
 * Create new venue (venue manager only).
 */
export async function createVenue(
  input: CreateVenueInput,
  token: string
): Promise<Venue> {
  const res = await fetch(`${API_BASE}/holidaze/venues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(
      errorBody?.errors?.[0]?.message ||
        errorBody?.message ||
        "Failed to create venue"
    );
  }

  const json = await res.json();
  return json.data as Venue;
}

/**
 * Delete a venue by ID.
 */
export async function deleteVenue(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE}/holidaze/venues/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(
      errorBody?.errors?.[0]?.message ||
        errorBody?.message ||
        "Failed to delete venue"
    );
  }
}

export type UpdateVenueInput = CreateVenueInput;

/**
 * Update an existing venue.
 */
export async function updateVenue(
  id: string,
  input: UpdateVenueInput,
  token: string
): Promise<Venue> {
  const res = await fetch(`${API_BASE}/holidaze/venues/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(
      errorBody?.errors?.[0]?.message ||
        errorBody?.message ||
        "Failed to update venue"
    );
  }

  const json = await res.json();
  return json.data as Venue;
}

/**
 * Search for venues using the API search endpoint.
 * Includes booking info so filters work on search results.
 */
export async function searchVenues(query: string): Promise<Venue[]> {
  const res = await fetch(
    `${API_BASE}/holidaze/venues/search?q=${encodeURIComponent(
      query
    )}&_bookings=true&_owner=true`,
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
        "Failed to search venues"
    );
  }

  const json = await res.json();
  return json.data as Venue[];
}
