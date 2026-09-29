import {
  getWeatherDescription,
  getWeatherIcon,
} from "@/lib/weatherCode";

interface CurrentWeatherData {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    precipitation: number;
    weather_code: number;
  };
}

interface Props {
  weather: CurrentWeatherData;
}

export default function CurrentWeather({
  weather,
}: Props) {
  const current = weather.current;

  return (
    <section className="current-weather-section">
      <div className="current-weather-card">
        <div className="current-weather-main">
          <div className="current-weather-icon" aria-hidden="true">
            {getWeatherIcon(current.weather_code)}
          </div>

          <div className="current-weather-temperature">
            <span className="temperature-value">
              {current.temperature_2m}
            </span>
            <span className="temperature-unit">°F</span>
          </div>

          <p className="current-weather-condition">
            {getWeatherDescription(current.weather_code)}
          </p>

          <p className="current-weather-label">
            Current conditions
          </p>
        </div>

        <div className="weather-metrics">
          <div className="weather-metric">
            <span className="weather-metric-icon">🌡️</span>
            <div>
              <span className="weather-metric-label">
                Feels like
              </span>
              <strong>
                {current.apparent_temperature}°F
              </strong>
            </div>
          </div>

          <div className="weather-metric">
            <span className="weather-metric-icon">💧</span>
            <div>
              <span className="weather-metric-label">
                Humidity
              </span>
              <strong>
                {current.relative_humidity_2m}%
              </strong>
            </div>
          </div>

          <div className="weather-metric">
            <span className="weather-metric-icon">💨</span>
            <div>
              <span className="weather-metric-label">
                Wind
              </span>
              <strong>
                {current.wind_speed_10m} mph
              </strong>
            </div>
          </div>

          <div className="weather-metric">
            <span className="weather-metric-icon">🌧️</span>
            <div>
              <span className="weather-metric-label">
                Precipitation
              </span>
              <strong>
                {current.precipitation} mm
              </strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}