export interface LocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  timezone?: string;
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
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

  // Always exactly the next 5 days
  daily: DailyWeather;

  // Weather for the user-selected date range
  date_range_daily: DailyWeather;
}

/*
 * Check whether the user entered GPS coordinates.
 *
 * Example:
 * 40.7128, -74.0060
 */
function parseCoordinates(
  query: string
): {
  latitude: number;
  longitude: number;
} | null {
  const parts = query
    .split(",")
    .map((part) => part.trim());

  if (parts.length !== 2) {
    return null;
  }

  const latitude = Number(parts[0]);
  const longitude = Number(parts[1]);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  if (
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return {
    latitude,
    longitude,
  };
}

async function reverseGeocodeCoordinates(
  latitude: number,
  longitude: number
): Promise<LocationResult> {
  const url =
    `https://nominatim.openstreetmap.org/reverse` +
    `?format=jsonv2` +
    `&lat=${latitude}` +
    `&lon=${longitude}` +
    `&zoom=10` +
    `&addressdetails=1` +
    `&accept-language=en`;

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "WeatherWise/1.0 (Weather and travel intelligence application)",
    },
  });

  if (!response.ok) {
    throw new Error(
      "Unable to determine the location name from the GPS coordinates."
    );
  }

  const data = await response.json();

  const address = data.address ?? {};

  const city =
    address.city ??
    address.town ??
    address.village ??
    address.municipality ??
    address.county ??
    "GPS Location";

  const state =
    address.state ?? "";

  const country =
    address.country ?? "";

  return {
    id: 0,
    name: city,
    latitude,
    longitude,
    country,
    admin1: state,
  };
}

export async function geocodeLocation(
  query: string
): Promise<LocationResult | null> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return null;
  }

  /*
   * GPS coordinates
   *
   * Example:
   * 40.7128, -74.0060
   */
  const coordinates =
  parseCoordinates(trimmedQuery);

