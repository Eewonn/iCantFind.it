export type Category = "web" | "crypto" | "forensics" | "pwn" | "re" | "osint" | "misc";
export type Difficulty = "easy" | "medium" | "hard";
export type ChallengeStatus = "unsolved" | "partial" | "solved";

export interface Challenge {
  id: string;
  title: string;
  ctf_name: string;
  category: Category;
  difficulty: Difficulty;
  points: number | null;
  status: ChallengeStatus;
  flag: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Payload {
  id: string;
  challenge_id: string;
  label: string | null;
  content: string;
  created_at: string;
}

export interface CheatsheetEntry {
  id: string;
  title: string;
  description: string;
  category: Category;
  snippet: string;
  tags: string[];
  source_url: string | null;
  created_at: string;
}
