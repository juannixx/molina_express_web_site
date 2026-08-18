import { describe, it, expect } from "vitest";
import { validateField, validateStep } from "../../src/lib/validation";
import type { FieldRule } from "../../src/content/site";

const name: FieldRule = { name: "name", label: "Your name", type: "text", required: true };
const email: FieldRule = { name: "email", label: "Work email", type: "email", required: true };
const phone: FieldRule = { name: "phone", label: "Phone", type: "tel", required: true };
const source: FieldRule = { name: "source", label: "Source", type: "select", required: false };

describe("validateField", () => {
  it("rejects empty required field", () => {
    expect(validateField(name, "")).toBe("Your name is required");
    expect(validateField(name, "   ")).toBe("Your name is required");
  });
  it("accepts empty optional field", () => {
    expect(validateField(source, "")).toBeNull();
  });
  it("rejects malformed email", () => {
    expect(validateField(email, "not-an-email")).toBe("Enter a valid email");
    expect(validateField(email, "a@b.co")).toBeNull();
  });
  it("rejects malformed phone", () => {
    expect(validateField(phone, "abc")).toBe("Enter a valid phone number");
    expect(validateField(phone, "+44 7911 123456")).toBeNull();
    expect(validateField(phone, "07911123456")).toBeNull();
  });
});

describe("validateStep", () => {
  it("collects one error per invalid field", () => {
    const errors = validateStep([name, email], { name: "", email: "bad" });
    expect(errors).toEqual({ name: "Your name is required", email: "Enter a valid email" });
  });
  it("returns empty object when valid", () => {
    expect(validateStep([name], { name: "Ana" })).toEqual({});
  });
});
