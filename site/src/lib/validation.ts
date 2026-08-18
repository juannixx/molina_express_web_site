import type { FieldRule } from "../content/site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s()-]{7,}$/;

export function validateField(rule: FieldRule, value: string): string | null {
  const v = value.trim();
  if (!v) return rule.required ? `${rule.label} is required` : null;
  if (rule.type === "email" && !EMAIL_RE.test(v)) return "Enter a valid email";
  if (rule.type === "tel" && !PHONE_RE.test(v)) return "Enter a valid phone number";
  return null;
}

export function validateStep(
  rules: FieldRule[],
  values: Record<string, string>,
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const rule of rules) {
    const error = validateField(rule, values[rule.name] ?? "");
    if (error) errors[rule.name] = error;
  }
  return errors;
}
