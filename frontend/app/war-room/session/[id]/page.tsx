import type { Metadata } from "next";
import { auth0 } from "@/lib/auth0";
import { WarRoomArena } from "@/components/war-room/war-room-arena";

export const metadata: Metadata = {
  title: "War Room Session",
  robots: { index: false, follow: false },
};

const WarRoomSessionPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const session = await auth0.getSession();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-8 py-16 text-center">
        <p className="font-serif italic mb-6 text-[26px] text-foreground">
          Sign in to enter the War Room.
        </p>
        <a
          href="/auth/login"
          className="inline-flex items-center gap-2 font-semibold bg-primary text-primary-foreground rounded-[9px] py-3 px-[22px] text-[14.5px] no-underline"
        >
          Sign in
        </a>
      </div>
    );
  }

  return <WarRoomArena id={id} />;
};
export default WarRoomSessionPage;
