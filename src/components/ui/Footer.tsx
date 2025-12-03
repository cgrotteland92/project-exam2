import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
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
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link
              to="/"
              className="inline-block hover:opacity-80 transition-opacity"
            >
              <img src="/logo.png" alt="Holidaze" className="h-18 w-auto" />
            </Link>
            <p className="text-stone-500 text-sm mt-4 leading-relaxed max-w-xs">
              Discover unique homes and unforgettable experiences around the
              world.
            </p>
          </div>

          {/* Links 1 */}
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

          {/* Links 2 */}
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

          {/* Links 3 */}
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
        <div className="pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4">
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
              <Instagram size={20} />
            </a>
            <a
              href="#"
              onClick={handlePlaceholder}
              className="hover:text-teal-600 transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              onClick={handlePlaceholder}
              className="hover:text-teal-600 transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
