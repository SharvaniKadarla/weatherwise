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
  const [videos, setVideos] =
    useState<Video[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/youtube?q=${encodeURIComponent(
            location
          )}`
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
    <section className="travel-videos-section">
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">
            EXPLORE THE DESTINATION
          </span>

          <h2>Travel Videos</h2>

          <p>
            Explore videos and travel inspiration
            for {location}.
          </p>
        </div>
      </div>

      {loading && (
        <div className="component-status">
          <span className="status-spinner" />
          <span>Finding travel videos...</span>
        </div>
      )}

      {error && (
        <div className="component-error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {!loading &&
        !error &&
        videos.length === 0 && (
          <div className="empty-state">
            <span className="empty-state-icon">
              🎬
            </span>

            <h3>No travel videos found</h3>

            <p> We could not find travel videos for this destination right now. </p>
          </div>
        )}

      {!loading &&
        !error &&
        videos.length > 0 && (
          <div className="video-grid">
            {videos.map((video) => (
              <article
                className="video-card"
                key={video.videoId}
              >
                <div className="video-image-wrapper">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    width={640}
                    height={360}
                    className="video-image"
                  />

                  <div className="video-play-badge">
                    ▶
                  </div>
                </div>

                <div className="video-content">
                  <h3>{video.title}</h3>

                  <p>{video.description}</p>

                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-link"
                  >
                    Watch on YouTube
                    <span aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
    </section>
  );
}