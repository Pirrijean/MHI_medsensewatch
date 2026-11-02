import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type Props = {
  title: ReactNode;
  intro?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
};

/** Clean editorial section header without section numbers or pre-labels. */
export function SectionHeader({
  title,
  intro,
  tone = "dark",
  align = "left",
  className = "",
}: Props) {
  const dark = tone === "dark";
  const centered = align === "center";

  return (
    <div className={`${centered ? "mx-auto max-w-4xl text-center" : "max-w-4xl"} ${className}`}>
      <Reveal>
        <h2
          className={`text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-[3.5rem] ${
            dark ? "text-white" : "text-ink"
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.08}>
          <p
            className={`mt-6 text-lg leading-relaxed ${
              centered ? "mx-auto max-w-2xl" : "max-w-2xl"
            } ${dark ? "text-fog" : "text-ink-soft"}`}
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
