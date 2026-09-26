import { NextRequest, NextResponse } from "next/server";

interface YouTubeSearchItem {
  id: {
    videoId?: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium?: {
        url: string;
      };
    };
  };
}

export async function GET(
  request: NextRequest
) {
  try {
    const query =
      request.nextUrl.searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        {
          error: "Please provide a location.",
        },
        {
          status: 400,
        }
      );
    }

    const apiKey =
      process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "YouTube API key is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const url = new URL(
      "https://www.googleapis.com/youtube/v3/search"
    );

    url.searchParams.set(
      "part",
      "snippet"
    );

    url.searchParams.set(
      "q",
      `${query} travel guide things to do`
    );

    url.searchParams.set(
      "type",
      "video"
    );

    url.searchParams.set(
      "maxResults",
      "5"
    );

    url.searchParams.set(
      "key",
      apiKey
    );

    const response = await fetch(
      url.toString()
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "YouTube API error:",
        data
      );

      return NextResponse.json(
        {
          error:
            "Unable to retrieve YouTube videos.",
        },
        {
          status: response.status,
        }
      );
    }

    const videos =
      (data.items as YouTubeSearchItem[] | undefined)
        ?.filter(
          (item) => item.id.videoId
        )
        .map((item) => ({
          videoId: item.id.videoId as string,
          title: item.snippet.title,
          description:
            item.snippet.description,
          thumbnail:
            item.snippet.thumbnails.medium?.url ??
            "",
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        })) ?? [];

    return NextResponse.json({
      videos,
    });
  } catch (error) {
    console.error(
      "YouTube route error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while retrieving YouTube videos.",
      },
      {
        status: 500,
      }
    );
  }
}