"use client";

import {
  ArrowDown,
  ArrowRight,
  Check,
  Network,
  Rocket,
  ShieldCheck,
  Swords,
} from "lucide-react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
};

const steps = [
  {
    number: "01",
    label: "The Roundtable",
    copy: "Three opinionated AI advisors interrogate the evidence, market, and execution plan across a structured debate.",
    icon: Swords,
    color: "#c2692a",
  },
  {
    number: "02",
    label: "The Assumption Map",
    copy: "Every consequential claim becomes visible—supported, untested, or still missing information—so risk has a shape.",
    icon: Network,
    color: "#6f93c4",
  },
  {
    number: "03",
    label: "The Launchpad",
    copy: "Turn uncertainty into a concrete first move: customer validation, focused research, and an execution brief built from your map.",
    icon: Rocket,
    color: "#6fa37e",
  },
];

const agents = [
  {
    name: "The Skeptic",
    verb: "CHALLENGES",
    color: "#c2692a",
    wash: "rgba(194,105,42,0.10)",
    copy: "Finds the claims conviction is quietly standing in for evidence.",
    question: "What would have to be true?",
  },
  {
    name: "The Strategist",
    verb: "REFRAMES",
    color: "#6f93c4",
    wash: "rgba(58,90,138,0.14)",
    copy: "Tests positioning, timing, and whether the market sees the opportunity the same way you do.",
    question: "Why this wedge, right now?",
  },
  {
    name: "The Operator",
    verb: "GROUNDS",
    color: "#6fa37e",
    wash: "rgba(74,124,89,0.14)",
    copy: "Pulls the idea down to dependencies, sequencing, and what actually has to ship first.",
    question: "What breaks in practice?",
  },
];

const statusRows = [
  { label: "Validated", detail: "Supported by evidence", color: "#6fa37e" },
  { label: "Unvalidated", detail: "Important and still untested", color: "#c2692a" },
  { label: "Needs info", detail: "The honest answer is not known yet", color: "#7a7670" },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c2692a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0e0c]";

