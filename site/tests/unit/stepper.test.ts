import { describe, it, expect, vi } from "vitest";
import { createStepper } from "../../src/lib/stepper";
import type { FormStep } from "../../src/content/site";

const steps: FormStep[] = [
  { title: "About you", fields: [{ name: "name", label: "Your name", type: "text", required: true }] },
  { title: "Details", fields: [{ name: "volume", label: "Volume", type: "text", required: true }] },
];

describe("createStepper", () => {
  it("starts at step 0 editing", () => {
    const s = createStepper(steps, async () => ({ ok: true }));
    expect(s.getState()).toMatchObject({ step: 0, status: "editing", errors: {} });
  });

  it("blocks next() while the current step is invalid", () => {
    const s = createStepper(steps, async () => ({ ok: true }));
    s.next();
    expect(s.getState().step).toBe(0);
    expect(s.getState().errors.name).toBe("Your name is required");
  });

  it("advances when valid and clears errors", () => {
    const s = createStepper(steps, async () => ({ ok: true }));
    s.setValue("name", "Ana");
    s.next();
    expect(s.getState()).toMatchObject({ step: 1, errors: {} });
  });

  it("back() returns without losing values", () => {
    const s = createStepper(steps, async () => ({ ok: true }));
    s.setValue("name", "Ana");
    s.next();
    s.back();
    expect(s.getState().step).toBe(0);
    expect(s.getState().values.name).toBe("Ana");
  });

  it("submit validates the last step and calls the provider", async () => {
    const submitFn = vi.fn(async () => ({ ok: true }));
    const s = createStepper(steps, submitFn);
    s.setValue("name", "Ana");
    s.next();
    s.setValue("volume", "40");
    await s.submit();
    expect(submitFn).toHaveBeenCalledWith({ name: "Ana", volume: "40" });
    expect(s.getState().status).toBe("done");
  });

  it("submit with invalid step does not call the provider", async () => {
    const submitFn = vi.fn(async () => ({ ok: true }));
    const s = createStepper(steps, submitFn);
    s.setValue("name", "Ana");
    s.next();
    await s.submit();
    expect(submitFn).not.toHaveBeenCalled();
    expect(s.getState().status).toBe("editing");
  });

  it("provider failure sets status error", async () => {
    const s = createStepper(steps, async () => ({ ok: false, error: "boom" }));
    s.setValue("name", "Ana");
    s.next();
    s.setValue("volume", "40");
    await s.submit();
    expect(s.getState().status).toBe("error");
  });
});
