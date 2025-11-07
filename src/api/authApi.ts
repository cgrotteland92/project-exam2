import toast from "react-hot-toast";
import type { AuthUser, LoginResponse, ProfileResponse } from "../types/api";

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
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, venueManager }),
    });

    if (!response.ok) throw new Error("Registration failed");

    const data: AuthUser = await response.json();
    toast.success("Registration successful");
    return data;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Registration failed";
    toast.error(message);
    throw error;
  }
}

/**
 * Log in an existing user and return their auth data.
 * @returns {Promise<LoginResponse>} - The login response (user + token)
 */
export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("Invalid email or password");
    }

    const json = await res.json();
    const data: LoginResponse = json.data;

    toast.success(`Welcome back, ${data.name}!`);
    return data;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";
    toast.error(message);
    throw error;
  }
}

/**
 * Fetch a user profile by name.
 * @returns {Promise<ProfileResponse>} - The user's profile data
 */
export async function getProfile(
  name: string,
  token: string
): Promise<ProfileResponse> {
  try {
    const res = await fetch(`${API_BASE}/holidaze/profiles/${name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to load profile");

    const data: ProfileResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Unable to fetch profile");
    }
    throw error;
  }
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
): Promise<AuthUser> {
  try {
    const res = await fetch(`${API_BASE}/holidaze/profiles/${name}/media`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ avatar: { url: avatarUrl, alt } }),
    });

    if (!res.ok) throw new Error("Failed to update avatar");

    const data: AuthUser = await res.json();
    toast.success("Avatar updated successfully!");
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Avatar update failed");
    }
    throw error;
  }
}
