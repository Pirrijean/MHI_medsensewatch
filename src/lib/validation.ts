import { z } from "zod";

export const profileOptions = [
  { value: "research", label: "Research" },
  { value: "healthcare", label: "Healthcare" },
  { value: "engineering", label: "Engineering" },
  { value: "investment", label: "Investment" },
  { value: "industry", label: "Industry" },
] as const;

export const interestOptions = [
  { value: "presentation", label: "Request the technical presentation" },
  { value: "partnership", label: "Development partnership" },
  { value: "clinical", label: "Clinical collaboration" },
  { value: "research", label: "Research collaboration" },
  { value: "investment", label: "Investment" },
  { value: "other", label: "Other" },
] as const;

export type Interest = (typeof interestOptions)[number]["value"];

const profileValues = profileOptions.map((o) => o.value) as [string, ...string[]];
const interestValues = interestOptions.map((o) => o.value) as [string, ...string[]];

/** Fields the visitor fills in. Shared by the client form and the API route. */
export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.string().trim().email("Please enter a valid professional email.").max(160),
  organization: z.string().trim().min(2, "Please enter your organization.").max(160),
  profile: z.enum(profileValues, { message: "Select a profile." }),
  interest: z.enum(interestValues, { message: "Select your main interest." }),
  message: z.string().trim().max(2000, "Maximum 2000 characters.").optional().or(z.literal("")),
  consent: z.literal(true, { message: "Consent is required to process your request." }),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Payload sent to the server: form fields + anti-spam + attribution. */
export const contactPayloadSchema = contactSchema.extend({
  website: z.string().max(0).optional().or(z.string()), // honeypot
  startedAt: z.number().int().positive(),
  source: z
    .object({
      cta: z.string().max(80).optional(),
      utm_source: z.string().max(120).optional(),
      utm_medium: z.string().max(120).optional(),
      utm_campaign: z.string().max(120).optional(),
      referrer: z.string().max(300).optional(),
      landing: z.string().max(300).optional(),
    })
    .optional(),
});

export type ContactPayload = z.infer<typeof contactPayloadSchema>;
