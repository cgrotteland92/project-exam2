import toast from "react-hot-toast";

const API_BASE = "https://v2.api.noroff.dev";

export async function cancelBooking(
  bookingId: string,
  token: string
): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/holidaze/bookings/${bookingId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to cancel booking");

    toast.success("Booking cancelled!");
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to cancel booking";
    toast.error(message);
    throw error;
  }
}
