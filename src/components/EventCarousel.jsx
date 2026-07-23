import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function EventCarousel({ events }) {
  const [index, setIndex] = useState(0);
  const slides = events.slice(0, 5); // top 5 upcoming events

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <section className="bg-[#0B2027] text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h1 className="font-[Sora] font-extrabold text-4xl md:text-5xl">
            Online Event Ticketing, Simplified.
          </h1>
          <p className="mt-4 text-[#a9c3c6] max-w-xl mx-auto">
            Check back soon for upcoming events.
          </p>
        </div>
      </section>
    );
  }

  const goTo = (i) => setIndex(((i % slides.length) + slides.length) % slides.length);

  return (
    <section className="relative bg-[#0B2027] text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-20 relative min-h-[360px] flex items-center">
        {slides.map((event, i) => (
          <div
            key={event.id}
            className={`absolute inset-x-6 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <p className="text-[#4dd0e1] font-semibold text-sm tracking-wide uppercase mb-3">
              {event.category} · {new Date(event.start_time).toLocaleDateString(undefined, {
                month: "short", day: "numeric", year: "numeric",
              })}
            </p>
            <h1 className="font-[Sora] font-extrabold text-3xl md:text-5xl leading-tight max-w-2xl">
              {event.title}
            </h1>
            <p className="mt-4 text-[#a9c3c6] max-w-xl">
              {event.description?.slice(0, 120) || "Don't miss this one."}
            </p>
            <Link
              to={`/events/${event.id}`}
              className="inline-block mt-6 bg-[#0097a7] px-6 py-3 rounded-full font-semibold hover:bg-[#007c8a] transition"
            >
              Buy Tickets
            </Link>
          </div>
        ))}
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="flex justify-center gap-2 pb-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "bg-[#0097a7] w-6" : "bg-white/30 w-2"
              }`}
            />
          ))}
        </div>
      )}

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => goTo(index - 1)}
            aria-label="Previous slide"
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center transition"
          >
            ‹
          </button>
          <button
            onClick={() => goTo(index + 1)}
            aria-label="Next slide"
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center transition"
          >
            ›
          </button>
        </>
      )}
    </section>
  );
}

export default EventCarousel;