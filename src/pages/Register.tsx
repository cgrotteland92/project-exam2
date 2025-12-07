import { useState, useEffect } from "react";
import {
  isValidNoroffEmail,
  isValidPassword,
  isNotEmpty,
} from "../utils/validation";
import PasswordInput from "../components/ui/PasswordInput";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/ui/Button";

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
    <section className="flex items-center justify-center min-h-screen bg-stone-50 px-4">
      <div className="bg-white shadow-xl shadow-stone-200 rounded-2xl p-8 w-full max-w-md border border-stone-100">
        <h1 className="text-3xl font-brand font-bold text-center mb-2 text-stone-900">
          Create an Account
        </h1>
        <p className="text-center text-stone-500 mb-8">
          Join Holidaze to book unique stays or host your own.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="name@stud.noroff.no"
              required
            />
            <p className="text-xs text-stone-500 mt-1">
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

          <div className="flex items-center p-3 bg-stone-50 rounded-xl border border-stone-100">
            <input
              type="checkbox"
              id="venueManager"
              checked={venueManager}
              onChange={(e) => setVenueManager(e.target.checked)}
              className="w-5 h-5 text-teal-600 border-stone-300 rounded focus:ring-teal-500"
            />
            <label
              htmlFor="venueManager"
              className="ml-3 text-sm text-stone-700 font-medium cursor-pointer select-none"
            >
              Register as a{" "}
              <strong className="text-stone-900">Venue Manager</strong>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4 shadow-lg shadow-teal-900/20"
            isLoading={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>

        <p className="text-center text-sm text-stone-600 mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-teal-600 hover:text-teal-700 hover:underline font-semibold"
          >
            Log in here
          </Link>
        </p>
      </div>
    </section>
  );
}
