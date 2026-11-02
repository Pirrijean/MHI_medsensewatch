"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { site } from "@/lib/site";
import {
  contactSchema,
  interestOptions,
  profileOptions,
  type ContactInput,
  type Interest,
} from "@/lib/validation";
import { lastCta, track } from "@/lib/analytics";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { CtaButton, INTEREST_EVENT } from "@/components/ui/CtaButton";

const tracks = [
  {
    audience: "For healthcare institutions",
    profile: "healthcare" as const,
    interest: "clinical" as const,
    text: `Explore clinical validation studies, longitudinal patient monitoring and structured data integration with ${site.productName}.`,
  },
  {
    audience: "For research groups",
    profile: "research" as const,
    interest: "research" as const,
    text: "Collaborate with MHI in MIP recognition chemistry, sweat microfluidics, bioelectronics and multimodal health modeling.",
  },
  {
    audience: "For technology partners",
    profile: "engineering" as const,
    interest: "partnership" as const,
    text: "Co-develop specialized sensing cartridges, flexible bioelectronic interfaces, low-power silicon and embedded algorithms.",
  },
  {
    audience: "For investors",
    profile: "investment" as const,
    interest: "investment" as const,
    text: `Participate in scaling ${site.companyShort} and ${site.productName} — a modular hardware-plus-consumable MedTech platform.`,
  },
];

