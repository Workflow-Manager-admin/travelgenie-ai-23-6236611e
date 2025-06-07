import React, { useState } from "react";

// PUBLIC_INTERFACE
function ItineraryPage() {
  /**
   * ItineraryPage: Form for trip details and display AI-generated itinerary (via Cohere LLM API, uses .env value for key)
   */
  const [form, setForm] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    preferences: "",
  });
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState("");
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setItinerary("");
    setError(null);

    // For demo: Use Cohere LLM API (https://docs.cohere.com/docs/generate)
    // Endpoint: https://api.cohere.ai/v1/generate
    // Key: process.env.REACT_APP_COHERE_KEY
    // prompt is constructed from input.

    const prompt = `You are a travel assistant. Given the following info, write a day-by-day itinerary:\n
    Destination: ${form.destination}\n
    Start Date: ${form.startDate}\n
    End Date: ${form.endDate}\n
    Budget: ${form.budget}\n
    Preferences: ${form.preferences}\n
    Format the output as:\nDay 1: ...\nDay 2: ...`;

    try {
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_COHERE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "command",
          prompt,
          max_tokens: 350,
          temperature: 0.6,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch itinerary from Cohere AI");
      }
      const data = await response.json();
      if (data && data.generations && data.generations.length > 0) {
        setItinerary(data.generations[0].text);
      } else {
        setItinerary("Sorry, something went wrong generating your itinerary.");
      }
    } catch (err) {
      setError(err.message || "Unknown error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ margin: "0 auto", maxWidth: 500 }}>
      <h2>Get Your AI Trip Itinerary</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '24px 0' }}>
        <input
          name="destination"
          value={form.destination}
          onChange={handleChange}
          required
          placeholder="Destination (city or country)"
          className="input"
        />
        <input
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          type="date"
          required
        />
        <input
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          type="date"
          required
        />
        <input
          name="budget"
          value={form.budget}
          onChange={handleChange}
          placeholder="Budget (eg. $1000)"
          className="input"
          required
        />
        <input
          name="preferences"
          value={form.preferences}
          onChange={handleChange}
          placeholder="Preferences (e.g. museums, beach, food...)"
          className="input"
        />
        <button className="btn btn-large" type="submit" disabled={loading}>{loading ? "Generating..." : "Generate Itinerary"}</button>
      </form>
      {error && <div style={{ color: "#ed5c5c", marginBottom: 8 }}>Error: {error}</div>}
      {itinerary && (
        <div style={{
          background: "rgba(0,0,0,0.5)",
          borderRadius: 8,
          padding: 18,
          whiteSpace: "pre-line",
          marginBottom: 22,
        }}>
          <strong>Your Trip Plan:</strong>
          <div>{itinerary}</div>
        </div>
      )}
    </div>
  );
}

export default ItineraryPage;
