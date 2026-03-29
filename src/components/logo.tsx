import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ className, size = "md" }: LogoProps) {
  const textSize =
    size === "sm" ? "text-lg" :
    size === "md" ? "text-2xl" :
    "text-4xl";

  return (
    <div className={cn("font-display tracking-wider flicker", textSize, className)}>
      <span className="text-foreground/60 text-[0.65em] mr-1 align-middle">//</span>
      <span className="text-foreground">ICANTFIND</span>
      <span className="glow-red text-ctf-red">.IT</span>
      <span className="text-ctf-red cursor-blink glow-red">_</span>
    </div>
  );
}
