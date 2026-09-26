export function getWeatherDescription(
  code: number
): string {

  switch (code) {
    case 0:
      return "Clear sky";

    case 1:
      return "Mainly clear";

    case 2:
      return "Partly cloudy";

    case 3:
      return "Overcast";

    case 45:
    case 48:
      return "Fog";

    case 51:
    case 53:
    case 55:
      return "Drizzle";

    case 61:
    case 63:
    case 65:
      return "Rain";

    case 71:
    case 73:
    case 75:
      return "Snow";

    case 80:
    case 81:
    case 82:
      return "Rain showers";

    case 95:
      return "Thunderstorm";

    case 96:
    case 99:
      return "Thunderstorm with hail";

    default:
      return "Unknown";
  }
}

export function getWeatherIcon(code: number): string {

  if (code === 0) return "☀️";

  if ([1, 2].includes(code)) {
    return "🌤️";
  }

  if (code === 3) {
    return "☁️";
  }

  if ([45, 48].includes(code)) {
    return "🌫️";
  }

  if ([51, 53, 55].includes(code)) {
    return "🌦️";
  }

  if ([61, 63, 65, 80, 81, 82].includes(code)) {
    return "🌧️";
  }

  if ([71, 73, 75].includes(code)) {
    return "❄️";
  }

  if ([95, 96, 99].includes(code)) {
    return "⛈️";
  }

  return "🌡️";
}