"use client";

interface WeatherInsightsData {
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
  };
}

interface Props {
  weather: WeatherInsightsData;
}

export default function WeatherInsights({
  weather,
}: Props) {
  const current = weather.current;
  const daily = weather.daily;

  const rainProbability =
    daily.precipitation_probability_max.length > 0
      ? Math.max(
          ...daily.precipitation_probability_max
        )
      : 0;

  const insights: string[] = [];

  if (rainProbability >= 70) {
    insights.push(
      `🌧️ High chance of rain. The forecast reaches ${rainProbability}% precipitation probability, so consider carrying an umbrella or rain jacket.`
    );
  } else if (rainProbability >= 40) {
    insights.push(
      `🌦️ Moderate chance of rain. The forecast reaches ${rainProbability}% precipitation probability, so it may be useful to carry light rain protection.`
    );
  } else {
    insights.push(
      `☀️ Low chance of rain. The forecast's highest precipitation probability is ${rainProbability}%.`
    );
  }

  if (current.wind_speed_10m >= 25) {
    insights.push(
      `💨 Strong winds expected. Current wind speed is ${current.wind_speed_10m} mph, so outdoor activities may feel more challenging.`
    );
  } else if (current.wind_speed_10m >= 15) {
    insights.push(
      `💨 Noticeable winds. Current wind speed is ${current.wind_speed_10m} mph, so consider the wind when planning outdoor activities.`
    );
  } else {
    insights.push(
      `🍃 Light winds. Current wind speed is ${current.wind_speed_10m} mph.`
    );
  }

  if (current.temperature_2m <= 40) {
    insights.push(
      `🧥 Cold conditions expected. The current temperature is ${current.temperature_2m}°F, so warm clothing is recommended.`
    );
  } else if (current.temperature_2m <= 55) {
    insights.push(
      `🧥 Cool conditions. The current temperature is ${current.temperature_2m}°F, so a light jacket may be useful.`
    );
  } else if (current.temperature_2m >= 85) {
    insights.push(
      `🧴 Hot conditions expected. The current temperature is ${current.temperature_2m}°F, so stay hydrated and consider sun protection.`
    );
  } else {
    insights.push(
      `🌡️ Comfortable temperature range. The current temperature is ${current.temperature_2m}°F.`
    );
  }

  if (current.precipitation > 0) {
    insights.push(
      `☔ Precipitation is currently ${current.precipitation} mm, so outdoor plans may be affected by wet conditions.`
    );
  } else {
    insights.push(
      `🌤️ No measurable precipitation is currently reported.`
    );
  }

  if (current.relative_humidity_2m >= 80) {
    insights.push(
      `💧 High humidity. Current humidity is ${current.relative_humidity_2m}%, which may make the weather feel more uncomfortable.`
    );
  }

  return (
    <section>
      <h2>Travel Insights</h2>

      <p>
        Helpful travel considerations based on the
        current weather and forecast.
      </p>

      <div>
        {insights.map(
          (insight: string, index: number) => (
            <div key={index}>
              <p>{insight}</p>
            </div>
          )
        )}
      </div>
    </section>
  );
}