export function LandingPage() {
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = Boolean(prefersReducedMotion);
  const revealInitial = reduceMotion ? false : "hidden";
  const hoverLift = reduceMotion ? undefined : { y: -6 };

  return (
    <div className="relative w-full min-w-0 max-w-full overflow-x-clip bg-[#0f0e0c] text-[#ede9e0]">
      <section className="relative isolate min-h-screen overflow-hidden border-b border-[#1f1e1b]">
        <div className="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(ellipse_at_72%_35%,#1b1916_0%,#12110f_42%,#0f0e0c_72%)]" />
        <div className="pointer-events-none absolute inset-0 -z-20 opacity-80 mix-blend-screen saturate-[1.15]">
          <ShaderAnimation />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(15,14,12,0.86)_0%,rgba(15,14,12,0.60)_42%,rgba(15,14,12,0.18)_74%,rgba(15,14,12,0.50)_100%),linear-gradient(180deg,transparent_62%,#0f0e0c_100%)]" />

        <header className="relative z-20 mx-auto flex w-full min-w-0 max-w-[1280px] items-center justify-between gap-3 px-5 py-5 sm:px-8 lg:px-10">
          <Link href="/" className={`group flex items-center gap-3 rounded-lg ${focusRing}`}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ede9e0] font-serif text-base font-bold text-[#131210] shadow-[0_8px_24px_-12px_rgba(0,0,0,0.8)]">
              L
            </span>
            <span>
              <span className="block font-serif text-[16px] font-semibold leading-none">Launchify</span>
              <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.18em] text-[#7a7670]">
                Founder co-pilot
              </span>
            </span>
          </Link>

          <nav aria-label="Public navigation" className="hidden items-center gap-7 md:flex">
            {[
              ["Method", "#method"],
              ["Advisors", "#advisors"],
              ["Safeguard", "#safeguard"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className={`rounded-sm font-mono text-[9px] uppercase tracking-[0.14em] text-[#9a958c] transition-colors hover:text-[#ede9e0] ${focusRing}`}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/auth/login"
              className={`hidden rounded-lg px-3 py-2 text-[12.5px] font-semibold text-[#b8b2a7] transition-colors hover:text-[#ede9e0] sm:inline-flex ${focusRing}`}
            >
              Sign in
            </a>
            <motion.a
              href="/auth/login"
              whileHover={reduceMotion ? undefined : { scale: 1.025 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className={`inline-flex items-center gap-2 rounded-[9px] bg-[#ede9e0] px-3.5 py-2.5 text-[12.5px] font-semibold text-[#131210] shadow-[0_12px_30px_-16px_rgba(237,233,224,0.6)] sm:px-4 ${focusRing}`}
            >
              <span className="hidden min-[440px]:inline">Enter the room</span>
              <span className="min-[440px]:hidden">Enter</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </motion.a>
          </div>
        </header>

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-74px)] w-full min-w-0 max-w-[1280px] grid-cols-1 items-center gap-14 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(420px,0.98fr)] lg:px-10 lg:pb-20 lg:pt-8">
          <motion.div
            variants={stagger}
            initial={revealInitial}
            animate="visible"
            className="w-full min-w-0 max-w-[calc(100vw-40px)] sm:max-w-[700px]"
          >
            <motion.div
              variants={fadeUp}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-[rgba(194,105,42,0.34)] bg-[rgba(194,105,42,0.08)] px-3 py-1.5 font-mono text-[8.5px] uppercase tracking-[0.15em] text-[#c9824c]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#c2692a] shadow-[0_0_10px_#c2692a]" />
              AI decision support for founders
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="max-w-[690px] text-balance font-serif text-[clamp(48px,7vw,88px)] font-medium leading-[0.94] tracking-[-0.035em] drop-shadow-[0_3px_16px_rgba(0,0,0,0.85)]"
            >
              Put your idea
              <span className="block italic text-[#c2692a]">
                <AnimatedTextCycle
                  words={[
                    "on the table.",
                    "to the test.",
                    "through the fire.",
                    "under the lens.",
                    "in the arena.",
                  ]}
                  interval={2800}
                />
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-7 max-w-full text-pretty text-[16px] leading-[1.7] text-[#b8b2a7] sm:max-w-[590px] sm:text-[18px]"
            >
              Three AI advisors debate the assumptions beneath your startup—then turn what survives into a map you can challenge, validate, and act on.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <motion.a
                href="/auth/login"
                whileHover={reduceMotion ? undefined : { scale: 1.025, y: -1 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className={`inline-flex items-center justify-center gap-2.5 rounded-[9px] bg-[#ede9e0] px-[22px] py-3.5 font-semibold text-[#131210] shadow-[0_18px_42px_-20px_rgba(237,233,224,0.55)] ${focusRing}`}
              >
                <Swords className="h-4 w-4" aria-hidden="true" />
                Stress-test your idea
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </motion.a>
              <motion.a
                href="#method"
                whileHover={reduceMotion ? undefined : { y: -1 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className={`inline-flex items-center justify-center gap-2.5 rounded-[9px] border border-[#38332b] bg-[rgba(26,25,22,0.72)] px-[22px] py-3.5 font-semibold text-[#b8b2a7] backdrop-blur-sm transition-colors hover:border-[#4a443a] hover:text-[#ede9e0] ${focusRing}`}
              >
                See how it works
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </motion.a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-11 grid w-full max-w-full grid-cols-3 border-y border-[#2e2c28] py-4 sm:max-w-[560px]"
            >
              {[
                ["3", "opinionated advisors"],
                ["3", "structured rounds"],
                ["1", "living assumption map"],
              ].map(([value, label], index) => (
                <div
                  key={label}
                  className={`px-3 first:pl-0 ${index > 0 ? "border-l border-[#2e2c28]" : ""}`}
                >
                  <div className="font-serif text-[23px] font-semibold text-[#ede9e0]">{value}</div>
                  <div className="mt-1 font-mono text-[7.5px] uppercase leading-[1.5] tracking-[0.11em] text-[#5a574f]">
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full min-w-0 max-w-[calc(100vw-40px)] sm:max-w-[590px]"
          >
            <RoundtablePreview reduceMotion={reduceMotion} />
          </motion.div>
        </div>
      </section>

      <main>
        <motion.section
          id="method"
          variants={stagger}
          initial={revealInitial}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto w-full max-w-[1180px] px-5 py-24 sm:px-8 sm:py-32 lg:px-10"
        >
          <motion.div variants={fadeUp} className="max-w-[700px]">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#5a574f]">From conviction to evidence</p>
            <h2 className="mt-4 text-balance font-serif text-[clamp(34px,5vw,56px)] font-medium leading-[1.02] tracking-[-0.025em]">
              A reasoning pipeline,
              <span className="italic text-[#9a958c]"> not another answer machine.</span>
            </h2>
            <p className="mt-5 max-w-[610px] text-[15px] leading-[1.7] text-[#9a958c]">
              Launchify turns a founder&apos;s messy context into multiple perspectives, visible uncertainty, and a next action the founder still controls.
            </p>
          </motion.div>

          <motion.div variants={stagger} className="mt-14 grid gap-4 lg:grid-cols-3">
            {steps.map(({ number, label, copy, icon: Icon, color }) => (
              <motion.article
                key={number}
                variants={fadeUp}
                whileHover={hoverLift}
                transition={{ duration: 0.25 }}
                className="group relative overflow-hidden rounded-[14px] border border-[#2e2c28] bg-[#131210] p-6 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] sm:p-7"
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
                  style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
                />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] tracking-[0.14em] text-[#5a574f]">{number}</span>
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-[9px] border"
                    style={{ color, borderColor: `${color}55`, background: `${color}14` }}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-12 font-serif text-[23px] font-semibold leading-tight">{label}</h3>
                <p className="mt-3 text-[13.5px] leading-[1.65] text-[#9a958c]">{copy}</p>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        <section id="advisors" className="border-y border-[#1f1e1b] bg-[#11100e]">
          <motion.div
            variants={stagger}
            initial={revealInitial}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mx-auto w-full max-w-[1180px] px-5 py-24 sm:px-8 sm:py-32 lg:px-10"
          >
            <motion.div variants={fadeUp} className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-[660px]">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#5a574f]">The room has a point of view</p>
                <h2 className="mt-4 font-serif text-[clamp(34px,5vw,54px)] font-medium leading-[1.02] tracking-[-0.025em]">
                  Productive disagreement,
                  <span className="italic text-[#9a958c]"> by design.</span>
                </h2>
              </div>
              <p className="max-w-[380px] text-[13.5px] leading-[1.65] text-[#7a7670]">
                Each advisor stays in its lane, reads the full context, and responds to the others—not three copies of the same generic assistant.
              </p>
            </motion.div>

            <motion.div variants={stagger} className="mt-14 grid gap-4 md:grid-cols-3">
              {agents.map((agent) => (
                <motion.article
                  key={agent.name}
                  variants={fadeUp}
                  whileHover={hoverLift}
                  transition={{ duration: 0.25 }}
                  className="rounded-[13px] border p-6 sm:p-7"
                  style={{ borderColor: `${agent.color}4d`, background: agent.wash }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: agent.color, boxShadow: `0 0 12px ${agent.color}` }}
                    />
                    <span className="font-mono text-[8.5px] uppercase tracking-[0.15em]" style={{ color: agent.color }}>
                      {agent.verb}
                    </span>
                  </div>
                  <h3 className="mt-7 font-serif text-[22px] font-semibold italic" style={{ color: agent.color }}>
                    {agent.name}
                  </h3>
                  <p className="mt-3 min-h-[66px] text-[13.5px] leading-[1.65] text-[#b8b2a7]">{agent.copy}</p>
                  <div className="mt-7 border-t pt-5" style={{ borderColor: `${agent.color}33` }}>
                    <p className="font-serif text-[15px] italic text-[#ede9e0]">“{agent.question}”</p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </motion.div>
        </section>

        <motion.section
          id="safeguard"
          variants={stagger}
          initial={revealInitial}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto grid w-full max-w-[1180px] items-center gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[0.9fr_1.1fr] lg:px-10"
        >
          <motion.div variants={fadeUp} className="relative">
            <div className="absolute -inset-10 -z-10 rounded-full bg-[rgba(111,147,196,0.06)] blur-3xl" />
            <div className="rounded-[14px] border border-[#38332b] bg-[#15140f] p-5 shadow-[0_30px_70px_-36px_rgba(0,0,0,0.95)] sm:p-7">
              <div className="flex items-center justify-between border-b border-[#2e2c28] pb-5">
                <div>
                  <p className="font-mono text-[8.5px] uppercase tracking-[0.15em] text-[#5a574f]">Assumption map</p>
                  <p className="mt-2 font-serif text-[19px] font-semibold italic">Uncertainty stays visible.</p>
                </div>
                <Network className="h-5 w-5 text-[#6f93c4]" aria-hidden="true" />
              </div>
              <div className="mt-2 divide-y divide-[#2e2c28]">
                {statusRows.map((row) => (
                  <div key={row.label} className="flex items-center gap-4 py-4">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: row.color, boxShadow: `0 0 10px -2px ${row.color}` }}
                    />
                    <div className="flex-1">
                      <p className="font-mono text-[8.5px] uppercase tracking-[0.13em]" style={{ color: row.color }}>
                        {row.label}
                      </p>
                      <p className="mt-1 text-[12.5px] text-[#7a7670]">{row.detail}</p>
                    </div>
                    <Check className="h-3.5 w-3.5 text-[#4a443a]" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="max-w-[620px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[rgba(111,163,126,0.34)] bg-[rgba(74,124,89,0.10)] text-[#6fa37e]">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="mt-7 font-mono text-[9px] uppercase tracking-[0.16em] text-[#5a574f]">Responsible by construction</p>
            <h2 className="mt-4 text-balance font-serif text-[clamp(34px,5vw,54px)] font-medium leading-[1.04] tracking-[-0.025em]">
              The AI does not decide
              <span className="block italic text-[#9a958c]">whether your idea is good.</span>
            </h2>
            <p className="mt-6 text-[15px] leading-[1.75] text-[#9a958c]">
              Launchify reasons only from what you provide. It surfaces the hidden load-bearing claims and suggests ways to test them. You decide what evidence counts, what changes, and what happens next.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "No proceed-or-stop verdict",
                "Founder reviews every assumption",
                "Unknowns remain visibly unknown",
                "Customer evidence outranks AI confidence",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-[12.5px] leading-[1.5] text-[#b8b2a7]">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6fa37e]" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        <section className="px-5 pb-10 sm:px-8 sm:pb-14 lg:px-10">
          <motion.div
            initial={revealInitial}
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="relative mx-auto max-w-[1180px] overflow-hidden rounded-[16px] border border-[#38332b] bg-[#15140f] px-6 py-16 text-center shadow-[0_30px_80px_-48px_rgba(0,0,0,0.95)] sm:px-10 sm:py-20"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(194,105,42,0.16),transparent_48%)]" />
            <motion.p variants={fadeUp} className="relative font-mono text-[9px] uppercase tracking-[0.16em] text-[#c2692a]">
              Bring the idea. Keep the decision.
            </motion.p>
            <motion.h2 variants={fadeUp} className="relative mx-auto mt-5 max-w-[760px] text-balance font-serif text-[clamp(36px,6vw,64px)] font-medium leading-[0.98] tracking-[-0.03em]">
              Find the assumption that changes everything.
            </motion.h2>
            <motion.p variants={fadeUp} className="relative mx-auto mt-6 max-w-[550px] text-[14px] leading-[1.7] text-[#9a958c]">
              A structured War Room session turns the story in your head into risks you can see—and evidence you can go collect.
            </motion.p>
            <motion.div variants={fadeUp} className="relative mt-9">
              <motion.a
                href="/auth/login"
                whileHover={reduceMotion ? undefined : { scale: 1.025, y: -1 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className={`inline-flex items-center gap-2.5 rounded-[9px] bg-[#ede9e0] px-[22px] py-3.5 font-semibold text-[#131210] ${focusRing}`}
              >
                Enter the War Room
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </motion.a>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-[#1f1e1b] px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 text-[11px] text-[#5a574f] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#ede9e0] font-serif text-[11px] font-bold text-[#131210]">L</span>
            <span className="font-serif text-[13px] font-semibold text-[#9a958c]">Launchify</span>
          </div>
          <p className="font-mono text-[8px] uppercase tracking-[0.12em]">
            Surfaces information. The founder decides.
          </p>
          <a href="/auth/login" className={`rounded-sm font-semibold text-[#7a7670] transition-colors hover:text-[#ede9e0] ${focusRing}`}>
            Sign in
          </a>
        </div>
      </footer>
    </div>
  );
}

function RoundtablePreview({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div
      role="img"
      aria-label="A preview of three AI advisors arranged around a founder's idea in the War Room"
      className="relative aspect-[1.03/1] w-full overflow-hidden rounded-[18px] border border-[#38332b] bg-[rgba(15,14,12,0.66)] shadow-[0_40px_100px_-42px_rgba(0,0,0,0.95)] backdrop-blur-[14px]"
    >
      <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-[#2e2c28] bg-[rgba(19,18,16,0.76)] px-5 py-3.5 backdrop-blur-sm">
        <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#7a7670]">Live · Round 2 of 3</span>
        <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-[#c2692a]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#c2692a] shadow-[0_0_8px_#c2692a]" />
          debating
        </span>
      </div>

      <div className="absolute inset-x-[10%] bottom-[11%] top-[19%] rounded-[50%] border border-[#322b24] bg-[radial-gradient(ellipse_at_center,#2c2620_0%,#221d18_46%,#1a1611_100%)] shadow-[0_34px_80px_-34px_rgba(0,0,0,0.9),inset_0_2px_0_rgba(237,233,224,0.05)]">
        <div className="absolute inset-[13%] rounded-[50%] border border-[#3a332b]" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <p className="font-mono text-[7px] uppercase tracking-[0.17em] text-[#7a7670]">On the table</p>
            <p className="mt-2 max-w-[160px] font-serif text-[clamp(16px,2vw,22px)] font-semibold italic leading-[1.15] text-[#ede9e0]">
              Your idea, under pressure
            </p>
          </div>
        </div>
      </div>

      <OrbitNode
        name="The Skeptic"
        verb="CHALLENGES"
        color="#c2692a"
        className="left-1/2 top-[16%] -translate-x-1/2"
        active
        reduceMotion={reduceMotion}
      />
      <OrbitNode
        name="The Strategist"
        verb="REFRAMES"
        color="#6f93c4"
        className="left-[3%] top-1/2 -translate-y-1/2"
        reduceMotion={reduceMotion}
      />
      <OrbitNode
        name="The Operator"
        verb="GROUNDS"
        color="#6fa37e"
        className="right-[3%] top-1/2 -translate-y-1/2"
        reduceMotion={reduceMotion}
      />

      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[5%] left-1/2 -translate-x-1/2 text-center"
      >
        <span className="mx-auto block h-7 w-7 rounded-full border-2 border-[#a8987f] bg-[rgba(138,122,106,0.18)]" />
        <span className="mt-1.5 block font-serif text-[11px] italic text-[#a8987f]">You</span>
      </motion.div>

      <div className="absolute bottom-4 left-4 right-4 h-px bg-[linear-gradient(90deg,transparent,#4a443a,transparent)] opacity-60" />
    </div>
  );
}

function OrbitNode({
  name,
  verb,
  color,
  className,
  active = false,
  reduceMotion,
}: {
  name: string;
  verb: string;
  color: string;
  className: string;
  active?: boolean;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      animate={active && !reduceMotion ? { y: [0, -4, 0] } : undefined}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute z-10 flex flex-col items-center ${className}`}
    >
      <span
        className="block h-10 w-10 rounded-full border-[3px]"
        style={{
          borderColor: color,
          background: `${color}22`,
          boxShadow: active ? `0 0 0 4px ${color}22, 0 0 24px -4px ${color}` : undefined,
        }}
      />
      <span className="mt-2 whitespace-nowrap font-serif text-[11px] font-semibold italic" style={{ color }}>
        {name}
      </span>
      <span className="mt-0.5 font-mono text-[6px] tracking-[0.13em] text-[#5a574f]">{verb}</span>
    </motion.div>
  );
}
