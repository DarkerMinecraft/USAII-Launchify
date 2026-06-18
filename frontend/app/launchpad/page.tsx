import { Rocket, Lock } from "lucide-react";

export default function LaunchpadPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 py-16 text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl border border-border bg-surface mb-6">
        <Rocket className="w-6 h-6 text-muted-foreground" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border text-xs text-muted-foreground mb-5">
        <Lock className="w-3 h-3" />
        Available after the War Room
      </div>

      <h1 className="text-3xl font-bold tracking-tight mb-3">Launchpad</h1>
      <p className="text-muted-foreground text-base leading-relaxed max-w-md">
        Where founders stop thinking and start doing. Customer outreach, market research,
        and AI-drafted messaging — all calibrated to your specific idea.
      </p>

      <div className="grid grid-cols-3 gap-3 mt-10 max-w-lg w-full">
        {["Customer Connect", "Agent Workspace", "Resource Hub"].map((section) => (
          <div key={section} className="p-3 rounded-lg border border-border bg-surface opacity-50">
            <p className="text-xs font-medium text-foreground">{section}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Coming soon</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-8">
        Complete the War Room to unlock your personalized Launchpad.
      </p>
    </div>
  );
}
