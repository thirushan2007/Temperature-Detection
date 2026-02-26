import React, { useEffect, useState } from "react";
import "./App.css";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { MdLocationOn } from "react-icons/md";

type WeatherState = {
  temp?: number;
  temp_min?: number;
  temp_max?: number;
  humidity?: number;
  feels_like?: number;
  place?: string;
};

function App() {
  const [weather, setWeather] = useState<WeatherState>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchWeatherWithEnv(params: {
    coords: { latitude: number; longitude: number };
  }) {
    const lat = params.coords.latitude;
    const lon = params.coords.longitude;
    const key = process.env.REACT_APP_OPENWEATHER_KEY;
    if (!key) throw new Error("Missing REACT_APP_OPENWEATHER_KEY env var");

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`,
    );
    if (!res.ok)
      throw new Error(`Weather API error: ${res.status} ${res.statusText}`);
    const data = await res.json();
    return data; // parse and set state as needed
  }

  useEffect(() => {
    getLocationAndFetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getLocationAndFetchWeather() {
    setError(null);
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(latitude, longitude);
      },
      (err) => {
        setLoading(false);
        setError(err.message || "Unable to retrieve your location.");
      },
      { timeout: 10000 },
    );
  }

  async function fetchWeather(lat: number, lon: number) {
    const key = process.env.REACT_APP_OPENWEATHER_KEY;
    if (!key) {
      setLoading(false);
      setError(
        "Missing OpenWeather API key. Please add REACT_APP_OPENWEATHER_KEY to your .env file.",
      );
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`,
      );
      if (!res.ok)
        throw new Error(`Weather API error: ${res.status} ${res.statusText}`);
      const data = await res.json();

      setWeather({
        temp: Math.round(data.main?.temp),
        temp_min: Math.round(data.main?.temp_min),
        temp_max: Math.round(data.main?.temp_max),
        humidity: data.main?.humidity,
        feels_like: Math.round(data.main?.feels_like),
        place: `${data.name}${data.sys?.country ? ", " + data.sys.country : ""}`,
      });
      setError(null);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="App">
      <main className="back-home">
        <div className="weather-box-child">
          <h1 className="title-top">
            WEATHER <TiWeatherPartlySunny className="icons" />
          </h1>

          <div>
            <p className="temp-show">
              {loading ? "..." : (weather.temp ?? "--")}°C
            </p>
          </div>

          <p className="place-show">
            <MdLocationOn /> {weather.place ?? "Detecting location..."}
          </p>

          <div className="maxi-mini">
            <p id="mini" className="minim">
              Min: {loading ? "..." : (weather.temp_min ?? "--")}°C
            </p>
            <p id="maxi" className="maxii">
              Max: {loading ? "..." : (weather.temp_max ?? "--")}°C
            </p>
          </div>

          <div className="humi-like">
            <p id="humi" className="hu">
              Humidity: {loading ? "..." : (weather.humidity ?? "--")}%
            </p>
            <p id="feels" className="like">
              Feels like: {loading ? "..." : (weather.feels_like ?? "--")}°C
            </p>
          </div>

          {error && (
            <div style={{ marginTop: 12, color: "#c00" }}>
              <p>{error}</p>
              <button onClick={getLocationAndFetchWeather}>Retry</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
