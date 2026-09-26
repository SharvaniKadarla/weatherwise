"use client";

import { useState } from "react";

import CurrentWeather from "@/components/CurrentWeather";
import Forecast from "@/components/Forecast";

type WeatherData = {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    precipitation: number;
    weather_code: number;
  };

  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
};

type WeatherSearch = {
  id: string;
  location_name: string;
  country: string;
  weather_data: WeatherData;
};

export default function Home() {
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] =
    useState<WeatherSearch | null>(null);

  async function handleSearch() {
    setError("");
    setResult(null);

    if (!location.trim()) {
      setError("Please enter a location.");
      return;
    }

    if (!startDate || !endDate) {
      setError("Please select both dates.");
      return;
    }

    if (endDate < startDate) {
      setError(
        "End date must be on or after the start date."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/weather", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          location,
          startDate,
          endDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to retrieve weather."
        );
      }

      setResult(data.search);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>WeatherWise</h1>

      <p>
        Real-Time Weather & Travel Intelligence
      </p>

      <input
        type="text"
        placeholder="Enter city or ZIP code"
        value={location}
        onChange={(e) =>
          setLocation(e.target.value)
        }
      />

      <input
        type="date"
        value={startDate}
        onChange={(e) =>
          setStartDate(e.target.value)
        }
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) =>
          setEndDate(e.target.value)
        }
      />

      <button
        onClick={handleSearch}
        disabled={loading}
      >
        {loading
          ? "Loading..."
          : "Get Weather"}
      </button>

      {error && (
        <p>❌ {error}</p>
      )}

      {result && (
        <section>
          <h2>
            {result.location_name}
          </h2>

          <p>
            {result.country}
          </p>

          <CurrentWeather
            weather={result.weather_data}
          />

          <Forecast
            weather={result.weather_data}
          />
        </section>
      )}
    </main>
  );
}