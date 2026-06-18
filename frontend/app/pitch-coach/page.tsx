import { Mic, Lock } from "lucide-react";

export default function PitchCoachPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 py-16 text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl border border-border bg-surface mb-6">
        <Mic className="w-6 h-6 text-muted-foreground" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border text-xs text-muted-foreground mb-5">
        <Lock className="w-3 h-3" />
        UI shell only — not built for the hackathon
      </div>

      <h1 className="text-3xl font-bold tracking-tight mb-3">Pitch Coach</h1>
      <p className="text-muted-foreground text-base leading-relaxed max-w-md">
        Practice your investor pitch and get structured feedback on pacing, clarity,
        and filler words. Powered by Gemini multimodal — coming after the hackathon.
      </p>

      <div className="mt-10 p-4 rounded-lg border border-border bg-surface max-w-sm w-full opacity-50">
        <div className="w-full h-2 rounded-full bg-border mb-3" />
        <div className="w-3/4 h-2 rounded-full bg-border mb-3" />
        <div className="w-1/2 h-2 rounded-full bg-border" />
      </div>

      <p className="text-xs text-muted-foreground mt-8 max-w-sm leading-relaxed">
        Will analyze verbal pitches and flag when your delivery contradicts
        unvalidated assumptions from the War Room.
      </p>
    </div>
  );
}
