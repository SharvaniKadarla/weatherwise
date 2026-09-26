import { NextRequest, NextResponse } from "next/server";

import {
  geocodeLocation,
  getWeather
} from "@/lib/weather";

import { supabase } from "@/lib/supabase";

export async function POST(
  request: NextRequest
) {

  try {

    const body = await request.json();

    const {
      location,
      startDate,
      endDate
    } = body;

    // -------------------------
    // Validate required fields
    // -------------------------

    if (
      !location ||
      !startDate ||
      !endDate
    ) {

      return NextResponse.json(
        {
          error:
            "Location, start date, and end date are required."
        },
        {
          status: 400
        }
      );
    }

    // -------------------------
    // Validate dates
    // -------------------------

    const start =
      new Date(startDate);

    const end =
      new Date(endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {

      return NextResponse.json(
        {
          error:
            "Invalid date format."
        },
        {
          status: 400
        }
      );
    }

    if (end < start) {

      return NextResponse.json(
        {
          error:
            "End date must be on or after the start date."
        },
        {
          status: 400
        }
      );
    }

    // -------------------------
    // Validate location
    // -------------------------

    const locationResult =
      await geocodeLocation(location);

    if (!locationResult) {

      return NextResponse.json(
        {
          error:
            `Location "${location}" could not be found.`
        },
        {
          status: 404
        }
      );
    }

    // -------------------------
    // Get weather
    // -------------------------

    const weather =
      await getWeather(
        locationResult.latitude,
        locationResult.longitude
      );

    // -------------------------
    // Save to database
    // -------------------------

    const {
      data,
      error
    } = await supabase
      .from("weather_searches")
      .insert({
        location_query: location,

        location_name:
          locationResult.name,

        country:
          locationResult.country,

        latitude:
          locationResult.latitude,

        longitude:
          locationResult.longitude,

        start_date:
          startDate,

        end_date:
          endDate,

        weather_data:
          weather
      })
      .select()
      .single();

    if (error) {

      console.error(error);

      return NextResponse.json(
        {
          error:
            "Weather was retrieved but could not be saved."
        },
        {
          status: 500
        }
      );
    }

    return NextResponse.json(
      {
        message:
          "Weather retrieved successfully.",

        search:
          data
      },
      {
        status: 201
      }
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Unable to retrieve weather information."
      },
      {
        status: 500
      }
    );
  }
}

export async function GET() {

  try {

    const {
      data,
      error
    } = await supabase
      .from("weather_searches")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false
        }
      );

    if (error) {

      console.error(error);

      return NextResponse.json(
        {
          error:
            "Unable to retrieve saved searches."
        },
        {
          status: 500
        }
      );
    }

    return NextResponse.json({
      searches: data
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Unable to retrieve saved searches."
      },
      {
        status: 500
      }
    );
  }
}