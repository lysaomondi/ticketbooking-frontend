import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import EventCarousel from "../components/EventCarousel";

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("events/").then((res) => setEvents(res.data));
  }, []);

  return (
    <div>
      <EventCarousel events={events} />

      <section className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-[#0097a7] font-semibold text-sm tracking-wide uppercase">
          Upcoming Events
        </p>
        <h2 className="font-[Sora] font-bold text-3xl text-[#0B2027] mt-1 mb-8">
          Events You Can't Miss
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden border border-gray-100"
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#0B2027] to-[#0097a7] flex items-center justify-center text-white/70 text-sm">
                    {event.category}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-[Sora] font-semibold text-lg text-[#0B2027]">
                  {event.title}
                </h3>
                <p className="text-sm text-[#4A5C60] mt-2">
                  {new Date(event.start_time).toLocaleDateString(undefined, {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </p>
                <span className="inline-block mt-4 text-[#0097a7] font-semibold text-sm">
                  Details & Tickets →
                </span>
              </div>
            </Link>
          ))}

          {events.length === 0 && (
            <p className="text-[#4A5C60] col-span-full">
              No events yet — check back soon.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Events;