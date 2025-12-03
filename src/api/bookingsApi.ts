import type { Booking } from "../types/api";

const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

export interface CreateBookingInput {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
  token: string;
}

/**
 * Create a new booking.
 * POST /holidaze/bookings
 */
export async function createBooking({
  venueId,
  dateFrom,
  dateTo,
  guests,
  token,
}: CreateBookingInput): Promise<Booking> {
  const res = await fetch(`${API_BASE}/holidaze/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
    },
    body: JSON.stringify({
      venueId,
      dateFrom,
      dateTo,
      guests,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(
      errorBody?.errors?.[0]?.message ||
        errorBody?.message ||
        "Failed to create booking"
    );
  }

  const json = await res.json();
  return json.data as Booking;
}

/**
 * Cancel a booking.
 * DELETE /holidaze/bookings/:id
 */
export async function cancelBooking(
  bookingId: string,
  token: string
): Promise<void> {
  const res = await fetch(`${API_BASE}/holidaze/bookings/${bookingId}`, {
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
        "Failed to cancel booking"
    );
  }
}
