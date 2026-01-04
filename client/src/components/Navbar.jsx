import { Link } from "react-router-dom";
import { useAuth } from "../components/useAuth";
import { NAV_LINKS } from "../constants/navbarLinks";
import { hasRole } from "../utils/permissions";
import NavItem from "./NavItem";
import logoicon from "../assets/logo.jpg";

function Navbar() {
  const { isAuthenticated, logout, user, loading } = useAuth();

  if (loading) return null;

  return (
    <nav className="bg-zinc-800 shadow-md">
      <div className="w-full px-4 py-3 flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center -ml-4">
          <img
            src={logoicon}
            alt="Logo expendio de licores"
            className="
              w-24 h-20 mx-10
              rounded-full
              object-cover
              cursor-pointer
              border-2 border-gray-500
              hover:scale-110
              transition
            "
          />
        </Link>

        {/* BOTONES */}
        <ul className="flex items-center gap-x-6 ml-0">
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
                  className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg transition"
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
                  className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg transition"
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

