import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <Link to="/" className="font-[Sora] font-extrabold text-xl text-[#0B2027]">
          TicketBooking
        </Link>

        <div className="hidden md:flex gap-8 text-sm font-medium text-[#4A5C60]">
          <Link to="/" className="hover:text-[#0B2027]">Home</Link>
<Link to="/events" className="hover:text-[#0B2027]">Browse Events</Link>
          <Link to="/create-event" className="font-medium text-[#0097a7] hover:underline">
    Create Event
  </Link>
        </div>

        <div className="flex gap-3 items-center text-sm">
          {user ? (
            <>
              <Link to="/bookings" className="font-medium text-[#0B2027] hover:underline">
                My Bookings
              </Link>
              <span className="text-[#4A5C60] hidden sm:inline">Hi, {user.name || user.email}</span>
              <button
                onClick={logout}
                className="text-white bg-[#0B2027] px-4 py-2 rounded-full hover:bg-[#123039] transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-[#0B2027] font-medium px-3 py-2">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-[#0097a7] text-white px-4 py-2 rounded-full font-medium hover:bg-[#007c8a] transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;