import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
function HomePage() {
  /** HomePage: Landing/introduction for TravelGenie AI */
  return (
    <div className="hero" style={{ paddingTop: 30 }}>
      <div className="subtitle">Welcome to</div>
      <h1 className="title">TravelGenie AI</h1>
      <div className="description">
        Plan your trip with AI-powered itineraries, discover attractions, check weather, and chat with your travel assistant!
      </div>
      <div style={{ display: 'flex', flexDirection: "column", gap: 18, alignItems: "center", margin: "32px 0" }}>
        <Link className="btn btn-large" to="/itinerary">AI Trip Itinerary</Link>
        <Link className="btn btn-large" to="/map">Map Explorer</Link>
        <Link className="btn btn-large" to="/weather">Check Weather</Link>
        <Link className="btn btn-large" to="/chat">Ask the AI</Link>
      </div>
    </div>
  );
}

export default HomePage;
