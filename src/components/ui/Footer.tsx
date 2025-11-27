import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Footer() {
  // Helper to handle links that aren't built yet
  const handlePlaceholder = (e: React.MouseEvent) => {
    e.preventDefault();
    toast("This link is just for demo purposes!", {
      icon: "🚧",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  return (
    <footer className="bg-stone-50 border-t border-stone-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link
              to="/"
              className="text-2xl font-bold text-teal-700 tracking-tight"
            >
              Holidaze
            </Link>
            <p className="text-stone-500 text-sm mt-4 leading-relaxed max-w-xs">
              Discover unique homes and unforgettable experiences around the
              world.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-stone-900 mb-4">Explore</h3>
            <ul className="space-y-3 text-sm text-stone-600">
              <li>
                <Link
                  to="/venues"
                  className="hover:text-teal-600 transition-colors"
                >
                  All Venues
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-teal-600 transition-colors">
                  Featured Stays
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:text-teal-600 transition-colors"
                >
                  Become a Host
                </Link>
              </li>
            </ul>
          </div>

          {/* Demo links */}
          <div>
            <h3 className="font-bold text-stone-900 mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-stone-600">
              <li>
                <a
                  href="#"
                  onClick={handlePlaceholder}
                  className="hover:text-teal-600 transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={handlePlaceholder}
                  className="hover:text-teal-600 transition-colors"
                >
                  Safety information
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={handlePlaceholder}
                  className="hover:text-teal-600 transition-colors"
                >
                  Cancellation options
                </a>
              </li>
            </ul>
          </div>

          {/* Demo links */}
          <div>
            <h3 className="font-bold text-stone-900 mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-stone-600">
              <li>
                <a
                  href="#"
                  onClick={handlePlaceholder}
                  className="hover:text-teal-600 transition-colors"
                >
                  About us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={handlePlaceholder}
                  className="hover:text-teal-600 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={handlePlaceholder}
                  className="hover:text-teal-600 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-stone-400 text-sm">
            © {new Date().getFullYear()} Holidaze. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex gap-6 text-stone-400">
            <a
              href="#"
              onClick={handlePlaceholder}
              className="hover:text-teal-600 transition-colors"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a
              href="#"
              onClick={handlePlaceholder}
              className="hover:text-teal-600 transition-colors"
              aria-label="Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-12.7 12.5S.2 5.3 7.8 4.5c2.1-.2 3.2-.4 3.2-.4v-3h3a6.3 6.3 0 0 1 7 7" />
              </svg>
            </a>
            <a
              href="#"
              onClick={handlePlaceholder}
              className="hover:text-teal-600 transition-colors"
              aria-label="Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
