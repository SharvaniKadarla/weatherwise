"use client";

import { useEffect, useState } from "react";

interface SavedSearch {
  id: string;
  location_query: string;
  location_name: string;
  country: string | null;
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
  weather_data: unknown;
  created_at: string;
  updated_at: string;
}

interface SavedSearchesResponse {
  searches: SavedSearch[];
  error?: string;
}

export default function SavedSearches() {
  const [searches, setSearches] =
    useState<SavedSearch[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [editLocation, setEditLocation] =
    useState("");

  const [editStartDate, setEditStartDate] =
    useState("");

  const [editEndDate, setEditEndDate] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchSearches() {
      try {
        const response = await fetch(
          "/api/weather"
        );

        const data =
          (await response.json()) as SavedSearchesResponse;

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to retrieve saved searches."
          );
        }

        if (!cancelled) {
          setSearches(
            data.searches ?? []
          );

          setLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to retrieve saved searches."
          );

          setLoading(false);
        }
      }
    }

    fetchSearches();

    return () => {
      cancelled = true;
    };
  }, []);

  function formatDate(
    dateString: string
  ): string {
    const date = new Date(
      `${dateString}T00:00:00`
    );

    return date.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  }

  function startEditing(
    search: SavedSearch
  ) {
    setError("");
    setEditingId(search.id);

    setEditLocation(
      search.location_query
    );

    setEditStartDate(
      search.start_date
    );

    setEditEndDate(
      search.end_date
    );
  }

  function cancelEditing() {
    setEditingId(null);
    setEditLocation("");
    setEditStartDate("");
    setEditEndDate("");
  }

  async function saveEdit(
    id: string
  ) {
    setError("");

    if (!editLocation.trim()) {
      setError(
        "Please enter a location."
      );
      return;
    }

    if (
      !editStartDate ||
      !editEndDate
    ) {
      setError(
        "Please select both dates."
      );
      return;
    }

    if (
      editEndDate < editStartDate
    ) {
      setError(
        "End date must be on or after the start date."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/weather/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            location:
              editLocation.trim(),
            startDate:
              editStartDate,
            endDate:
              editEndDate,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to update the saved search."
        );
      }

      setSearches(
        (currentSearches) =>
          currentSearches.map(
            (search) =>
              search.id === id
                ? data.search
                : search
          )
      );

      cancelEditing();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update the saved search."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteSearch(
    search: SavedSearch
  ) {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete the saved search for ${search.location_name}?`
      );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeletingId(search.id);

    try {
      const response = await fetch(
        `/api/weather/${search.id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to delete the saved search."
        );
      }

      setSearches(
        (currentSearches) =>
          currentSearches.filter(
            (currentSearch) =>
              currentSearch.id !==
              search.id
          )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete the saved search."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="saved-searches">
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">
            YOUR HISTORY
          </span>

          <h2>Saved Searches</h2>

          <p>
            Quickly access locations and trip dates
            you have searched before.
          </p>
        </div>

        {searches.length > 0 && (
          <div className="saved-count">
            {searches.length}{" "}
            {searches.length === 1
              ? "search"
              : "searches"}
          </div>
        )}
      </div>

      {loading && (
        <div className="component-status">
          <span className="status-spinner" />
          <span>Loading saved searches...</span>
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
        searches.length === 0 && (
          <div className="empty-state">
            <span className="empty-state-icon">
              📌
            </span>

            <h3>No saved searches yet</h3>

            <p>
              Your weather searches will appear here
              for quick access later.
            </p>
          </div>
        )}

      {!loading &&
        searches.length > 0 && (
          <div className="saved-searches-grid">
            {searches.map((search) => (
              <article
                className="saved-search-card"
                key={search.id}
              >
                {editingId ===
                search.id ? (
                  <div className="saved-edit-form">
                    <div className="saved-edit-header">
                      <span className="saved-edit-icon">
                        ✏️
                      </span>

                      <div>
                        <h3>
                          Edit Weather Search
                        </h3>

                        <p>
                          Update the destination or
                          trip dates.
                        </p>
                      </div>
                    </div>

                    <div className="saved-form-field">
                      <label
                        htmlFor={`location-${search.id}`}
                      >
                        Location
                      </label>

                      <input
                        id={`location-${search.id}`}
                        type="text"
                        value={editLocation}
                        onChange={(e) =>
                          setEditLocation(
                            e.target.value
                          )
                        }
                        placeholder="Enter city or ZIP code"
                      />
                    </div>

                    <div className="saved-date-fields">
                      <div className="saved-form-field">
                        <label
                          htmlFor={`start-${search.id}`}
                        >
                          Start Date
                        </label>

                        <input
                          id={`start-${search.id}`}
                          type="date"
                          value={
                            editStartDate
                          }
                          onChange={(e) =>
                            setEditStartDate(
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="saved-form-field">
                        <label
                          htmlFor={`end-${search.id}`}
                        >
                          End Date
                        </label>

                        <input
                          id={`end-${search.id}`}
                          type="date"
                          value={
                            editEndDate
                          }
                          onChange={(e) =>
                            setEditEndDate(
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="saved-form-actions">
                      <button
                        type="button"
                        className="button-primary small-button"
                        onClick={() =>
                          saveEdit(
                            search.id
                          )
                        }
                        disabled={saving}
                      >
                        {saving
                          ? "Saving..."
                          : "Save Changes"}
                      </button>

                      <button
                        type="button"
                        className="button-secondary small-button"
                        onClick={
                          cancelEditing
                        }
                        disabled={saving}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="saved-search-content">
                    <div className="saved-search-location">
                      <div className="saved-location-icon">
                        📍
                      </div>

                      <div>
                        <h3>
                          {
                            search.location_name
                          }
                        </h3>

                        {search.country && (
                          <p>
                            {
                              search.country
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="saved-search-dates">
                      <span className="saved-date-icon">
                        📅
                      </span>

                      <div>
                        <span>
                          Trip dates
                        </span>

                        <strong>
                          {formatDate(
                            search.start_date
                          )}{" "}
                          –{" "}
                          {formatDate(
                            search.end_date
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className="saved-search-actions">
                      <button
                        type="button"
                        className="button-secondary small-button"
                        onClick={() =>
                          startEditing(
                            search
                          )
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        className="button-danger small-button"
                        onClick={() =>
                          deleteSearch(
                            search
                          )
                        }
                        disabled={
                          deletingId ===
                          search.id
                        }
                      >
                        {deletingId ===
                        search.id
                          ? "Deleting..."
                          : "🗑️ Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
    </section>
  );
}