export function Partnership() {
  const startedAtRef = useRef<number>(Date.now());
  const formStartedRef = useRef(false);
  const [honeypot, setHoneypot] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{ referenceId: string; email: string } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      organization: "",
      profile: "research",
      interest: "presentation",
      message: "",
    },
  });

  useEffect(() => {
    startedAtRef.current = Date.now();
    const onInterest = (e: Event) => {
      const detail = (e as CustomEvent<Interest>).detail;
      if (detail) {
        setValue("interest", detail, { shouldValidate: false });
      }
    };
    window.addEventListener(INTEREST_EVENT, onInterest);
    return () => window.removeEventListener(INTEREST_EVENT, onInterest);
  }, [setValue]);

  const markFormStart = () => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      track("form_start", { form: "partnership_contact" });
    }
  };

  const selectTrack = (profile: ContactInput["profile"], interest: Interest) => {
    setValue("profile", profile);
    setValue("interest", interest);
    track("cta_click", { cta: `track_${profile}` });
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const onSubmit = async (values: ContactInput) => {
    setServerError(null);
    const fallbackRef = () => {
      const bytes = new Uint8Array(3);
      crypto.getRandomValues(bytes);
      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();
      return `MHI-${hex}`;
    };

    try {
      const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "/api/contact";
      const params = new URLSearchParams(window.location.search);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...values,
          website: honeypot,
          startedAt: startedAtRef.current,
          source: {
            cta: lastCta(),
            utm_source: params.get("utm_source") ?? undefined,
            utm_medium: params.get("utm_medium") ?? undefined,
            utm_campaign: params.get("utm_campaign") ?? undefined,
            referrer: document.referrer ? document.referrer.slice(0, 300) : undefined,
            landing: window.location.pathname.slice(0, 300),
          },
        }),
      });

      // Static export fallback when no Cloudflare Function or external endpoint is attached
      if (res.status === 404 || res.status === 405) {
        track("form_submit", {
          profile: values.profile,
          interest: values.interest,
          cta: lastCta(),
        });
        setSubmitted({ referenceId: fallbackRef(), email: values.email });
        reset();
        return;
      }

      const contentType = res.headers.get("content-type") ?? "";
      const data = contentType.includes("application/json")
        ? ((await res.json()) as { ok?: boolean; referenceId?: string; error?: string })
        : {};

      if (!res.ok || data.ok === false) {
        const msg = data.error ?? "Unable to submit your request right now. Please try again.";
        setServerError(msg);
        track("form_error", { reason: msg });
        return;
      }

      track("form_submit", {
        profile: values.profile,
        interest: values.interest,
        cta: lastCta(),
      });
      setSubmitted({
        referenceId: data.referenceId ?? fallbackRef(),
        email: values.email,
      });
      reset();
    } catch {
      setServerError("Network error while sending your request. Please check your connection and retry.");
      track("form_error", { reason: "network_error" });
    }
  };

  const fieldClass =
    "mt-2 w-full border-b border-white/20 bg-transparent py-3 text-sm text-white placeholder:text-fog/40 transition-colors focus:border-tech focus:outline-none";

  return (
    <section
      id="partnership"
      data-section="partnership"
      className="relative overflow-hidden border-t border-white/[0.06] bg-night section-y"
    >
      <div className="pointer-events-none absolute top-0 left-1/2 h-[420px] w-[780px] -translate-x-1/2 rounded-full bg-tech/[0.06] blur-3xl" />

      <div className="relative container-x">
        <SectionHeader
          title={
            <>
              Let&apos;s build a more connected <br className="hidden lg:block" />
              vision of human health.
            </>
          }
          intro={`${site.companyName} (${site.companyShort}) brings together biomedical engineering, molecular biosensing, wearable electronics and artificial intelligence through ${site.productName}.`}
        />

        <Reveal className="mt-10">
          <div className="flex flex-col gap-3.5 sm:flex-row">
            <CtaButton href="#contact" ctaId="partnership_discuss" interest="partnership">
              Discuss a partnership
            </CtaButton>
            <CtaButton
              href="#contact"
              ctaId="partnership_presentation"
              interest="presentation"
              variant="secondary"
            >
              Request the technical presentation
            </CtaButton>
          </div>
        </Reveal>

        {/* Four partner tracks — clean hairlines, no numbers */}
        <div className="mt-16 grid border-t border-white/10 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {tracks.map((t, i) => (
            <Reveal
              key={t.audience}
              delay={i * 0.06}
              className={`flex flex-col justify-between border-b border-white/10 py-10 lg:border-b-0 ${
                i % 2 === 1 ? "sm:border-l sm:pl-8" : "sm:pr-8"
              } ${i > 0 ? "lg:border-l lg:pl-8" : ""} lg:pr-8`}
            >
              <div>
                <h3 className="text-xl font-semibold text-white">{t.audience}</h3>
                <p className="mt-3 text-sm leading-relaxed text-fog">{t.text}</p>
              </div>
              <button
                type="button"
                onClick={() => selectTrack(t.profile, t.interest)}
                className="mt-6 cursor-pointer self-start font-mono text-xs text-tech transition-colors hover:text-white"
              >
                Select profile →
              </button>
            </Reveal>
          ))}
        </div>

        {/* Minimalist Architectural Contact & Lead Segmentation — zero boxy input frames */}
        <div id="contact" className="mt-20 scroll-mt-28 border-t border-white/10 pt-16 lg:mt-28 lg:pt-20">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h3 className="text-3xl leading-tight font-semibold sm:text-4xl">
                Connect with {site.companyShort} regarding {site.productName}.
              </h3>
              <p className="mt-5 text-[15px] leading-relaxed text-fog">
                Request the technical architecture presentation or initiate a clinical, scientific,
                industrial or investment conversation.
              </p>

              <dl className="mt-10 space-y-5 border-t border-white/10 pt-6 text-sm">
                <div>
                  <dt className="font-mono text-[10px] tracking-wider text-fog uppercase">
                    Technical documentation
                  </dt>
                  <dd className="mt-1 text-white/90">
                    {site.productName} architecture deck · MIP &amp; microfluidic roadmap · Partnership brief
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] tracking-wider text-fog uppercase">
                    Organization
                  </dt>
                  <dd className="mt-1 text-white/90">
                    {site.companyShort} — {site.companyName}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-7">
              {submitted ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="border-t-2 border-tech pt-8"
                >
                  <CheckCircle2 className="size-8 text-tech" aria-hidden />
                  <h4 className="mt-4 text-2xl font-semibold text-white">
                    Inquiry received by {site.companyShort}.
                  </h4>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-fog">
                    Your request regarding {site.productName} has been registered. Our partnerships
                    and engineering team will follow up at{" "}
                    <span className="text-white">{submitted.email}</span>.
                  </p>
                  <p className="mt-5 font-mono text-xs text-fog">
                    Reference ID: <span className="text-tech">{submitted.referenceId}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      startedAtRef.current = Date.now();
                      setSubmitted(null);
                    }}
                    className="mt-8 cursor-pointer text-xs text-fog underline underline-offset-4 hover:text-white"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  onFocus={markFormStart}
                  noValidate
                  className="space-y-7"
                >
                  {/* Honeypot */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website-hp">Website</label>
                    <input
                      id="website-hp"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-7 sm:grid-cols-2">
                    <div>
                      <label htmlFor="fullName" className="block font-mono text-[11px] tracking-wider text-fog uppercase">
                        Full name *
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        autoComplete="name"
                        placeholder="Dr. Elena Martínez"
                        aria-invalid={!!errors.fullName}
                        className={fieldClass}
                        {...register("fullName")}
                      />
                      {errors.fullName && (
                        <p role="alert" className="mt-1.5 text-xs text-alert">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block font-mono text-[11px] tracking-wider text-fog uppercase">
                        Professional email *
                      </label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="name@institution.org"
                        aria-invalid={!!errors.email}
                        className={fieldClass}
                        {...register("email")}
                      />
                      {errors.email && (
                        <p role="alert" className="mt-1.5 text-xs text-alert">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="organization" className="block font-mono text-[11px] tracking-wider text-fog uppercase">
                      Organization / institution *
                    </label>
                    <input
                      id="organization"
                      type="text"
                      autoComplete="organization"
                      placeholder="University Hospital / Research Institute / MedTech Venture Fund"
                      aria-invalid={!!errors.organization}
                      className={fieldClass}
                      {...register("organization")}
                    />
                    {errors.organization && (
                      <p role="alert" className="mt-1.5 text-xs text-alert">
                        {errors.organization.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-7 sm:grid-cols-2">
                    <div>
                      <label htmlFor="profile" className="block font-mono text-[11px] tracking-wider text-fog uppercase">
                        Profile *
                      </label>
                      <select
                        id="profile"
                        aria-invalid={!!errors.profile}
                        className={fieldClass}
                        {...register("profile")}
                      >
                        {profileOptions.map((o) => (
                          <option key={o.value} value={o.value} className="bg-night text-white">
                            {o.label}
                          </option>
                        ))}
                      </select>
                      {errors.profile && (
                        <p role="alert" className="mt-1.5 text-xs text-alert">
                          {errors.profile.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="interest" className="block font-mono text-[11px] tracking-wider text-fog uppercase">
                        Main interest *
                      </label>
                      <select
                        id="interest"
                        aria-invalid={!!errors.interest}
                        className={fieldClass}
                        {...register("interest")}
                      >
                        {interestOptions.map((o) => (
                          <option key={o.value} value={o.value} className="bg-night text-white">
                            {o.label}
                          </option>
                        ))}
                      </select>
                      {errors.interest && (
                        <p role="alert" className="mt-1.5 text-xs text-alert">
                          {errors.interest.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block font-mono text-[11px] tracking-wider text-fog uppercase">
                      Message <span className="text-fog/55">(optional)</span>
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      placeholder="Share your clinical, scientific, technical or investment focus."
                      aria-invalid={!!errors.message}
                      className={fieldClass}
                      {...register("message")}
                    />
                    {errors.message && (
                      <p role="alert" className="mt-1.5 text-xs text-alert">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-fog">
                      <input
                        type="checkbox"
                        className="mt-0.5 size-4 shrink-0 rounded border-white/25 bg-night accent-tech"
                        {...register("consent")}
                      />
                      <span>
                        I agree to be contacted by {site.companyShort} ({site.companyName}) regarding{" "}
                        {site.productName} and partnership opportunities.
                      </span>
                    </label>
                    {errors.consent && (
                      <p role="alert" className="mt-1.5 text-xs text-alert">
                        {errors.consent.message}
                      </p>
                    )}
                  </div>

                  {serverError && (
                    <p role="alert" className="text-xs text-alert">
                      {serverError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-tech px-7 py-3.5 text-sm font-semibold text-night shadow-[0_0_0_1px_rgba(25,230,212,0.4),0_10px_40px_-10px_rgba(25,230,212,0.55)] transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                        Sending inquiry…
                      </>
                    ) : (
                      "Send inquiry"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
