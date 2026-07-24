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
      return { ...prev, [ticketId]: next };
    });
  };

  const total = useMemo(() => {
    if (!event) return 0;
    return event.ticket_types.reduce(
      (sum, ticket) => sum + (quantities[ticket.id] || 0) * Number(ticket.price),
      0
    );
  }, [event, quantities]);

  const totalTickets = useMemo(
    () => Object.values(quantities).reduce((a, b) => a + b, 0),
    [quantities]
  );

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
        await api.post("bookings/", { ticket_type: Number(ticketTypeId), quantity });
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
        <div className="text-xl font-semibold text-slate-600">Loading event...</div>
      </div>
    );
  }

  const heroImage = event.image
    ? event.image
    : "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600";

  const dateFmt = { month: "short", day: "numeric", year: "numeric" };
  const timeFmt = { hour: "2-digit", minute: "2-digit" };

  return (
    <div className="bg-slate-50 min-h-screen pb-32">

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <div className="w-full rounded-3xl overflow-hidden shadow-lg h-64 md:h-[420px] relative">
          <img src={heroImage} alt={event.title} className="w-full h-full object-cover" />
          <span className="absolute top-4 left-4 bg-[#0097a7] text-white px-4 py-1.5 rounded-full text-sm font-semibold capitalize shadow">
            {event.category}
          </span>
        </div>

        <div className="mt-8">
          <h1 className="text-slate-800 text-3xl md:text-4xl font-black">{event.title}</h1>

         <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-4 text-sm">
  <span className="text-slate-700">
    <span className="font-semibold text-slate-800">Venue:</span>{" "}
    {event.venue_name || event.venue?.name || "TBA"}
  </span>
  <span className="text-slate-300">|</span>
  <span className="text-slate-700">
    <span className="font-semibold text-slate-800">Date:</span>{" "}
    {new Date(event.start_time).toLocaleDateString(undefined, dateFmt)}
  </span>
  <span className="text-slate-300">|</span>
  <span className="text-slate-700">
    <span className="font-semibold text-slate-800">Time:</span>{" "}
    {new Date(event.start_time).toLocaleTimeString([], timeFmt)}
    {" – "}
    {new Date(event.end_time).toLocaleTimeString([], timeFmt)}
  </span>
</div>

          <p className="text-slate-600 leading-7 mt-6 whitespace-pre-line">
            {event.description || "No description has been provided for this event."}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10 grid lg:grid-cols-3 gap-8">

        {/* Tickets */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              {event.ticket_types?.length === 1 ? "Entry Price" : "Available Tickets"}
            </h2>

            <div className="space-y-4">
              {(event.ticket_types || []).map((ticket) => {
                const remaining = ticket.quantity_available - ticket.quantity_sold;
                const soldOut = remaining <= 0;
                const percentLeft = Math.max(
                  0,
                  Math.min(100, (remaining / ticket.quantity_available) * 100)
                );
                const isLow = !soldOut && percentLeft <= 15;
                const qty = quantities[ticket.id] || 0;
                const isSingleTier = event.ticket_types.length === 1;

                return (
                  <div
                    key={ticket.id}
                    className={`rounded-2xl p-6 border transition ${
                      soldOut
                        ? "border-slate-200 bg-slate-50 opacity-70"
                        : "border-slate-200 hover:border-[#0097a7] hover:shadow-md"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {!isSingleTier && (
                            <h3 className="text-xl font-bold text-slate-800">{ticket.name}</h3>
                          )}
                          {soldOut && (
                            <span className="text-xs font-bold uppercase tracking-wide bg-red-100 text-red-600 px-2.5 py-1 rounded-full">
                              Sold Out
                            </span>
                          )}
                          {isLow && (
                            <span className="text-xs font-bold uppercase tracking-wide bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                              Almost gone
                            </span>
                          )}
                        </div>

                        <p className="text-[#0097a7] text-2xl font-bold mt-2">
                          KES {Number(ticket.price).toLocaleString()}
                          {isSingleTier && (
                            <span className="text-sm text-slate-500 font-normal ml-2">
                              per ticket
                            </span>
                          )}
                        </p>

                        <div className="mt-3 max-w-xs">
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                soldOut ? "bg-slate-300" : isLow ? "bg-amber-400" : "bg-[#0097a7]"
                              }`}
                              style={{ width: `${100 - percentLeft}%` }}
                            />
                          </div>
                          <p className="text-xs text-slate-400 mt-1.5">
                            {soldOut ? "0 remaining" : `${remaining} of ${ticket.quantity_available} remaining`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <button
                          onClick={() => setQty(ticket.id, -1, remaining)}
                          disabled={qty === 0}
                          className="w-11 h-11 rounded-full border text-xl hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition"
                        >
                          −
                        </button>
                        <span className="text-xl font-bold w-8 text-center">{qty}</span>
                        <button
                          onClick={() => setQty(ticket.id, 1, remaining)}
                          disabled={qty >= remaining || soldOut}
                          className="w-11 h-11 rounded-full bg-[#0097a7] text-white text-xl hover:bg-[#007d8a] disabled:opacity-30 disabled:hover:bg-[#0097a7] transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {message && (
              <div className="mt-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-700 text-sm font-medium">
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Ticket Summary</h2>

            {totalTickets === 0 ? (
              <p className="text-sm text-slate-400 mb-6">
                Select a ticket quantity to see your total.
              </p>
            ) : (
              <div className="space-y-3 mb-6">
                {event.ticket_types
                  .filter((t) => quantities[t.id] > 0)
                  .map((t) => (
                    <div key={t.id} className="flex justify-between text-sm text-slate-600">
                      <span>{quantities[t.id]} × {t.name}</span>
                      <span className="font-medium">
                        KES {(quantities[t.id] * Number(t.price)).toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
            )}

            <hr className="mb-4" />

            <div className="flex justify-between text-2xl font-bold text-slate-800 mb-6">
              <span>Total</span>
              <span className="text-[#0097a7]">KES {total.toLocaleString()}</span>
            </div>

            <button
              onClick={handleBook}
              disabled={loading || totalTickets === 0}
              className="w-full bg-[#0097a7] hover:bg-[#007d8a] text-white py-4 rounded-2xl font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Mobile sticky bar */}
      {totalTickets > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{totalTickets} Ticket(s)</p>
              <p className="text-xl font-bold text-[#0097a7]">KES {total.toLocaleString()}</p>
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
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Location</h2>
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