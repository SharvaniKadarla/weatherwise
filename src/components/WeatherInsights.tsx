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

interface Insight {
  icon: string;
  title: string;
  message: string;
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

  const insights: Insight[] = [];

  if (rainProbability >= 70) {
    insights.push({
      icon: "🌧️",
      title: "Rain Alert",
      message:
        `The forecast reaches ${rainProbability}% precipitation probability. Consider carrying an umbrella or rain jacket.`,
    });
  } else if (rainProbability >= 40) {
    insights.push({
      icon: "🌦️",
      title: "Possible Rain",
      message:
        `The forecast reaches ${rainProbability}% precipitation probability. Light rain protection may be useful.`,
    });
  } else {
    insights.push({
      icon: "☀️",
      title: "Low Rain Risk",
      message:
        `The forecast's highest precipitation probability is ${rainProbability}%.`,
    });
  }

  if (current.wind_speed_10m >= 25) {
    insights.push({
      icon: "💨",
      title: "Strong Winds",
      message:
        `Current wind speed is ${current.wind_speed_10m} mph. Outdoor activities may feel more challenging.`,
    });
  } else if (current.wind_speed_10m >= 15) {
    insights.push({
      icon: "💨",
      title: "Noticeable Winds",
      message:
        `Current wind speed is ${current.wind_speed_10m} mph. Consider wind conditions when planning outdoor activities.`,
    });
  } else {
    insights.push({
      icon: "🍃",
      title: "Light Winds",
      message:
        `Current wind speed is ${current.wind_speed_10m} mph.`,
    });
  }

  if (current.temperature_2m <= 40) {
    insights.push({
      icon: "🧥",
      title: "Cold Conditions",
      message:
        `The current temperature is ${current.temperature_2m}°F. Warm clothing is recommended.`,
    });
  } else if (current.temperature_2m <= 55) {
    insights.push({
      icon: "🧥",
      title: "Cool Conditions",
      message:
        `The current temperature is ${current.temperature_2m}°F. A light jacket may be useful.`,
    });
  } else if (current.temperature_2m >= 85) {
    insights.push({
      icon: "🧴",
      title: "Hot Conditions",
      message:
        `The current temperature is ${current.temperature_2m}°F. Stay hydrated and consider sun protection.`,
    });
  } else {
    insights.push({
      icon: "🌡️",
      title: "Comfortable Temperature",
      message:
        `The current temperature is ${current.temperature_2m}°F.`,
    });
  }

  if (current.precipitation > 0) {
    insights.push({
      icon: "☔",
      title: "Current Precipitation",
      message:
        `Precipitation is currently ${current.precipitation} mm. Outdoor plans may be affected by wet conditions.`,
    });
  } else {
    insights.push({
      icon: "🌤️",
      title: "Currently Dry",
      message:
        "No measurable precipitation is currently reported.",
    });
  }

  if (current.relative_humidity_2m >= 80) {
    insights.push({
      icon: "💧",
      title: "High Humidity",
      message:
        `Current humidity is ${current.relative_humidity_2m}%, which may make conditions feel less comfortable.`,
    });
  }

  return (
    <section className="insights-section">
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">
            SMART ANALYSIS
          </span>

          <h2>Travel Insights</h2>

          <p>
            Helpful travel considerations based on
            the current weather and forecast.
          </p>
        </div>
      </div>

      <div className="insights-grid">
        {insights.map(
          (insight, index) => (
            <article
              className="insight-card"
              key={`${insight.title}-${index}`}
            >
              <div className="insight-icon">
                {insight.icon}
              </div>

              <div className="insight-content">
                <h3>{insight.title}</h3>

                <p>{insight.message}</p>
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
}