import Link from "next/link";
import { Plus } from "lucide-react";
import { auth0 } from "@/lib/auth0";
import { LandingPage } from "@/components/landing/landing-page";
import { SessionList } from "@/components/home/session-list";

const Home = async () => {
  const session = await auth0.getSession();

  if (!session) {
    return <LandingPage />;
  }

  const firstName =
    ((session.user?.name as string | undefined) ?? "").split(" ")[0] || "there";

  return (
    <div className="mx-auto max-w-2xl px-8 py-14">
      <div className="mb-10">
        <p className="eyebrow mb-3 font-mono">Dashboard</p>
        <h1
          className="font-serif text-[30px] italic leading-[1.1] text-foreground"
          style={{ marginBottom: "8px" }}
        >
          Welcome back, {firstName}.
        </h1>
        <p className="text-[14px] text-text-dim" style={{ lineHeight: 1.6 }}>
          Pick up where you left off, or stress-test a new idea.
        </p>
      </div>

      <Link
        href="/war-room"
        className="mb-12 inline-flex items-center gap-2.5 rounded-[9px] bg-primary px-5 py-[11px] text-[14px] font-semibold text-primary-foreground no-underline"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        New War Room session
      </Link>

      <div>
        <p className="eyebrow mb-4 font-mono">Your Sessions</p>
        <SessionList />
      </div>

      <p className="eyebrow mt-14 text-center font-mono text-[8.5px] leading-relaxed text-[#3a3833]">
        Launchify surfaces information. The founder decides what to do with it.
      </p>
    </div>
  );
};

export default Home;
