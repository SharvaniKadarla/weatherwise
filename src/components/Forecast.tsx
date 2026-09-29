"use client";

import {
  getWeatherDescription,
  getWeatherIcon,
} from "@/lib/weatherCode";

interface ForecastData {
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}

interface Props {
  weather: ForecastData;
}

export default function Forecast({
  weather,
}: Props) {
  const daily = weather.daily;

  return (
    <section className="forecast-section">
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">
            WEEK AHEAD
          </span>

          <h2>5-Day Forecast</h2>

          <p>
            A quick look at the upcoming weather conditions.
          </p>
        </div>
      </div>

      <div className="forecast-grid">
        {daily.time.map(
          (date: string, index: number) => (
            <article
              key={date}
              className="forecast-card"
            >
              <div className="forecast-card-header">
                <h3>
                  {new Date(
                    `${date}T00:00:00`
                  ).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "short",
                    }
                  )}
                </h3>

                <span className="forecast-date">
                  {new Date(
                    `${date}T00:00:00`
                  ).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>

              <div
                className="forecast-icon"
                aria-hidden="true"
              >
                {getWeatherIcon(
                  daily.weather_code[index]
                )}
              </div>

              <p className="forecast-description">
                {getWeatherDescription(
                  daily.weather_code[index]
                )}
              </p>

              <div className="forecast-temperatures">
                <div>
                  <span>High</span>
                  <strong>
                    {daily.temperature_2m_max[index]}°F
                  </strong>
                </div>

                <div>
                  <span>Low</span>
                  <strong>
                    {daily.temperature_2m_min[index]}°F
                  </strong>
                </div>
              </div>

              <div className="forecast-rain">
                <span>🌧️ Rain chance</span>

                <strong>
                  {
                    daily
                      .precipitation_probability_max[
                      index
                    ]
                  }
                  %
                </strong>
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
}