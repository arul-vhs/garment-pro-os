// Lightweight reusable validators. No external deps to keep bundle lean.
// Returns `string | null` — null means valid, string is a user-facing message.

export type Validator<T = string> = (v: T) => string | null;

const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
const PHONE_RE = /^\+?[0-9\s().-]{7,20}$/;
const SAFE_TEXT_RE = /<\s*script|javascript:|on\w+\s*=/i;

export const required = (msg = "This field is required."): Validator =>
  (v) => (v == null || String(v).trim() === "" ? msg : null);

export const minLen = (n: number, msg?: string): Validator =>
  (v) => (String(v ?? "").trim().length < n ? msg ?? `Must be at least ${n} characters.` : null);

export const maxLen = (n: number, msg?: string): Validator =>
  (v) => (String(v ?? "").length > n ? msg ?? `Must be ${n} characters or fewer.` : null);

export const email: Validator = (v) =>
  !v ? null : EMAIL_RE.test(String(v).trim()) ? null : "Enter a valid email address.";

export const phone: Validator = (v) =>
  !v ? null : PHONE_RE.test(String(v).trim()) ? null : "Enter a valid phone number.";

export const numeric: Validator = (v) =>
  v === "" || v == null ? null : Number.isFinite(Number(v)) ? null : "Must be a number.";

export const positive: Validator = (v) =>
  v === "" || v == null ? null : Number(v) > 0 ? null : "Must be greater than zero.";

export const safeText: Validator = (v) =>
  !v ? null : SAFE_TEXT_RE.test(String(v)) ? "Input contains disallowed characters." : null;

export function compose(...vs: Array<Validator | null | undefined>): Validator {
  return (v) => {
    for (const fn of vs) {
      if (!fn) continue;
      const r = fn(v);
      if (r) return r;
    }
    return null;
  };
}

export function validateAll<T extends Record<string, unknown>>(
  values: T,
  rules: Partial<Record<keyof T, Validator>>,
): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {};
  (Object.keys(rules) as Array<keyof T>).forEach((k) => {
    const fn = rules[k];
    if (!fn) return;
    const msg = fn(values[k] as string);
    if (msg) errors[k] = msg;
  });
  return errors;
}

// Sanitize a string for safe display / external URL embedding.
export function sanitize(s: string, maxLength = 500): string {
  return String(s ?? "").replace(/[<>]/g, "").slice(0, maxLength).trim();
}
