import { useState, useEffect } from "react";
import {
  isValidNoroffEmail,
  isValidPassword,
  isNotEmpty,
} from "../utils/validation";
import PasswordInput from "../components/PasswordInput";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../api/authApi";
import { useAuth } from "../context/useAuth";

/**
 * Register page where users can create a new account.
 */
export default function Register() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [venueManager, setVenueManager] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!isNotEmpty(name)) {
      toast.error("Name cannot be empty.");
      return;
    }

    if (!isValidNoroffEmail(email)) {
      toast.error("Please use a valid @stud.noroff.no email.");
      return;
    }

    if (!isValidPassword(password)) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const newUser = await registerUser(name, email, password, venueManager);

      if (newUser) {
        toast.success("Registration successful, please log in.");
        navigate("/login");
      } else {
        toast.error("Registration failed, please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong, check your credentials.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Create an Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="name@stud.noroff.no"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be a <strong>@stud.noroff.no</strong> email.
            </p>
          </div>

          <div>
            <PasswordInput
              id="password"
              label="Password"
              value={password}
              onChange={setPassword}
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="venueManager"
              checked={venueManager}
              onChange={(e) => setVenueManager(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="venueManager" className="text-sm text-gray-700">
              Register as a <strong>Venue Manager</strong>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Log in here
          </Link>
        </p>
      </div>
    </section>
  );
}
