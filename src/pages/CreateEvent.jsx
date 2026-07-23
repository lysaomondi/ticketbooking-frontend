import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const emptyTicketType = { name: "", price: "", quantity_available: "" };

function CreateEvent() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    venue: "",
    start_time: "",
    end_time: "",
    category: "other",
  });
  const [ticketTypes, setTicketTypes] = useState([{ ...emptyTicketType }]);
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useState(() => {
    api.get("venues/").then((res) => setVenues(res.data));
  }, []);

  if (!user || user.role !== "organizer") {
    return (
      <div className="max-w-lg mx-auto p-6 text-center">
        <p className="text-[#4A5C60]">
          Only organizer accounts can create events.
        </p>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTicketChange = (index, field, value) => {
    const updated = [...ticketTypes];
    updated[index][field] = value;
    setTicketTypes(updated);
  };

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { ...emptyTicketType }]);
  };

  const removeTicketType = (index) => {
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Create event
      const eventRes = await api.post("events/", form);
      const eventId = eventRes.data.id;

      // Create tickettype 
      for (const tt of ticketTypes) {
        if (!tt.name) continue; // skip empty rows
        await api.post("ticket-types/", {
          event: eventId,
          name: tt.name,
          price: tt.price,
          quantity_available: tt.quantity_available,
        });
      }

      navigate(`/events/${eventId}`);
    } catch (err) {
      setError("Could not create event. Check all fields and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="font-[Sora] font-bold text-2xl text-[#0B2027] mb-6">
        Create an Event
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="title"
          placeholder="Event title"
          value={form.title}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
          rows="3"
        />

        <select
          name="venue"
          value={form.venue}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
          required
        >
          <option value="">Select a venue</option>
          {venues.map((v) => (
            <option key={v.id} value={v.id}>{v.name} — {v.city}</option>
          ))}
        </select>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
        >
          <option value="concert">Concert</option>
          <option value="movie">Movie</option>
          <option value="sports">Sports</option>
          <option value="conference">Conference</option>
          <option value="other">Other</option>
        </select>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-[#4A5C60]">Start time</label>
            <input
              type="datetime-local"
              name="start_time"
              value={form.start_time}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 w-full"
              required
            />
          </div>
          <div>
            <label className="text-sm text-[#4A5C60]">End time</label>
            <input
              type="datetime-local"
              name="end_time"
              value={form.end_time}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 w-full"
              required
            />
          </div>
        </div>

        <hr className="my-2" />

        <h2 className="font-semibold text-[#0B2027]">Ticket Types</h2>
        {ticketTypes.map((tt, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              placeholder="Name (e.g. VIP)"
              value={tt.name}
              onChange={(e) => handleTicketChange(index, "name", e.target.value)}
              className="border rounded-lg px-3 py-2 flex-1"
            />
            <input
              type="number"
              placeholder="Price"
              value={tt.price}
              onChange={(e) => handleTicketChange(index, "price", e.target.value)}
              className="border rounded-lg px-3 py-2 w-28"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={tt.quantity_available}
              onChange={(e) => handleTicketChange(index, "quantity_available", e.target.value)}
              className="border rounded-lg px-3 py-2 w-28"
            />
            {ticketTypes.length > 1 && (
              <button
                type="button"
                onClick={() => removeTicketType(index)}
                className="text-red-500 text-sm px-2"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addTicketType}
          className="text-[#0097a7] text-sm font-medium self-start"
        >
          + Add another ticket type
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-[#0097a7] text-white rounded-full py-3 font-semibold hover:bg-[#007c8a] transition disabled:opacity-50 mt-2"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;