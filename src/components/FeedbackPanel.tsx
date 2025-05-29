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

  const fetchFeedback = async () => {
    const res = await fetch("https://vaultmind-backend.onrender.com/feedback");
    const data = await res.json();
    setFeedback(data);
  };

  return (
    <div className="p-4 space-y-4">
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={fetchFeedback}
      >
        Load Feedback
      </button>

      {feedback.length > 0 && (
        <div className="max-h-[300px] overflow-y-auto bg-white border p-4 rounded">
          <h3 className="font-bold mb-2">User Feedback</h3>
          <pre className="text-sm whitespace-pre-wrap">
            {JSON.stringify(feedback, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
