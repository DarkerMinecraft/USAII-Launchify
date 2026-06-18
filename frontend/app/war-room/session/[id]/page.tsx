import { Swords } from "lucide-react";

export default async function WarRoomSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 py-16 text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl border border-agent-skeptic/30 bg-surface mb-6">
        <Swords className="w-6 h-6 text-agent-skeptic" />
      </div>

      <h1 className="font-serif italic text-3xl font-bold tracking-tight mb-3">
        War Room
      </h1>
      <p className="text-muted-foreground text-xs mb-6 font-mono">Session {id}</p>
      <p className="text-muted-foreground text-base leading-relaxed max-w-md">
        Debate transcript and Assumption Map — coming in Phases 6 and 7.
      </p>
    </div>
  );
}
