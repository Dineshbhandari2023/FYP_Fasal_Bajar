import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/dashboard" className="flex items-center gap-2">
      <div className="relative h-8 w-8">
        <img
          src="/assets/facebook-logo-on-screen.png"
          alt="Fasal Bajar Logo"
          className="h-full w-full rounded-md bg-green-600 text-white"
        />
      </div>
      <span className="font-bold text-lg">Fasal Bajar</span>
    </Link>
  );
}
