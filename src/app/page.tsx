import CommandInput from "@/components/CommandInput";
import FeedbackPanel from "@/components/FeedbackPanel";

export default function Home() {
  return (
    <main className="min-h-screen p-8 space-y-8 bg-white">
      <CommandInput />
      <FeedbackPanel />
    </main>
  );
}
