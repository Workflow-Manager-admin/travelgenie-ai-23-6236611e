import React, { useRef, useState } from "react";

// Leaflet and react-leaflet are required. Show fallback if not installed.
// You may install them with `npm install leaflet react-leaflet` outside of editing code blocks.

// PUBLIC_INTERFACE
function MapPage() {
  /**
   * MapPage: Displays interactive map of the destination using Mapbox tile API with Leaflet
   * Uses the .env key via process.env.REACT_APP_MAPBOX_KEY for the Mapbox access token.
   */
  const [coords, setCoords] = useState({ lat: 40.7128, lng: -74.0060 }); // Default NYC
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();
    setError(null);
    // Use Mapbox Geocoding (see https://docs.mapbox.com/api/search/geocoding/)
    const query = encodeURIComponent(search);
    const mapboxKey = process.env.REACT_APP_MAPBOX_KEY;
    if (!mapboxKey) {
      setError("Map functionality unavailable: missing Mapbox key.");
      return;
    }
    try {
      const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxKey}`);
      const data = await res.json();
      if (!data.features || data.features.length === 0) {
        setError("Destination not found!");
        return;
      }
      const center = data.features[0].center;
      setCoords({ lat: center[1], lng: center[0] });
    } catch {
      setError("Error accessing map/geocoding API.");
    }
  }

  // Try to import leaflet and react-leaflet, if not fallback to a message.
  let MapContainer, TileLayer, Marker, Popup;
  try {
    // eslint-disable-next-line
    ({ MapContainer, TileLayer, Marker, Popup } = require("react-leaflet"));
    require("leaflet/dist/leaflet.css");
  } catch {
    MapContainer = TileLayer = Marker = Popup = undefined;
  }

  return (
    <div>
      <h2>Discover Your Destination on Map</h2>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, margin: "20px 0" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Enter city or attraction..."
          className="input"
          style={{ flex: 1 }}
          required
        />
        <button className="btn" type="submit">Show Map</button>
      </form>
      {error && <div style={{ color: "#ef7575" }}>{error}</div>}
      {MapContainer && TileLayer && (
        <div style={{ height: 400, width: "100%", maxWidth: 600, margin: "20px auto" }}>
          <MapContainer
            center={[coords.lat, coords.lng]}
            zoom={13}
            style={{ height: 400, width: "100%" }}
          >
            <TileLayer
              // Using Mapbox tiles with .env access token
              url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAPBOX_KEY}`}
              attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              tileSize={512}
              zoomOffset={-1}
            />
            <Marker position={[coords.lat, coords.lng]}>
              <Popup>Destination</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
      {!MapContainer && (
        <div>
          <b>Missing dependency for map:</b><br />
          Please install <code>react-leaflet</code> and <code>leaflet</code> for map functionality.
        </div>
      )}
    </div>
  );
}

export default MapPage;
