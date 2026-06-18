"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Swords, Rocket, Mic, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const pillars = [
  {
    label: "War Room",
    href: "/war-room",
    icon: Swords,
    locked: false,
    description: "Challenge your idea",
  },
  {
    label: "Launchpad",
    href: "/launchpad",
    icon: Rocket,
    locked: true,
    description: "Connect & execute",
  },
  {
    label: "Pitch Coach",
    href: "/pitch-coach",
    icon: Mic,
    locked: true,
    description: "Practice & perform",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-60 shrink-0 h-screen border-r border-border bg-surface sticky top-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground text-xs font-bold tracking-tight">F</span>
          </div>
          <span className="text-foreground font-semibold tracking-tight text-sm">FOUNDR</span>
        </Link>
      </div>

      {/* Pillar navigation */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-widest px-2 pb-2 pt-1">
          Pillars
        </p>
        {pillars.map(({ label, href, icon: Icon, locked, description }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors group",
                isActive
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
                locked && "opacity-50"
              )}
              aria-disabled={locked}
              tabIndex={locked ? -1 : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium leading-none flex items-center gap-1.5">
                  {label}
                  {locked && <Lock className="w-2.5 h-2.5 text-muted-foreground" />}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{description}</div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Idea summary card — empty state in Phase 3 */}
      <div className="p-3 border-t border-border">
        <div className="rounded-md border border-border bg-background p-3">
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-1.5">
            Active Idea
          </p>
          <p className="text-xs text-muted-foreground italic leading-relaxed">
            No session yet. Start the War Room to begin.
          </p>
        </div>
      </div>
    </aside>
  );
}
