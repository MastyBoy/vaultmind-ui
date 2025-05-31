// src/components/CommandInput.tsx
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
  type?: string;
};

type SummaryEntry = {
  total_entries: number;
  average_rating: number;
  top_keywords: string[];
  rating_distribution: Record<string, number>;
};

export default function CommandInput() {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [memory, setMemory] = useState<MemoryEntry[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [summary, setSummary] = useState<SummaryEntry | null>(null);

  const [rating, setRating] = useState<number>(5);
  const [note, setNote] = useState<string>("");
  const [feedbackType, setFeedbackType] = useState("");

  const [searchMemory, setSearchMemory] = useState("");
  const [logSource, setLogSource] = useState("");
  const [feedbackFilterNote, setFeedbackFilterNote] = useState("");
  const [startDate, setStartDate] = useState("2025-05-30");
  const [endDate, setEndDate] = useState("2025-05-31");

  const API = "https://vaultmind-backend.onrender.com";

  const toUnix = (str: string) => Math.floor(new Date(str).getTime() / 1000);

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
      start_date: String(toUnix(startDate)),
      end_date: String(toUnix(endDate)),
    });
    const res = await fetch(`${API}/memory?${params}`);
    const data = await res.json();
    setMemory(data);
  };

  const fetchLog = async () => {
    const params = new URLSearchParams({
      limit: "100",
      offset: "0",
      start_date: String(toUnix(startDate)),
      end_date: String(toUnix(endDate)),
    });
    if (logSource) params.append("source", logSource);
    const res = await fetch(`${API}/log?${params}`);
    const data = await res.json();
    setLogs(data);
  };

  const fetchFeedback = async () => {
    const params = new URLSearchParams({
      limit: "100",
      start_date: String(toUnix(startDate)),
      end_date: String(toUnix(endDate)),
    });
    if (feedbackFilterNote) params.append("note_contains", feedbackFilterNote);
    if (feedbackType) params.append("type", feedbackType);
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
      type: feedbackType,
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

<div className="flex flex-wrap gap-2">
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

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
  <label className="flex flex-col text-sm">
    Start Date
    <input
      type="date"
      className="p-2 border rounded"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
    />
  </label>

  <label className="flex flex-col text-sm">
    End Date
    <input
      type="date"
      className="p-2 border rounded"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
    />
  </label>

  <label className="flex flex-col text-sm">
    Search Memory
    <input
      className="p-2 border rounded"
      placeholder="Keyword"
      value={searchMemory}
      onChange={(e) => setSearchMemory(e.target.value)}
    />
  </label>

  <label className="flex flex-col text-sm">
    Log Source
    <input
      className="p-2 border rounded"
      placeholder="e.g., ui/system"
      value={logSource}
      onChange={(e) => setLogSource(e.target.value)}
    />
  </label>

  <label className="flex flex-col text-sm">
    Feedback Note
    <input
      className="p-2 border rounded"
      placeholder="Contains keyword"
      value={feedbackFilterNote}
      onChange={(e) => setFeedbackFilterNote(e.target.value)}
    />
  </label>

  <label className="flex flex-col text-sm">
    Feedback Type
    <input
      className="p-2 border rounded"
      placeholder="bug / idea / review"
      value={feedbackType}
      onChange={(e) => setFeedbackType(e.target.value)}
    />
  </label>
</div>

  