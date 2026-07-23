import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Signup() {
  const [form, setForm] = useState({ email: "", password: "", name: "", role: "customer" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("auth/register/", form);
      navigate("/login");
    } catch (err) {
      setError("Could not create account. Check your details.");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16 p-6 border rounded-lg shadow-sm">
      <h1 className="text-xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="name" placeholder="Name" onChange={handleChange} className="border rounded px-3 py-2" required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="border rounded px-3 py-2" required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="border rounded px-3 py-2" required />
        <select name="role" onChange={handleChange} className="border rounded px-3 py-2">
          <option value="customer">Customer</option>
          <option value="organizer">Organizer</option>
        </select>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button className="bg-[#0097a7] text-white rounded py-2 hover:bg-[#007f8c]">
          Create Account
        </button>
      </form>
    </div>
  );
}

export default Signup;