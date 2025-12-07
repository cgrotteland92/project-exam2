import { useState, useEffect } from "react";
import { isValidNoroffEmail, isValidPassword } from "../utils/validation";
import PasswordInput from "../components/ui/PasswordInput";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/ui/Button";

/**
 * Login page where users can log in with Noroff credentials.
 */

export default function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.venueManager) {
        navigate("/manager");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!isValidNoroffEmail(email)) {
      toast.error("Please use a valid @stud.noroff.no email.");
      return;
    }

    if (!isValidPassword(password)) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const user = await loginUser(email, password);

      if (user && user.accessToken) {
        login(user, user.accessToken);
        toast.success(`Welcome back, ${user.name}!`);
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error("Login failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex items-center justify-center min-h-screen bg-stone-50 px-4">
      <div className="bg-white shadow-xl shadow-stone-200/50 rounded-2xl p-8 w-full max-w-md border border-stone-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-brand font-bold text-stone-900 tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-stone-500">
            Log in to manage your bookings and venues.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-stone-700 mb-1.5"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-stone-400 text-stone-900"
              placeholder="name@stud.noroff.no"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <PasswordInput
              id="password"
              label="Password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2 shadow-lg shadow-teal-900/10"
            isLoading={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <p className="text-center text-sm text-stone-600 mt-8">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-teal-600 hover:text-teal-700 hover:underline font-semibold"
          >
            Register here
          </Link>
        </p>
      </div>
    </section>
  );
}
