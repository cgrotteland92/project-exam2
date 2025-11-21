import type { AuthUser, LoginResponse, ProfileResponse } from "../types/api";
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;
const API_BASE = "https://v2.api.noroff.dev";

/**
 * Register new user
 * @async
 * @param {string} name - Username to register
 * @param {string} email - must be @stud.noroff.no
 * @param {string} password - Users password
 * @param {boolean} [venueManager=false] - Is the user a venue manager?
 * @returns {Promise<AuthUser>} - Registered user data
 */
export async function registerUser(
  name: string,
  email: string,
  password: string,
  venueManager = false
): Promise<AuthUser> {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, venueManager }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(
      errorBody.errors?.[0]?.message ||
        errorBody.message ||
        "Registration failed"
    );
  }

  return await response.json();
}

/**
 * Log in an existing user and return their auth data.
 * @returns {Promise<LoginResponse>} - The login response (user + token)
 */
export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(
      errorBody?.errors?.[0]?.message || errorBody?.message || "Login failed"
    );
  }

  const json = await res.json();
  return json.data as LoginResponse;
}
/**
 * Fetch a user profile by name, with optional related data.
 * @param name - The username (from user.name)
 * @param token - The auth token (from login)
 * @param options - Include venues/bookings/count data if needed
 * @returns {Promise<ProfileResponse>} - The user's profile data
 */
export async function getProfile(
  name: string,
  token: string,
  options?: { venues?: boolean; bookings?: boolean; count?: boolean }
): Promise<ProfileResponse> {
  const params = new URLSearchParams();
  if (options?.venues) params.set("_venues", "true");
  if (options?.bookings) params.set("_bookings", "true");
  if (options?.count) params.set("_count", "true");

  const res = await fetch(
    `${API_BASE}/holidaze/profiles/${name}?${params.toString()}`,
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
        "Failed to load profile"
    );
  }

  const json = await res.json();
  return json.data as ProfileResponse;
}

/**
 * Update a user's avatar.
 * @returns {Promise<AuthUser>} - The updated user data
 */
export async function updateAvatar(
  name: string,
  token: string,
  avatarUrl: string,
  alt: string
): Promise<ProfileResponse> {
  const res = await fetch(`${API_BASE}/holidaze/profiles/${name}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
    },
    body: JSON.stringify({
      avatar: {
        url: avatarUrl,
        alt,
      },
    }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(
      errorBody?.errors?.[0]?.message ||
        errorBody?.message ||
        "Failed to update avatar"
    );
  }

  const json = await res.json();
  return json.data as ProfileResponse;
}