if (coordinates) {
  return reverseGeocodeCoordinates(
    coordinates.latitude,
    coordinates.longitude
  );
}

  /*
   * Location search
   *
   * Open-Meteo supports city names and postal codes.
   * We request multiple results so that we can choose
   * the most appropriate match instead of blindly using
   * the first result.
   */
  const url =
    `https://geocoding-api.open-meteo.com/v1/search` +
    `?name=${encodeURIComponent(trimmedQuery)}` +
    `&count=10` +
    `&language=en` +
    `&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      "The location service is currently unavailable."
    );
  }

  const data = await response.json();

  if (
    !data.results ||
    data.results.length === 0
  ) {
    return null;
  }

  const results =
    data.results as LocationResult[];

  /*
   * Normalize text for comparison.
   *
   * This makes comparisons:
   * - case-insensitive
   * - whitespace-insensitive
   */
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");

  const normalizedQuery =
    normalize(trimmedQuery);

  /*
   * Extract a possible location name and qualifier.
   *
   * Examples:
   *
   * "Jersey City, NJ"
   * → location = "jersey city"
   * → qualifier = "nj"
   *
   * "Los Angeles, California"
   * → location = "los angeles"
   * → qualifier = "california"
   */
  const queryParts =
    trimmedQuery
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

  const locationPart =
    normalize(queryParts[0] ?? "");

  const qualifierPart =
    normalize(queryParts[1] ?? "");

  /*
   * Score each candidate.
   *
   * Higher score = better match.
   */
  function scoreResult(
    result: LocationResult
  ): number {
    const name =
      normalize(result.name);

    const admin1 =
      normalize(result.admin1 ?? "");

    const country =
      normalize(result.country ?? "");

    let score = 0;

    /*
     * Exact location-name match.
     */
    if (
      name === normalizedQuery ||
      name === locationPart
    ) {
      score += 100;
    }

    /*
     * Location name starts with the query.
     */
    if (
      locationPart &&
      name.startsWith(locationPart)
    ) {
      score += 40;
    }

    /*
     * Query is contained in the location name.
     */
    if (
      locationPart &&
      name.includes(locationPart)
    ) {
      score += 20;
    }

    /*
     * State / administrative-area match.
     */
    if (
      qualifierPart &&
      admin1 === qualifierPart
    ) {
      score += 60;
    }

    /*
     * Country match.
     */
    if (
      qualifierPart &&
      country === qualifierPart
    ) {
      score += 60;
    }

    /*
     * If the query contains the result's state.
     */
    if (
      qualifierPart &&
      admin1.includes(qualifierPart)
    ) {
      score += 30;
    }

    /*
     * Prefer results with a known country.
     */
    if (country) {
      score += 5;
    }

    return score;
  }

  /*
   * Choose the highest-scoring result.
   */
  const bestResult =
    [...results].sort(
      (a, b) =>
        scoreResult(b) -
        scoreResult(a)
    )[0];

  return bestResult ?? null;
}

/*
 * Get the current weather and the next 5 days.
 */
async function getFiveDayForecast(
  latitude: number,
  longitude: number
): Promise<DailyWeather> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
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
      "The 5-day forecast service is currently unavailable."
    );
  }

  const data = await response.json();

  return {
    time: data.daily.time,
    weather_code:
      data.daily.weather_code,
    temperature_2m_max:
      data.daily.temperature_2m_max,
    temperature_2m_min:
      data.daily.temperature_2m_min,
    precipitation_probability_max:
      data.daily.precipitation_probability_max,
    wind_speed_10m_max:
      data.daily.wind_speed_10m_max,
  };
}

/*
 * Get weather for a specific date range.
 */
async function getDateRangeWeather(
  latitude: number,
  longitude: number,
  startDate: string,
  endDate: string
): Promise<DailyWeather> {
  const start =
    new Date(`${startDate}T00:00:00`);

  const end =
    new Date(`${endDate}T00:00:00`);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    throw new Error(
      "Invalid weather date range."
    );
  }

  if (end < start) {
    throw new Error(
      "End date must be on or after the start date."
    );
  }

  /*
   * Calculate the number of requested days.
   */
  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  const requestedDays =
    Math.floor(
      (end.getTime() - start.getTime()) /
        millisecondsPerDay
    ) + 1;

  if (requestedDays > 16) {
    throw new Error(
      "The selected future weather range cannot exceed 16 days."
    );
  }

  /*
   * Today's date.
   */
  const today =
    new Date();

  const todayString =
    today.toISOString().split("T")[0];

  const todayDate =
    new Date(`${todayString}T00:00:00`);

  /*
   * Entirely historical range.
   */
  if (end < todayDate) {
    const url =
      `https://archive-api.open-meteo.com/v1/archive` +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&start_date=${startDate}` +
      `&end_date=${endDate}` +
      `&daily=` +
      `weather_code,` +
      `temperature_2m_max,` +
      `temperature_2m_min,` +
      `wind_speed_10m_max` +
      `&temperature_unit=fahrenheit` +
      `&wind_speed_unit=mph` +
      `&timezone=auto`;

    const response =
      await fetch(url);

    if (!response.ok) {
      throw new Error(
        "Historical weather data is currently unavailable."
      );
    }

    const data =
      await response.json();

    return {
      time: data.daily.time,

      weather_code:
        data.daily.weather_code,

      temperature_2m_max:
        data.daily.temperature_2m_max,

      temperature_2m_min:
        data.daily.temperature_2m_min,

      /*
       * Historical data does not provide
       * precipitation probability.
       */
      precipitation_probability_max:
        data.daily.time.map(() => 0),

      wind_speed_10m_max:
        data.daily.wind_speed_10m_max,
    };
  }

  /*
   * Current or future range.
   *
   * Open-Meteo forecast supports the requested
   * start and end dates.
   */
  const forecastStart =
    start < todayDate
      ? todayString
      : startDate;

  const forecastStartDate =
    new Date(
      `${forecastStart}T00:00:00`
    );

  const forecastDays =
    Math.floor(
      (end.getTime() -
        forecastStartDate.getTime()) /
        millisecondsPerDay
    ) + 1;

  if (forecastDays > 16) {
    throw new Error(
      "The selected future weather range cannot exceed 16 days."
    );
  }

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&start_date=${forecastStart}` +
    `&end_date=${endDate}` +
    `&daily=` +
    `weather_code,` +
    `temperature_2m_max,` +
    `temperature_2m_min,` +
    `precipitation_probability_max,` +
    `wind_speed_10m_max` +
    `&temperature_unit=fahrenheit` +
    `&wind_speed_unit=mph` +
    `&timezone=auto`;

  const response =
    await fetch(url);

  if (!response.ok) {
    throw new Error(
      "Forecast weather data is currently unavailable."
    );
  }

  const data =
    await response.json();

  return {
    time: data.daily.time,

    weather_code:
      data.daily.weather_code,

    temperature_2m_max:
      data.daily.temperature_2m_max,

    temperature_2m_min:
      data.daily.temperature_2m_min,

    precipitation_probability_max:
      data.daily.precipitation_probability_max,

    wind_speed_10m_max:
      data.daily.wind_speed_10m_max,
  };
}

/*
 * Main weather function.
 *
 * Returns:
 * 1. Current weather
 * 2. Always 5-day forecast
 * 3. User-selected date range weather
 */
export async function getWeather(
  latitude: number,
  longitude: number,
  startDate: string,
  endDate: string
): Promise<WeatherResult> {
  /*
   * Current weather
   */
  const currentUrl =
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
    `&temperature_unit=fahrenheit` +
    `&wind_speed_unit=mph` +
    `&timezone=auto`;

  const currentResponse =
    await fetch(currentUrl);

  if (!currentResponse.ok) {
    throw new Error(
      "The current weather service is currently unavailable."
    );
  }

  const currentData =
    await currentResponse.json();

  /*
   * Always get a separate 5-day forecast.
   */
  const fiveDayForecast =
    await getFiveDayForecast(
      latitude,
      longitude
    );

  /*
   * Get the user's requested date range.
   */
  const dateRangeWeather =
    await getDateRangeWeather(
      latitude,
      longitude,
      startDate,
      endDate
    );

  return {
    latitude:
      currentData.latitude,

    longitude:
      currentData.longitude,

    timezone:
      currentData.timezone,

    current: {
      temperature_2m:
        currentData.current.temperature_2m,

      apparent_temperature:
        currentData.current
          .apparent_temperature,

      relative_humidity_2m:
        currentData.current
          .relative_humidity_2m,

      precipitation:
        currentData.current.precipitation,

      weather_code:
        currentData.current.weather_code,

      wind_speed_10m:
        currentData.current.wind_speed_10m,
    },

    /*
     * Always exactly 5 days.
     */
    daily:
      fiveDayForecast,

    /*
     * Exactly the requested range.
     */
    date_range_daily:
      dateRangeWeather,
  };
}