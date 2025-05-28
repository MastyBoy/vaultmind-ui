"use client";

import { useState } from "react";

export default function CommandInput() {
  const [command, setCommand] = useState("");
  const [output, setOutput] = useState<string | null>(null);

  const handleExecute = async () => {
    const response = await fetch("https://vaultmind-backend.onrender.com/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: command }),
    });
    const data = await response.json();
    setOutput(data.result);
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
      <button
        className="bg-black text-white px-4 py-2 rounded"
        onClick={handleExecute}
      >
        Execute
      </button>
      {output && (
        <pre className="bg-gray-100 p-4 rounded border">{output}</pre>
      )}
    </div>
  );
}
