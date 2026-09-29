"use client";

import { FormEvent, useState } from "react";

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

function getWeatherTheme(code: number): string {
  if (code === 0 || code === 1) {
    return "weather-theme-clear";
  }

  if (code >= 2 && code <= 3) {
    return "weather-theme-cloudy";
  }

  if (code >= 51 && code <= 67) {
    return "weather-theme-rain";
  }

  if (code >= 71 && code <= 77) {
    return "weather-theme-snow";
  }

  if (code >= 80 && code <= 82) {
    return "weather-theme-rain";
  }

  if (code >= 85 && code <= 86) {
    return "weather-theme-snow";
  }

  if (code >= 95) {
    return "weather-theme-storm";
  }

  return "weather-theme-default";
}

function getWeatherMood(code: number): string {
  if (code === 0 || code === 1) {
    return "Clear skies";
  }

  if (code >= 2 && code <= 3) {
    return "Cloudy atmosphere";
  }

  if (code >= 51 && code <= 67) {
    return "Rainy conditions";
  }

  if (code >= 71 && code <= 77) {
    return "Winter conditions";
  }

  if (code >= 80 && code <= 82) {
    return "Showers expected";
  }

  if (code >= 85 && code <= 86) {
    return "Snow showers";
  }

  if (code >= 95) {
    return "Storm conditions";
  }

  return "Live weather";
}

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

      const response = await fetch(
        "/api/weather",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            location,
            startDate,
            endDate,
          }),
        }
      );

      const data =
        await response.json();

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
            country:
              result.country,
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

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    handleSearch();
  }

  const weatherCode =
    result?.weather_data.current
      .weather_code ?? -1;

  const weatherTheme =
    result
      ? getWeatherTheme(weatherCode)
      : "weather-theme-default";

  const weatherMood =
    result
      ? getWeatherMood(weatherCode)
      : "Live weather";

  const tripDays =
    result?.weather_data.date_range_daily
      .time.length ?? 0;

  const tripForecast =
    result?.weather_data.date_range_daily;

  const averageHigh =
    tripForecast &&
    tripForecast.temperature_2m_max.length > 0
      ? Math.round(
          tripForecast.temperature_2m_max.reduce(
            (sum, value) =>
              sum + value,
            0
          ) /
            tripForecast
              .temperature_2m_max.length
        )
      : null;

  const maximumRain =
    tripForecast &&
    tripForecast
      .precipitation_probability_max
      .length > 0
      ? Math.max(
          ...tripForecast
            .precipitation_probability_max
        )
      : null;

  const maximumWind =
    tripForecast &&
    tripForecast.wind_speed_10m_max
      .length > 0
      ? Math.max(
          ...tripForecast
            .wind_speed_10m_max
        )
      : null;

  return (
    <main
      className={`weatherwise-page ${weatherTheme}`}
    >
      <div className="background-orb background-orb-one" />
      <div className="background-orb background-orb-two" />

      <div className="ambient-glow ambient-glow-one" />
      <div className="ambient-glow ambient-glow-two" />

      <div className="weather-particles" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      {/* =====================================================
          HERO
          ===================================================== */}

      <header className="hero-section">
        <div className="hero-floating-badge hero-floating-badge-left">
          <span>◌</span>
          Live data
        </div>

        <div className="hero-floating-badge hero-floating-badge-right">
          <span>✦</span>
          Travel ready
        </div>

        <div className="brand-mark">
          <span>☁️</span>

          <div className="brand-mark-glow" />
        </div>

        <div className="hero-eyebrow">
          WEATHER INTELLIGENCE
        </div>

        <h1>
          Weather<span>Wise</span>
        </h1>

        <p className="hero-subtitle">
          Real-Time Weather & Travel Intelligence
        </p>

        <p className="hero-description">
          Plan smarter trips with real-time weather,
          forecasts, intelligent travel insights,
          and destination inspiration — all in one
          beautifully connected experience.
        </p>

        <div className="hero-feature-row">
          <span>
            <b>01</b>
            Live Forecasts
          </span>

          <span>
            <b>02</b>
            Trip Intelligence
          </span>

          <span>
            <b>03</b>
            Destination Discovery
          </span>
        </div>
      </header>

      {/* =====================================================
          SEARCH
          ===================================================== */}

      <section className="search-panel">
        <div className="search-panel-shine" />

        <div className="search-panel-header">
          <div>
            <span className="section-eyebrow">
              PLAN YOUR TRIP
            </span>

            <h2>
              Check the weather
            </h2>

            <p>
              Enter a destination and travel dates
              to unlock your weather intelligence.
            </p>
          </div>

          <div className="search-status">
            <span className="status-dot" />
            Live data
          </div>
        </div>

        <form
          className="weather-search-form"
          onSubmit={handleSubmit}
        >
          <div className="location-field">
            <label htmlFor="location">
              Destination
            </label>

            <div className="location-input-wrapper">
              <span
                className="input-icon"
                aria-hidden="true"
              >
                📍
              </span>

              <input
                id="location"
                type="text"
                placeholder="City, ZIP code, landmark, or GPS coordinates"
                value={location}
                onChange={(e) =>
                  setLocation(
                    e.target.value
                  )
                }
                autoComplete="off"
              />

              <button
                type="button"
                className="location-button"
                onClick={
                  handleUseCurrentLocation
                }
                disabled={
                  locationLoading
                }
              >
                {locationLoading ? (
                  <>
                    <span className="button-spinner" />
                    Locating...
                  </>
                ) : (
                  <>
                    <span>◎</span>
                    Use my location
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="date-fields">
            <div className="date-field">
              <label htmlFor="start-date">
                Start Date
              </label>

              <div className="date-input-wrapper">
                <span
                  className="input-icon"
                  aria-hidden="true"
                >
                  📅
                </span>

                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="date-field">
              <label htmlFor="end-date">
                End Date
              </label>

              <div className="date-input-wrapper">
                <span
                  className="input-icon"
                  aria-hidden="true"
                >
                  📅
                </span>

                <input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) =>
                    setEndDate(
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="search-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="button-spinner" />
                Analyzing weather...
              </>
            ) : (
              <>
                Get Weather
                <span aria-hidden="true">
                  →
                </span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div
            className="error-alert"
            role="alert"
          >
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}
      </section>

      {/* =====================================================
          RESULTS
          ===================================================== */}

      {result && (
        <section className="results-section">
          <div className="location-result-header">
            <div>
              <span className="section-eyebrow">
                WEATHER REPORT
              </span>

              <h2>
                {result.location_name}
              </h2>

              <p>
                <span>📍</span>
                {result.country}
              </p>
            </div>

            <div className="result-header-right">
              <div className="weather-mood-badge">
                <span>✦</span>
                {weatherMood}
              </div>

              <div className="live-badge">
                <span className="status-dot" />
                Live forecast
              </div>
            </div>
          </div>

          {/* TRIP INTELLIGENCE STRIP */}

          <div className="trip-intelligence">
            <div className="trip-intelligence-heading">
              <span className="section-eyebrow">
                TRIP INTELLIGENCE
              </span>

              <span className="trip-days">
                {tripDays}{" "}
                {tripDays === 1
                  ? "day"
                  : "days"}
              </span>
            </div>

            <div className="trip-stat-grid">
              <div className="trip-stat">
                <div className="trip-stat-icon">
                  📅
                </div>

                <div>
                  <span>Trip dates</span>

                  <strong>
                    {startDate} → {endDate}
                  </strong>
                </div>
              </div>

              <div className="trip-stat">
                <div className="trip-stat-icon">
                  🌡️
                </div>

                <div>
                  <span>Average high</span>

                  <strong>
                    {averageHigh !== null
                      ? `${averageHigh}°F`
                      : "—"}
                  </strong>
                </div>
              </div>

              <div className="trip-stat">
                <div className="trip-stat-icon">
                  🌧️
                </div>

                <div>
                  <span>Max rain chance</span>

                  <strong>
                    {maximumRain !== null
                      ? `${maximumRain}%`
                      : "—"}
                  </strong>
                </div>
              </div>

              <div className="trip-stat">
                <div className="trip-stat-icon">
                  💨
                </div>

                <div>
                  <span>Max wind</span>

                  <strong>
                    {maximumWind !== null
                      ? `${maximumWind} mph`
                      : "—"}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <CurrentWeather
            weather={
              result.weather_data
            }
          />

          <Forecast
            weather={
              result.weather_data
            }
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
            weather={
              result.weather_data
            }
          />

          <YouTubeVideos
            location={
              result.location_name
            }
          />

          <div className="export-section">
            <div className="export-copy">
              <span className="section-eyebrow">
                DATA EXPORT
              </span>

              <h3>
                Take your forecast with you
              </h3>

              <p>
                Export your weather intelligence
                in a convenient format.
              </p>
            </div>

            <div className="export-actions">
              <button
                type="button"
                className="button-secondary"
                onClick={() =>
                  handleExport("csv")
                }
              >
                <span>📊</span>
                Export CSV
              </button>

              <button
                type="button"
                className="button-secondary"
                onClick={() =>
                  handleExport("json")
                }
              >
                <span>{"{ }"}</span>
                Export JSON
              </button>
            </div>
          </div>
        </section>
      )}

      <SavedSearches />

      {/* =====================================================
          PM ACCELERATOR
          ===================================================== */}

      <section className="pma-section">
        <div className="pma-decoration pma-decoration-one" />
        <div className="pma-decoration pma-decoration-two" />

        <div className="pma-content">
          <div className="pma-icon">
            🚀
          </div>

          <div>
            <span className="section-eyebrow">
              PROJECT EXPERIENCE
            </span>

            <h2>
              About PM Accelerator
            </h2>

            <p>
              PM Accelerator is a global product
              management career development community
              and training program that helps aspiring
              and current product managers build product
              skills, portfolios, interview readiness,
              and career opportunities through training,
              coaching, mentorship, and networking.
            </p>

            <p>
              WeatherWise was developed as part of a
              hands-on technical project experience
              associated with PM Accelerator.
            </p>

            <a
              href="https://www.pmaccelerator.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="pma-link"
            >
              Learn more about PM Accelerator
              <span aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <footer className="site-footer">
        <div className="footer-brand">
          <span className="footer-logo">
            ☁️
          </span>

          <div>
            <strong>
              WeatherWise
            </strong>

            <span>
              Real-Time Weather Intelligence
            </span>
          </div>
        </div>

        <div className="footer-details">
          <p>
            Built by Sharvani Kadarla
          </p>

          <p>
            Location data © OpenStreetMap
            contributors
          </p>
        </div>
      </footer>
    </main>
  );
}