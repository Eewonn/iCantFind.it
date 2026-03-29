import type { Category, Difficulty, ChallengeStatus } from "@/types";

export const CATEGORIES: { value: Category; label: string; color: string; bg: string }[] = [
  { value: "web",       label: "Web",       color: "text-ctf-blue",   bg: "bg-ctf-blue/10 border-ctf-blue/30" },
  { value: "crypto",    label: "Crypto",    color: "text-ctf-purple", bg: "bg-ctf-purple/10 border-ctf-purple/30" },
  { value: "forensics", label: "Forensics", color: "text-ctf-green",  bg: "bg-ctf-green/10 border-ctf-green/30" },
  { value: "pwn",       label: "Pwn",       color: "text-ctf-red",    bg: "bg-ctf-red/10 border-ctf-red/30" },
  { value: "re",        label: "RE",        color: "text-ctf-orange", bg: "bg-ctf-orange/10 border-ctf-orange/30" },
  { value: "osint",     label: "OSINT",     color: "text-ctf-teal",   bg: "bg-ctf-teal/10 border-ctf-teal/30" },
  { value: "misc",      label: "Misc",      color: "text-text-muted", bg: "bg-surface-2/50 border-border-subtle/50" },
];

export const DIFFICULTIES: { value: Difficulty; label: string; color: string }[] = [
  { value: "easy",   label: "Easy",   color: "text-ctf-green" },
  { value: "medium", label: "Medium", color: "text-ctf-orange" },
  { value: "hard",   label: "Hard",   color: "text-ctf-red" },
];

export const STATUSES: { value: ChallengeStatus; label: string; color: string; bg: string }[] = [
  { value: "unsolved", label: "Unsolved", color: "text-text-muted",  bg: "bg-surface-2/50 border-border-subtle/50" },
  { value: "partial",  label: "Partial",  color: "text-ctf-orange",  bg: "bg-ctf-orange/10 border-ctf-orange/30" },
  { value: "solved",   label: "Solved",   color: "text-ctf-green",   bg: "bg-ctf-green/10 border-ctf-green/30" },
];

export const MOTIVATIONAL_LINES = [
  "keep going, the flag is in there somewhere",
  "have you tried turning it off and on again?",
  "it's always base64. check again.",
  "the answer is probably in the source code",
  "you are one Google search away from glory",
  "skill issue? no. temporary knowledge gap.",
  "strings. always run strings first.",
  "the flag is not in /etc/passwd. probably.",
  "have you tried reading the challenge description",
  "touching grass is optional but recommended",
  "you've got this. (we're legally required to say that)",
  "CTF hint: the flag starts with the flag format",
];
