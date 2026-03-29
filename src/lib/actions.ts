"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "@/lib/supabase";
import type { Category, Difficulty, ChallengeStatus } from "@/types";

const db = () => createSupabaseClient();

// ── Challenges ────────────────────────────────────────────────

export async function createChallenge(data: {
  title: string;
  ctf_name: string;
  category: Category;
  difficulty: Difficulty;
  points: number | null;
  status: ChallengeStatus;
}) {
  const { data: challenge, error } = await db()
    .from("challenges")
    .insert({ ...data, notes: "" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/writeup");
  revalidatePath("/");
  return challenge;
}

export async function updateChallengeMeta(
  id: string,
  data: Partial<{
    title: string;
    ctf_name: string;
    category: Category;
    difficulty: Difficulty;
    points: number | null;
    status: ChallengeStatus;
  }>
) {
  const { error } = await db()
    .from("challenges")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(`/writeup/${id}`);
  revalidatePath("/writeup");
  revalidatePath("/");
}

export async function updateNotes(id: string, notes: string) {
  const { error } = await db()
    .from("challenges")
    .update({ notes, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function updateFlag(id: string, flag: string) {
  const { error } = await db()
    .from("challenges")
    .update({ flag, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(`/writeup/${id}`);
}

export async function updateStatus(id: string, status: ChallengeStatus) {
  const { error } = await db()
    .from("challenges")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(`/writeup/${id}`);
  revalidatePath("/writeup");
  revalidatePath("/");
}

export async function deleteChallenge(id: string) {
  const { error } = await db().from("challenges").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/writeup");
  revalidatePath("/");
}

// ── Payloads ──────────────────────────────────────────────────

export async function addPayload(
  challengeId: string,
  label: string | null,
  content: string
) {
  const { data, error } = await db()
    .from("payloads")
    .insert({ challenge_id: challengeId, label, content })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath(`/writeup/${challengeId}`);
  return data;
}

export async function deletePayload(id: string, challengeId: string) {
  const { error } = await db().from("payloads").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/writeup/${challengeId}`);
}
