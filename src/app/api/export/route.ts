import { NextRequest, NextResponse } from "next/server";

function escapeCsvValue(value: unknown): string {
  const text = String(value ?? "");

  if (
    text.includes(",") ||
    text.includes('"') ||
    text.includes("\n")
  ) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const {
      format,
      location,
      country,
      startDate,
      endDate,
      weatherData,
    } = body;

    if (!format) {
      return NextResponse.json(
        {
          error: "Export format is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!["json", "csv"].includes(format)) {
      return NextResponse.json(
        {
          error:
            "Unsupported export format. Use json or csv.",
        },
        {
          status: 400,
        }
      );
    }

    if (!weatherData) {
      return NextResponse.json(
        {
          error:
            "Weather data is required for export.",
        },
        {
          status: 400,
        }
      );
    }

    if (format === "json") {
      const exportData = {
        location,
        country,
        startDate,
        endDate,
        weather: weatherData,
      };

      return new NextResponse(
        JSON.stringify(exportData, null, 2),
        {
          status: 200,
          headers: {
            "Content-Type":
              "application/json",
            "Content-Disposition":
              `attachment; filename="weatherwise-${location}.json"`,
          },
        }
      );
    }

    const rows: string[][] = [];

    rows.push([
      "Location",
      "Country",
      "Date",
      "Weather",
      "High Temperature (°F)",
      "Low Temperature (°F)",
      "Precipitation Probability (%)",
    ]);

    const daily = weatherData.daily;

    for (
      let index = 0;
      index < daily.time.length;
      index++
    ) {
      rows.push([
        location ?? "",
        country ?? "",
        daily.time[index] ?? "",
        String(
          daily.weather_code[index] ?? ""
        ),
        String(
          daily.temperature_2m_max[index] ?? ""
        ),
        String(
          daily.temperature_2m_min[index] ?? ""
        ),
        String(
          daily
            .precipitation_probability_max[
            index
          ] ?? ""
        ),
      ]);
    }

    const csv = rows
      .map((row) =>
        row
          .map(escapeCsvValue)
          .join(",")
      )
      .join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition":
          `attachment; filename="weatherwise-${location}.csv"`,
      },
    });
  } catch (error) {
    console.error(
      "Export error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to export weather data.",
      },
      {
        status: 500,
      }
    );
  }
}