import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/announcements/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto">
      <div className="text-xl font-bold">Announcements</div>
    </div>
  );
}
