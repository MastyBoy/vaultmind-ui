import CommandInput from "@/components/CommandInput";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <CommandInput />
    </main>
  );
}

import FeedbackPanel from "@/components/FeedbackPanel";

export default function Home() {
  return (
    <main className="min-h-screen p-8 space-y-8">
      <CommandInput />
      <FeedbackPanel />
    </main>
  );
}
