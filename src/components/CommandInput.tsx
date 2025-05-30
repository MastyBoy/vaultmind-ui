"use client";

import { useState } from "react";

type MemoryEntry = {
  timestamp: number;
  command: string;
  result: string;
};

type LogEntry = {
  timestamp: number;
  source: string;
  event: string;
  data: Record<string, unknown>;
};

type FeedbackEntry = {
  timestamp: number;
  command: string;
  result: string;
  rating: number;
  note: string;
};

export default function CommandInput() {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [memory, setMemory] = useState<MemoryEntry[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [summary, setSummary] = useState<any>(null);

  const [rating, setRating] = useState<number>(5);
  const [note, setNote] = useState<string>("");

  const [searchMemory, setSearchMemory] = useState("");
  const [logSource, setLogSource] = useState("");
  const [feedbackFilterNote, setFeedbackFilterNote] = useState("");

  const API = "https://vaultmind-backend.onrender.com";

  const handleExecute = async () => {
    const res = await fetch(`${API}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: command }),
    });
    const data = await res.json();
    setOutput(data.result);
  };

  const fetchMemory = async () => {
    const params = new URLSearchParams({
      limit: "100",
      offset: "0",
      search: searchMemory,
    });
    const res = await fetch(`${API}/memory?${params}`);
    const data = await res.json();
    setMemory(data);
  };

  const fetchLog = async () => {
    const params = new URLSearchParams({
      limit: "100",
      offset: "0",
    });
    if (logSource) params.append("source", logSource);
    const res = await fetch(`${API}/log?${params}`);
    const data = await res.json();
    setLogs(data);
  };

  const fetchFeedback = async () => {
    const params = new URLSearchParams({
      limit: "100",
    });
    if (feedbackFilterNote) params.append("note_contains", feedbackFilterNote);
    const res = await fetch(`${API}/feedback?${params}`);
    const data = await res.json();
    setFeedback(data);
  };

  const fetchFeedbackSummary = async () => {
    const res = await fetch(`${API}/feedback_summary`);
    const data = await res.json();
    setSummary(data);
  };

  const sendFeedback = async () => {
    const payload = {
      command,
      result: output || "",
      rating,
      note,
    };
    await fetch(`${API}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setNote("");
    alert("Feedback sent.");
  };

  return (
    <div className="p-4 space-y-4">
      <input
        className="w-full p-2 border border-gray-300 rounded"
        type="text"
        placeholder="Enter command"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
      />

      <div className="flex gap-4 flex-wrap">
        <button className="bg-black text-white px-4 py-2 rounded" onClick={handleExecute}>
          Execute
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={fetchMemory}>
          Load Memory
        </button>
        <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={fetchLog}>
          Fetch Log
        </button>
        <button className="bg-pink-600 text-white px-4 py-2 rounded" onClick={fetchFeedback}>
          Load Feedback
        </button>
        <button className="bg-yellow-600 text-white px-4 py-2 rounded" onClick={fetchFeedbackSummary}>
          Get Feedback Summary
        </button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <input
          className="p-2 border rounded"
          placeholder="Search memory"
          value={searchMemory}
          onChange={(e) => setSearchMemory(e.target.value)}
        />
        <input
          className="p-2 border rounded"
          placeholder="Filter logs by source"
          value={logSource}
          onChange={(e) => setLogSource(e.target.value)}
        />
        <input
          className="p-2 border rounded"
          placeholder="Filter feedback note"
          value={feedbackFilterNote}
          onChange={(e) => setFeedbackFilterNote(e.target.value)}
        />
      </div>

      {output && (
        <pre className="bg-gray-100 p-4 rounded border whitespace-pre-wrap text-sm">
          {output}
        </pre>
      )}

      {memory.length > 0 && (
        <div className="max-h-[300px] overflow-y-auto bg-white border p-4 rounded">
          <h3 className="font-bold mb-2">Memory Log</h3>
          <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(memory, null, 2)}</pre>
        </div>
      )}

      {logs.length > 0 && (
        <div className="max-h-[300px] overflow-y-auto bg-white border p-4 rounded">
          <h3 className="font-bold mb-2">System Logs</h3>
          <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(logs, null, 2)}</pre>
        </div>
      )}

      <div className="space-y-2 border-t pt-4">
        <h3 className="font-bold">Feedback</h3>
        <input
          type="number"
          min="1"
          max="10"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          className="w-20 p-2 border rounded"
        />
        <textarea
          placeholder="Optional note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={sendFeedback}
        >
          Send Feedback
        </button>
      </div>

      {feedback.length > 0 && (
        <div className="max-h-[300px] overflow-y-auto bg-white border p-4 rounded">
          <h3 className="font-bold mb-2">Feedback Records</h3>
          <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(feedback, null, 2)}</pre>
        </div>
      )}

      {summary && (
        <div className="bg-yellow-100 border p-4 rounded text-sm">
          <h3 className="font-bold mb-1">Feedback Summary</h3>
          <pre>{JSON.stringify(summary, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
