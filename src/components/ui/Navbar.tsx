import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import Button from "./Button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setIsMenuOpen(false);
    toast.success("Logged out, see you later!");
    navigate("/");
  }

  const activeClass = "text-teal-600 font-semibold";
  const inactiveClass =
    "text-stone-600 hover:text-teal-600 font-medium transition-colors";

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-stone-100 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2">
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
        >
          <img
            src="/logo.png"
            alt="Holidaze Logo"
            className="h-14 w-auto object-contain"
          />
          <span className="text-3xl font-bold text-teal-700 tracking-tight font-brand group-hover:text-teal-800 transition-colors">
            Holidaze
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? activeClass : inactiveClass
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/venues"
            className={({ isActive }) =>
              isActive ? activeClass : inactiveClass
            }
          >
            Venues
          </NavLink>

          {user ? (
            <>
              {user.venueManager && (
                <NavLink
                  to="/manager"
                  className={({ isActive }) =>
                    isActive ? activeClass : inactiveClass
                  }
                >
                  Dashboard
                </NavLink>
              )}

              <div className="h-6 w-px bg-stone-200 mx-2" />

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? activeClass : inactiveClass
                }
              >
                {user.name}
              </NavLink>

              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-stone-500 hover:text-red-600"
              >
                Log out
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-stone-600 hover:text-teal-600 font-medium"
              >
                Log in
              </Link>
              <Link to="/register">
                <Button
                  variant="primary"
                  size="sm"
                  className="rounded-full px-5"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden p-2 text-stone-600 hover:bg-stone-100 rounded-lg focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-stone-100 shadow-lg py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-5 fade-in duration-200">
          <NavLink
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              isActive ? activeClass : inactiveClass
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/venues"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              isActive ? activeClass : inactiveClass
            }
          >
            Venues
          </NavLink>

          {user ? (
            <>
              {user.venueManager && (
                <NavLink
                  to="/manager"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive ? activeClass : inactiveClass
                  }
                >
                  Dashboard
                </NavLink>
              )}

              <div className="h-px w-full bg-stone-100 my-1" />

              <NavLink
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? activeClass : inactiveClass
                }
              >
                Profile ({user.name})
              </NavLink>

              <button
                onClick={handleLogout}
                className="text-left text-stone-500 hover:text-red-600 font-medium"
              >
                Log out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 pt-2 border-t border-stone-100">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="text-stone-600 hover:text-teal-600 font-medium py-2"
              >
                Log in
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-center rounded-lg"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
