import { Link } from "react-router-dom";
import { useAuth } from "../components/useAuth";
import { NAV_LINKS } from "../constants/navbarLinks";
import { hasRole } from "../utils/permissions";
import NavItem from "./NavItem";

function Navbar() {
  const { isAuthenticated, logout, user, loading } = useAuth();

  if (loading) return null;

  return (
    <nav className="bg-zinc-800 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-white hover:text-sky-400 transition"
        >
          Página Home
        </Link>

        <ul className="flex items-center gap-x-6">
          {isAuthenticated ? (
            <>
              {NAV_LINKS.authenticated.map(
                ({ label, to, roles, className }) =>
                  hasRole(user, roles) && (
                    <NavItem
                      key={label}
                      label={label}
                      to={to}
                      className={className}
                    />
                  )
              )}

              <li>
                <button
                  onClick={logout}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <NavItem to="/login" label="Login" />
              <li>
                <Link
                  to="/register"
                  className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg rounded-lg transition"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
