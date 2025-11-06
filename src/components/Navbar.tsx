import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-white sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          Holidaze
        </Link>
        <div className="hidden md:flex space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-gray-800 font-semibold"
                : "text-gray-600 hover:text-gray-800"
            }
          >
            Venues
          </NavLink>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-medium"
                : "text-gray-700 hover:text-blue-600"
            }
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-medium"
                : "text-gray-700 hover:text-blue-600"
            }
          >
            Register
          </NavLink>
        </div>
        <button className="md:hidden text-gray-600 hover:text-blue-600">
          ☰
        </button>
      </nav>
    </header>
  );
}
