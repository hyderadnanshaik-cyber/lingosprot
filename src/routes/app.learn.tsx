import { createFileRoute } from "@tanstack/react-router";
import { FullPath } from "@/components/learning-path";

export const Route = createFileRoute("/app/learn")({
  head: () => ({
    meta: [
      { title: "Learning map — LingoSprout" },
      { name: "description", content: "Follow the path from letter sounds to reading and speaking." },
      { property: "og:title", content: "Learning map — LingoSprout" },
      { property: "og:description", content: "Follow the path from letter sounds to reading and speaking." },
    ],
  }),
  component: () => (
    <div>
      <h1 className="mb-6 text-4xl font-extrabold">Your learning map</h1>
      <FullPath />
    </div>
  ),
});
