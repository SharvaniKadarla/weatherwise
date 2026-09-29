"use client";

import {
  getWeatherDescription,
  getWeatherIcon,
} from "@/lib/weatherCode";

interface DateRangeForecastData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
}

interface Props {
  weather: DateRangeForecastData;
  startDate: string;
  endDate: string;
}

export default function DateRangeForecast({
  weather,
  startDate,
  endDate,
}: Props) {
  const daily = weather;

  return (
    <section className="date-range-section">
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">
            YOUR TRIP
          </span>

          <h2>Selected Date Range</h2>

          <p className="date-range-description">
            Weather forecast for{" "}
            <strong>{startDate}</strong>{" "}
            through{" "}
            <strong>{endDate}</strong>.
          </p>
        </div>
      </div>

      <div className="date-range-grid">
        {daily.time.map(
          (date: string, index: number) => (
            <article
              key={date}
              className="date-range-card"
            >
              <div className="date-range-card-top">
                <h3>
                  {new Date(
                    `${date}T00:00:00`
                  ).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </h3>

                <span className="day-number">
                  {index + 1}
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

              <div className="date-range-stats">
                <div className="date-range-stat">
                  <span>High</span>
                  <strong>
                    {
                      daily.temperature_2m_max[
                        index
                      ]
                    }
                    °F
                  </strong>
                </div>

                <div className="date-range-stat">
                  <span>Low</span>
                  <strong>
                    {
                      daily.temperature_2m_min[
                        index
                      ]
                    }
                    °F
                  </strong>
                </div>

                <div className="date-range-stat">
                  <span>Rain</span>
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

                <div className="date-range-stat">
                  <span>Wind</span>
                  <strong>
                    {
                      daily.wind_speed_10m_max[
                        index
                      ]
                    }{" "}
                    mph
                  </strong>
                </div>
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
}