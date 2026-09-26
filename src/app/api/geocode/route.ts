import { NextRequest, NextResponse } from "next/server";
import { geocodeLocation } from "@/lib/weather";

export async function GET(
  request: NextRequest
) {

  try {

    const query =
      request.nextUrl.searchParams.get("q");

    if (!query || query.trim().length < 2) {

      return NextResponse.json(
        {
          error:
            "Please enter a valid location."
        },
        {
          status: 400
        }
      );
    }

    const location =
      await geocodeLocation(query);

    if (!location) {

      return NextResponse.json(
        {
          error:
            "Location not found."
        },
        {
          status: 404
        }
      );
    }

    return NextResponse.json({
      location
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Unable to search for this location."
      },
      {
        status: 500
      }
    );
  }
}