import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`events/${id}/`);
        setEvent(res.data);
        console.log("Event data:", res.data);
        console.log("Image URL:", res.data.image);
      } catch (error) {
        console.error(error);
        setMessage("Unable to load event.");
      }
    };

    fetchEvent();
  }, [id]);

  const setQty = (ticketId, change, max) => {
    setQuantities((prev) => {
      const current = prev[ticketId] || 0;
      const next = Math.max(0, Math.min(max, current + change));

      return {
        ...prev,
        [ticketId]: next,
      };
    });
  };

  const total = useMemo(() => {
    if (!event) return 0;

    return event.ticket_types.reduce((sum, ticket) => {
      return sum + (quantities[ticket.id] || 0) * Number(ticket.price);
    }, 0);
  }, [event, quantities]);

  const totalTickets = useMemo(() => {
    return Object.values(quantities).reduce((a, b) => a + b, 0);
  }, [quantities]);

  const handleBook = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const selected = Object.entries(quantities).filter(([, qty]) => qty > 0);

    if (selected.length === 0) {
      setMessage("Please select at least one ticket.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      for (const [ticketTypeId, quantity] of selected) {
        await api.post("bookings/", {
          ticket_type: Number(ticketTypeId),
          quantity,
        });
      }

      setMessage("🎉 Booking successful! Check My Bookings.");
      setQuantities({});
    } catch (err) {
      setMessage(err.response?.data?.detail || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-slate-600">
          Loading event...
        </div>
      </div>
    );
  }

  const heroImage = event.image
    ? event.image
    : "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600";

  return (
    <div className="bg-slate-50 min-h-screen pb-32">

      //Hero 
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <div className="w-full rounded-3xl overflow-hidden shadow-lg h-64 md:h-[420px]">
          <img
            src={heroImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        // Event information
        <div className="mt-8">
          <span className="inline-block bg-[#0097a7] text-white px-4 py-1 rounded-full text-sm capitalize">
            {event.category}
          </span>

          <h1 className="text-slate-800 text-3xl md:text-4xl font-black mt-4">
            {event.title}
          </h1>

          <p className="text-slate-500 mt-2 text-lg">
             {event.venue_name || event.venue?.name || "Venue TBA"}
          </p>

          <div className="flex flex-wrap gap-x-8 gap-y-1 mt-3 text-sm text-slate-500">
            <p>
              <span className="font-semibold text-slate-700">Start Date: </span>
              {new Date(event.start_time).toLocaleString(undefined, {
                month: "short", day: "numeric", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </p>
            <p>
              <span className="font-semibold text-slate-700">End Date: </span>
              {new Date(event.end_time).toLocaleString(undefined, {
                month: "short", day: "numeric", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </div>

          <p className="text-slate-600 leading-7 mt-6 whitespace-pre-line">
            {event.description || "No description has been provided for this event."}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10 grid lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-8">

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              {event.ticket_types?.length === 1 ? "Entry Price" : "Available Tickets"}
            </h2>

            <div className="space-y-5">
              {(event.ticket_types || []).map((ticket) => {
                const remaining = ticket.quantity_available - ticket.quantity_sold;
                const qty = quantities[ticket.id] || 0;
                const isSingleTier = event.ticket_types.length === 1;

                return (
                  <div
                    key={ticket.id}
                    className="border rounded-2xl p-6 hover:border-[#0097a7] transition flex flex-col md:flex-row md:items-center md:justify-between gap-5"
                  >
                    <div>
                      {!isSingleTier && (
                        <h3 className="text-xl font-bold text-slate-800">{ticket.name}</h3>
                      )}
                      <p className="text-[#0097a7] text-2xl font-bold mt-2">
                        KES {Number(ticket.price).toLocaleString()}
                        {isSingleTier && (
                          <span className="text-sm text-slate-500 font-normal ml-2">
                            per ticket
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-slate-500 mt-2">
                        {remaining} tickets remaining
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setQty(ticket.id, -1, remaining)}
                        disabled={qty === 0}
                        className="w-11 h-11 rounded-full border text-xl hover:bg-slate-100 disabled:opacity-40"
                      >
                        −
                      </button>

                      <span className="text-xl font-bold w-8 text-center">{qty}</span>

                      <button
                        onClick={() => setQty(ticket.id, 1, remaining)}
                        disabled={qty >= remaining}
                        className="w-11 h-11 rounded-full bg-[#0097a7] text-white text-xl hover:bg-[#007d8a] disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {message && (
              <div className="mt-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-700">
                {message}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Ticket Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between text-slate-600">
                <span>Tickets Selected</span>
                <span>{totalTickets}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Event</span>
                <span className="text-right font-medium">{event.title}</span>
              </div>

              <hr />

              <div className="flex justify-between text-2xl font-bold text-slate-800">
                <span>Total</span>
                <span className="text-[#0097a7]">KES {total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleBook}
              disabled={loading || totalTickets === 0}
              className="w-full mt-8 bg-[#0097a7] hover:bg-[#007d8a] text-white py-4 rounded-2xl font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Book Tickets"}
            </button>

            {!user && (
              <p className="text-sm text-slate-500 mt-4 text-center">
                Login to complete your booking.
              </p>
            )}
          </div>
        </div>
      </div>

      {totalTickets > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{totalTickets} Ticket(s)</p>
              <p className="text-xl font-bold text-[#0097a7]">
                KES {total.toLocaleString()}
              </p>
            </div>

            <button
              onClick={handleBook}
              disabled={loading}
              className="bg-[#0097a7] hover:bg-[#007d8a] text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              {loading ? "Booking..." : "Book"}
            </button>
          </div>
        </div>
      )}

      {(event.venue_name || event.venue?.name) && (
        <div className="max-w-6xl mx-auto px-6 mt-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Location
          </h2>
          <div className="rounded-3xl overflow-hidden shadow-lg h-80">
            <iframe
              title="Venue location"
              className="w-full h-full border-0"
              loading="lazy"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                event.venue_name || event.venue?.name
              )}&output=embed`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetail;