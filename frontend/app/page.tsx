import Link from "next/link";
import { ArrowRight, Swords, Lightbulb, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 py-16 max-w-2xl mx-auto">
      {/* Eyebrow */}
      <div className="flex items-center gap-2 mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border text-xs text-muted-foreground bg-surface">
          <span className="w-1.5 h-1.5 rounded-full bg-agent-operator animate-pulse" />
          AI Hackathon 2026 — Challenge Brief 3
        </span>
      </div>

      {/* Headline */}
      <h1 className="text-5xl font-bold tracking-tight text-center leading-[1.1] mb-6">
        Stress-test your idea{" "}
        <span className="text-muted-foreground font-normal">before</span>
        <br />
        the market does.
      </h1>

      {/* Sub-description */}
      <p className="text-muted-foreground text-lg text-center leading-relaxed mb-10 max-w-lg">
        Three AI agents debate your startup idea in real-time — surfacing hidden assumptions,
        market gaps, and execution risks. You decide what to do with it.
      </p>

      {/* CTA */}
      <Link
        href="/war-room"
        className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors group"
      >
        <Swords className="w-4 h-4" />
        Enter the War Room
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </Link>

      {/* Feature trio */}
      <div className="grid grid-cols-3 gap-4 mt-16 w-full">
        {[
          {
            icon: Swords,
            label: "War Room",
            desc: "Three AI agents debate your idea across three structured rounds.",
            accent: "text-agent-skeptic",
          },
          {
            icon: Target,
            label: "Assumption Map",
            desc: "Every claim surfaces as a node — validated, unvalidated, or unknown.",
            accent: "text-agent-strategist",
          },
          {
            icon: Lightbulb,
            label: "Launchpad",
            desc: "Turn your map into action — outreach, research, and messaging.",
            accent: "text-agent-operator",
          },
        ].map(({ icon: Icon, label, desc, accent }) => (
          <div
            key={label}
            className="flex flex-col gap-2 p-4 rounded-lg border border-border bg-surface"
          >
            <Icon className={`w-5 h-5 ${accent}`} />
            <p className="text-sm font-semibold text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Responsible AI footnote */}
      <p className="text-[11px] text-muted-foreground text-center mt-12 max-w-md leading-relaxed">
        FOUNDR surfaces information. The founder decides what to do with it.
        This analysis does not replace talking to real customers.
      </p>
    </div>
  );
}
