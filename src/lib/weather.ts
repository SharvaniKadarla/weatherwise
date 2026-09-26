export interface LocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  timezone?: string;
}

export interface WeatherResult {
  latitude: number;
  longitude: number;
  timezone: string;

  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };

  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
  };
}

export async function geocodeLocation(
  query: string
): Promise<LocationResult | null> {

  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return null;
  }

  const url =
    `https://geocoding-api.open-meteo.com/v1/search` +
    `?name=${encodeURIComponent(trimmedQuery)}` +
    `&count=5` +
    `&language=en` +
    `&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      "The location service is currently unavailable."
    );
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    return null;
  }

  return data.results[0];
}

export async function getWeather(
  latitude: number,
  longitude: number
): Promise<WeatherResult> {

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=` +
    `temperature_2m,` +
    `apparent_temperature,` +
    `relative_humidity_2m,` +
    `precipitation,` +
    `weather_code,` +
    `wind_speed_10m` +
    `&daily=` +
    `weather_code,` +
    `temperature_2m_max,` +
    `temperature_2m_min,` +
    `precipitation_probability_max,` +
    `wind_speed_10m_max` +
    `&forecast_days=5` +
    `&temperature_unit=fahrenheit` +
    `&wind_speed_unit=mph` +
    `&timezone=auto`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      "The weather service is currently unavailable."
    );
  }

  return response.json();
}