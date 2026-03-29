export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase";
import ChallengeDetail from "./challenge-detail";
import type { Challenge, Payload } from "@/types";

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = createSupabaseClient();

  const [{ data: challenge }, { data: payloads }] = await Promise.all([
    db.from("challenges").select("*").eq("id", id).single(),
    db.from("payloads").select("*").eq("challenge_id", id).order("created_at"),
  ]);

  if (!challenge) notFound();

  return (
    <ChallengeDetail
      challenge={challenge as Challenge}
      initialPayloads={(payloads as Payload[]) ?? []}
    />
  );
}
