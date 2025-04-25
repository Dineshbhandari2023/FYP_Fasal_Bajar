import { Link } from "react-router-dom";
import logo from "../Assets/images/auth_logo.png";

export function Logo() {
  return (
    <Link to="/dashboard" className="flex items-center gap-2">
      <div className="relative h-8 w-8">
        <img
          src={logo}
          alt="Fasal Bajar Logo"
          className="h-full w-full rounded-md"
        />
      </div>
      <span className="font-bold text-lg">Fasal Bajar</span>
    </Link>
  );
}
