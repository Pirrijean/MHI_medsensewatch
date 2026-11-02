"use client";

import { useState } from "react";
import { applications, signals, type SignalId } from "@/data/applications";
import { site } from "@/lib/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { track } from "@/lib/analytics";

export function Applications() {
  const [selectedId, setSelectedId] = useState<string>(applications[0].id);
  const selected = applications.find((a) => a.id === selectedId) ?? applications[0];

  const choose = (id: string) => {
    if (id === selectedId) return;
    setSelectedId(id);
    track("tech_interaction", { component: "applications_matrix", application: id });
  };

  const usesSignal = (s: SignalId) => selected.signals.includes(s);

  return (
    <section
      id="applications"
      data-section="health-applications"
      className="relative bg-mist text-ink section-y"
    >
      <div className="container-x">
        <SectionHeader
          tone="light"
          title={
            <>
              From continuous measurements <br className="hidden lg:block" />
              to more informed health decisions.
            </>
          }
          intro={`Each clinical and performance domain on ${site.productName} combines a specific subset of molecular and physiological channels.`}
        />

        {/* Open minimalist signal strip — no outer container box */}
        <Reveal className="mt-14 border-y hairline-light py-6 lg:mt-20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="font-mono text-[11px] tracking-wider text-ink-soft uppercase">
              Active channels for <strong className="text-ink">{selected.title}</strong>
            </span>
            <div className="flex items-center gap-5 font-mono text-[11px] text-ink-soft">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#0e8f86]" /> Molecular
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-physio" /> Physiological
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2.5" aria-live="polite">
            {signals.map((s) => {
              const active = usesSignal(s.id);
              const isBio = s.kind === "bio";
              return (
                <span
                  key={s.id}
                  className={`inline-flex items-center gap-2 font-mono text-xs transition-opacity duration-300 ${
                    active ? "font-semibold text-ink opacity-100" : "text-ink-soft opacity-30"
                  }`}
                >
                  <span
                    className={`size-2 rounded-full ${
                      active ? (isBio ? "bg-[#0e8f86]" : "bg-physio") : "bg-ink/20"
                    }`}
                  />
                  {s.label}
                </span>
              );
            })}
          </div>
        </Reveal>

        {/* Six health applications — clean editorial hairline grid, hover-activated, zero nested boxes */}
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((app, i) => {
            const on = app.id === selectedId;
            return (
              <Reveal
                key={app.id}
                delay={i * 0.05}
                className={`border-b hairline-light ${
                  i % 2 === 1 ? "sm:border-l sm:pl-8" : "sm:pr-8"
                } ${
                  i % 3 === 0
                    ? "lg:border-l-0 lg:pl-0 lg:pr-10"
                    : i % 3 === 1
                      ? "lg:border-l lg:px-10"
                      : "lg:border-l lg:pl-10 lg:pr-0"
                } ${i >= 3 ? "lg:border-b-0" : ""}`}
              >
                <button
                  type="button"
                  onMouseEnter={() => choose(app.id)}
                  onFocus={() => choose(app.id)}
                  onClick={() => choose(app.id)}
                  aria-pressed={on}
                  className="flex h-full w-full cursor-pointer flex-col justify-between py-10 text-left transition-opacity"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`font-mono text-[10.5px] tracking-wider uppercase ${
                          on ? "font-semibold text-[#0e8f86]" : "text-ink-soft"
                        }`}
                      >
                        {app.stage}
                      </span>
                      <span
                        aria-hidden
                        className={`size-2 rounded-full transition-transform ${
                          on ? "scale-125 bg-ink" : "bg-ink/15"
                        }`}
                      />
                    </div>

                    <h3
                      className={`mt-4 text-xl tracking-tight uppercase transition-colors ${
                        on ? "font-semibold text-ink" : "font-medium text-ink/75"
                      }`}
                    >
                      {app.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{app.text}</p>
                  </div>

                  <p className="mt-6 font-mono text-[11px] text-ink-soft">
                    {app.signals
                      .map((sid) => signals.find((s) => s.id === sid)?.label)
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
