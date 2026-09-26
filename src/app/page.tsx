"use client";

import { useState } from "react";

import CurrentWeather from "@/components/CurrentWeather";
import Forecast from "@/components/Forecast";
import YouTubeVideos from "@/components/YouTubeVideos";
import WeatherInsights from "@/components/WeatherInsights";
import SavedSearches from "@/components/SavedSearches";
import DateRangeForecast from "@/components/DateRangeForecast";

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
    wind_speed_10m_max: number[];
  };

  date_range_daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
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
  const [locationLoading, setLocationLoading] =
  useState(false);

  const [result, setResult] =
    useState<WeatherSearch | null>(null);

  function handleUseCurrentLocation() {
  setError("");

  if (!navigator.geolocation) {
    setError(
      "Geolocation is not supported by your browser."
    );
    return;
  }

  setLocationLoading(true);

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude =
        position.coords.latitude;

      const longitude =
        position.coords.longitude;

      setLocation(
        `${latitude.toFixed(
          6
        )}, ${longitude.toFixed(6)}`
      );

      setLocationLoading(false);
    },
    (error) => {
      console.error(
        "Geolocation error:",
        error
      );

      if (
        error.code ===
        error.PERMISSION_DENIED
      ) {
        setError(
          "Location access was denied. Please allow location access or enter a location manually."
        );
      } else if (
        error.code ===
        error.POSITION_UNAVAILABLE
      ) {
        setError(
          "Your current location is unavailable. Please try again or enter a location manually."
        );
      } else if (
        error.code ===
        error.TIMEOUT
      ) {
        setError(
          "Location request timed out. Please try again."
        );
      } else {
        setError(
          "Unable to retrieve your current location."
        );
      }

      setLocationLoading(false);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
}

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
async function handleExport(
  format: "json" | "csv"
) {
  if (!result) {
    setError(
      "Please search for weather before exporting."
    );
    return;
  }

  try {
    const response = await fetch(
      "/api/export",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          format,
          location:
            result.location_name,
          country: result.country,
          startDate,
          endDate,
          weatherData:
            result.weather_data,
        }),
      }
    );

    if (!response.ok) {
      const data =
        await response.json();

      throw new Error(
        data.error ||
          "Unable to export weather data."
      );
    }

    const blob =
      await response.blob();

    const downloadUrl =
      window.URL.createObjectURL(
        blob
      );

    const link =
      document.createElement("a");

    link.href = downloadUrl;

    link.download =
      `weatherwise-${result.location_name}.${format}`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(
      downloadUrl
    );
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Unable to export weather data."
    );
  }
}
  return (
    <main>
      <h1>WeatherWise</h1>

      <p>
        Real-Time Weather & Travel Intelligence
      </p>

      <div className="location-input-group">
  <input
    type="text"
    placeholder="Enter city, ZIP code, landmark, or GPS coordinates"
    value={location}
    onChange={(e) =>
      setLocation(e.target.value)
    }
  />

  <button
    type="button"
    className="location-button"
    onClick={handleUseCurrentLocation}
    disabled={locationLoading}
  >
    {locationLoading
      ? "Getting Location..."
      : "📍 Use My Current Location"}
  </button>
</div>

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

<DateRangeForecast
  weather={
    result.weather_data
      .date_range_daily
  }
  startDate={startDate}
  endDate={endDate}
/>

<WeatherInsights
  weather={result.weather_data}
/>

    <YouTubeVideos
      location={result.location_name}
    />

    <div>
      <button
        onClick={() =>
          handleExport("csv")
        }
      >
        Export CSV
      </button>

      <button
        onClick={() =>
          handleExport("json")
        }
      >
        Export JSON
      </button>
    </div>
  </section>
)}

<SavedSearches />

<section className="pma-section">
  <h2>About PM Accelerator</h2>

  <p>
    PM Accelerator is a global product management
    career development community and training program
    that helps aspiring and current product managers
    build product skills, portfolios, interview
    readiness, and career opportunities through
    training, coaching, mentorship, and networking.
  </p>

  <p>
    WeatherWise was developed as part of a hands-on
    technical project experience associated with
    PM Accelerator.
  </p>

  <p>
    <a
      href="https://www.pmaccelerator.io/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Learn more about PM Accelerator
    </a>
  </p>
</section>

<footer>
  <p>
    Built by Sharvani Kadarla
  </p>

  <p>
    Location data © OpenStreetMap contributors
  </p>
</footer>
    </main>
  );
}