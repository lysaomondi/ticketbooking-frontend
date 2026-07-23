import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    api.get("bookings/mine/").then((res) => {
      setBookings(res.data);
      setLoading(false);
    });
  }, [user, navigate]);

  const statusColor = (status) => {
    if (status === "confirmed") return "bg-green-100 text-green-700";
    if (status === "cancelled") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700"; // pending
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

      {bookings.length === 0 && (
        <p className="text-gray-500">You haven't booked anything yet.</p>
      )}

      <div className="flex flex-col gap-3">
        {bookings.map((booking) => (
          <div key={booking.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">Booking #{booking.id}</p>
                <p className="text-sm text-gray-600">
                  Quantity: {booking.quantity}
                </p>
                <p className="text-sm text-gray-600">
                  Total: KES {booking.total_price}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(booking.booked_at).toLocaleString()}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${statusColor(
                  booking.status
                )}`}
              >
                {booking.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;