"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Video {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
}

interface YouTubeResponse {
  videos: Video[];
  error?: string;
}

interface Props {
  location: string;
}

export default function YouTubeVideos({
  location,
}: Props) {
  const [videos, setVideos] = useState<Video[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/youtube?q=${encodeURIComponent(location)}`
        );

        const data =
          (await response.json()) as YouTubeResponse;

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to retrieve YouTube videos."
          );
        }

        setVideos(data.videos);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to retrieve YouTube videos."
        );
      } finally {
        setLoading(false);
      }
    }

    if (location.trim()) {
      fetchVideos();
    }
  }, [location]);

  return (
    <section>
      <h2>Travel Videos</h2>

      <p>
        Explore videos about {location}
      </p>

      {loading && (
        <p>Loading travel videos...</p>
      )}

      {error && (
        <p>❌ {error}</p>
      )}

      {!loading &&
        !error &&
        videos.length === 0 && (
          <p>
            No travel videos found.
          </p>
        )}

      {!loading &&
        !error &&
        videos.length > 0 && (
          <div>
            {videos.map((video) => (
              <article key={video.videoId}>
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  width={320}
                  height={180}
                />

                <h3>{video.title}</h3>

                <p>{video.description}</p>

                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch on YouTube
                </a>
              </article>
            ))}
          </div>
        )}
    </section>
  );
}