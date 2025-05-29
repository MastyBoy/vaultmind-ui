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
  data: Record<string, any>;
};

export default function CommandInputV2() {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [memory, setMemory] = useState<MemoryEntry[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const handleExecute = async () => {
    const response = await fetch("https://vaultmind-backend.onrender.com/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: command }),
    });
    const data = await response.json();
    setOutput(data.result);
  };

  const fetchMemory = async () => {
    const res = await fetch("https://vaultmind-backend.onrender.com/memory");
    const data = await res.json();
    setMemory(data);
  };

  const fetchLog = async () => {
    const res = await fetch("https://vaultmind-backend.onrender.com/log");
    const data = await res.json();
    setLogs(data);
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
    </div>
  );
}
