import React, { useState } from "react";

// PUBLIC_INTERFACE
function WeatherPage() {
  /**
   * WeatherPage: Gets city input, fetches current weather and forecast from OpenWeatherMap, displays results.
   * Uses .env variable process.env.REACT_APP_WEATHER_KEY for API key.
   */
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setWeather(null);
    setForecast([]);
    const apiKey = process.env.REACT_APP_WEATHER_KEY;
    if (!apiKey) {
      setError("Weather functionality unavailable: missing OpenWeatherMap key.");
      setLoading(false);
      return;
    }
    try {
      // Fetch current weather
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
      );
      if (!res.ok) throw new Error("City not found!");
      const data = await res.json();

      setWeather({
        temp: data.main.temp,
        type: data.weather[0].main,
        desc: data.weather[0].description,
        humidity: data.main.humidity,
        wind: data.wind.speed,
      });
      // Fetch 5-day forecast (every 3h, show once per day)
      const res2 = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
      );
      const data2 = await res2.json();
      // Take one forecast per day (e.g., 12pm)
      const onePerDay = [];
      let lastDate = "";
      for (const entry of data2.list) {
        const day = entry.dt_txt.split(" ")[0];
        const hour = entry.dt_txt.split(" ")[1].slice(0, 2);
        if (hour === "12" && day !== lastDate && onePerDay.length < 6) {
          onePerDay.push({
            date: day,
            temp: entry.main.temp,
            desc: entry.weather[0].description,
          });
          lastDate = day;
        }
      }
      setForecast(onePerDay);
    } catch (err) {
      setError("Unable to fetch weather: " + (err.message ?? ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Weather Forecast</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, margin: '24px 0' }}>
        <input
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="Enter city..."
          required
          className="input"
          style={{ flex: 1 }}
        />
        <button className="btn" type="submit" disabled={loading}>{loading ? "Loading..." : "Get Weather"}</button>
      </form>
      {error && <div style={{ color: "#d44d4d", margin: 8 }}>{error}</div>}
      {weather && (
        <div style={{ background: "rgba(0,0,0,0.5)", borderRadius: 8, marginBottom: 16, padding: 14 }}>
          <div><b>Current:</b> {weather.temp}&deg;C, {weather.type} ({weather.desc})</div>
          <div>Humidity: {weather.humidity}%, Wind: {weather.wind} m/s</div>
        </div>
      )}
      {forecast.length > 0 && (
        <div>
          <b>5-Day Forecast:</b>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
            {forecast.map(({ date, temp, desc }) => (
              <div key={date} style={{ background: "#1e2f72", borderRadius: 6, padding: 7 }}>
                <span style={{ fontWeight: 600 }}>{date}</span> - {temp}&deg;C, {desc}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherPage;
