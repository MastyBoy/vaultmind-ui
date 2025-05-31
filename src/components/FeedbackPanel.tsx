"use client";

import { useState } from "react";

type FeedbackEntry = {
  timestamp: number;
  command: string;
  result: string;
  rating: number;
  note?: string;
};

export default function FeedbackPanel() {
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number | "">("");
  const [noteSearch, setNoteSearch] = useState("");
  const [limit, setLimit] = useState<number | "">("");

  const fetchFilteredFeedback = async () => {
    const params = new URLSearchParams();
    if (ratingFilter !== "") params.append("rating", ratingFilter.toString());
    if (noteSearch) params.append("note_contains", noteSearch);
    if (limit !== "") params.append("limit", limit.toString());

    const res = await fetch(`https://vaultmind-backend.onrender.com/feedback?${params.toString()}`);
    const data = await res.json();
    setFeedback(data);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2 flex-wrap">
        <input
          type="number"
          placeholder="Rating"
          className="p-2 border rounded w-24"
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value ? parseInt(e.target.value) : "")}
        />
        <input
          type="text"
          placeholder="Note contains"
          className="p-2 border rounded"
          value={noteSearch}
          onChange={(e) => setNoteSearch(e.target.value)}
        />
        <input
          type="number"
          placeholder="Limit"
          className="p-2 border rounded w-24"
          value={limit}
          onChange={(e) => setLimit(e.target.value ? parseInt(e.target.value) : "")}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={fetchFilteredFeedback}
        >
          Load Feedback
        </button>
      </div>

      {feedback.length > 0 && (
        <div className="max-h-[300px] overflow-y-auto bg-white border p-4 rounded">
          <h3 className="font-bold mb-2">Filtered Feedback</h3>
          <pre className="text-sm whitespace-pre-wrap">
            {JSON.stringify(feedback, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
