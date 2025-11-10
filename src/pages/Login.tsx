import { useState, useEffect } from "react";
import { isValidNoroffEmail, isValidPassword } from "../utils/validation";
import PasswordInput from "../components/PasswordInput";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/useAuth";

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
        navigate("/Manager");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

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
        navigate("/");
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
    <section className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Login to Holidaze
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="name@stud.noroff.no"
              required
            />
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register here
          </Link>
        </p>
      </div>
    </section>
  );
}
