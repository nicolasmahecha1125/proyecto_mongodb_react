import { Link } from "react-router-dom";

export default function NavItem({ to, label, className }) {
  return (
    <li>
      <Link
        to={to}
        className={
          className ??
          "text-white hover:text-sky-400 transition-colors"
        }
      >
        {label}
      </Link>
    </li>
  );
}
