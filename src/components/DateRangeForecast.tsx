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
      <h2>Selected Date Range</h2>

      <p className="date-range-description">
        Weather forecast for{" "}
        <strong>{startDate}</strong> through{" "}
        <strong>{endDate}</strong>.
      </p>

      <div className="date-range-grid">
        {daily.time.map(
          (date: string, index: number) => (
            <article
              key={date}
              className="date-range-card"
            >
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

              <div className="forecast-icon">
                {getWeatherIcon(
                  daily.weather_code[index]
                )}
              </div>

              <p className="forecast-description">
                {getWeatherDescription(
                  daily.weather_code[index]
                )}
              </p>

              <p>
                <strong>High:</strong>{" "}
                {
                  daily.temperature_2m_max[
                    index
                  ]
                }
                °F
              </p>

              <p>
                <strong>Low:</strong>{" "}
                {
                  daily.temperature_2m_min[
                    index
                  ]
                }
                °F
              </p>

              <p>
                <strong>Rain:</strong>{" "}
                {
                  daily
                    .precipitation_probability_max[
                    index
                  ]
                }
                %
              </p>

              <p>
                <strong>Wind:</strong>{" "}
                {
                  daily.wind_speed_10m_max[
                    index
                  ]
                }{" "}
                mph
              </p>
            </article>
          )
        )}
      </div>
    </section>
  );
}