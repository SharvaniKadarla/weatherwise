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
    <section>
      <h2>5-Day Forecast</h2>

      <div>
        {daily.time.map(
          (date: string, index: number) => (
            <div key={date}>
              <h3>
                {new Date(date).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "short",
                  }
                )}
              </h3>

              <div>
                {getWeatherIcon(
                  daily.weather_code[index]
                )}
              </div>

              <p>
                {getWeatherDescription(
                  daily.weather_code[index]
                )}
              </p>

              <p>
                High:{" "}
                {daily.temperature_2m_max[index]}°F
              </p>

              <p>
                Low:{" "}
                {daily.temperature_2m_min[index]}°F
              </p>

              <p>
                Rain:{" "}
                {
                  daily
                    .precipitation_probability_max[
                    index
                  ]
                }
                %
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
}