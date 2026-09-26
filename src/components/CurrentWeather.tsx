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
    <section>
      <div>
        <div>
          {getWeatherIcon(current.weather_code)}
        </div>

        <h2>
          {current.temperature_2m}°F
        </h2>

        <p>
          {getWeatherDescription(
            current.weather_code
          )}
        </p>
      </div>

      <div>
        <p>
          Feels like:{" "}
          {current.apparent_temperature}°F
        </p>

        <p>
          Humidity:{" "}
          {current.relative_humidity_2m}%
        </p>

        <p>
          Wind:{" "}
          {current.wind_speed_10m} mph
        </p>

        <p>
          Precipitation:{" "}
          {current.precipitation} mm
        </p>
      </div>
    </section>
  );
}