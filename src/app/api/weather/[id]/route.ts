import {
  NextRequest,
  NextResponse
} from "next/server";

import {
  geocodeLocation,
  getWeather
} from "@/lib/weather";

import { supabase } from "@/lib/supabase";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {

  try {

    const { id } =
      await context.params;

    const body =
      await request.json();

    const {
      location,
      startDate,
      endDate
    } = body;

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

    const weather =
      await getWeather(
        locationResult.latitude,
        locationResult.longitude
      );

    const {
      data,
      error
    } = await supabase
      .from("weather_searches")
      .update({

        location_query:
          location,

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
          weather,

        updated_at:
          new Date().toISOString()

      })
      .eq("id", id)
      .select()
      .single();

    if (error) {

      console.error(error);

      return NextResponse.json(
        {
          error:
            "Unable to update the weather record."
        },
        {
          status: 500
        }
      );
    }

    return NextResponse.json({
      message:
        "Weather record updated successfully.",

      search:
        data
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Unable to update weather record."
      },
      {
        status: 500
      }
    );
  }
}
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {

  try {

    const { id } =
      await context.params;

    const {
      error
    } = await supabase
      .from("weather_searches")
      .delete()
      .eq("id", id);

    if (error) {

      console.error(error);

      return NextResponse.json(
        {
          error:
            "Unable to delete weather record."
        },
        {
          status: 500
        }
      );
    }

    return NextResponse.json({
      message:
        "Weather record deleted successfully."
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Unable to delete weather record."
      },
      {
        status: 500
      }
    );
  }
}