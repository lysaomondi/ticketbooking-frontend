import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const CATEGORIES = ["all", "concert", "movie", "sports", "conference", "other"];

function BrowseEvents() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    api.get("events/").then((res) => setEvents(res.data));
  }, []);

  const filtered = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      (event.venue_name || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || event.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-[Sora] font-bold text-3xl text-[#0B2027] mb-6">
        Browse Events
      </h1>

// Search and filter
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by event or venue..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#0097a7]"
        />

        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition ${
                category === cat
                  ? "bg-[#0097a7] text-white"
                  : "bg-white border border-gray-200 text-[#4A5C60] hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-[#4A5C60] mb-6">
        {filtered.length} event{filtered.length !== 1 ? "s" : ""} found
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((event) => (
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

        {filtered.length === 0 && (
          <p className="text-[#4A5C60] col-span-full">
            No events match your search.
          </p>
        )}
      </div>
    </div>
  );
}

export default BrowseEvents;