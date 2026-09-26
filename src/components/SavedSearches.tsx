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
    <section>
      <h2>Saved Searches</h2>

      {loading && (
        <p>
          Loading saved searches...
        </p>
      )}

      {error && (
        <p>
          ❌ {error}
        </p>
      )}

      {!loading &&
        !error &&
        searches.length === 0 && (
          <p>
            No saved searches yet.
          </p>
        )}

      {!loading &&
        searches.length > 0 && (
          <div>
            {searches.map(
              (search) => (
                <article
                  key={search.id}
                >
                  {editingId ===
                  search.id ? (
                    <div>
                      <h3>
                        Edit Weather Search
                      </h3>

                      <div>
                        <label
                          htmlFor={`location-${search.id}`}
                        >
                          Location
                        </label>

                        <input
                          id={`location-${search.id}`}
                          type="text"
                          value={
                            editLocation
                          }
                          onChange={(e) =>
                            setEditLocation(
                              e.target.value
                            )
                          }
                          placeholder="Enter city or ZIP code"
                        />
                      </div>

                      <div>
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

                      <div>
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

                      <div>
                        <button
                          type="button"
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

                      <p>
                        {formatDate(
                          search.start_date
                        )}{" "}
                        –{" "}
                        {formatDate(
                          search.end_date
                        )}
                      </p>

                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            startEditing(
                              search
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
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
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              )
            )}
          </div>
        )}
    </section>
  );
}