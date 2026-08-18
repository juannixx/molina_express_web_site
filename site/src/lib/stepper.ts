import type { FormStep } from "../content/site";
import { validateStep } from "./validation";

export interface StepperState {
  step: number;
  values: Record<string, string>;
  errors: Record<string, string>;
  status: "editing" | "submitting" | "done" | "error";
}

export function createStepper(
  steps: FormStep[],
  submitFn: (values: Record<string, string>) => Promise<{ ok: boolean; error?: string }>,
) {
  const state: StepperState = { step: 0, values: {}, errors: {}, status: "editing" };

  function validateCurrent(): boolean {
    state.errors = validateStep(steps[state.step].fields, state.values);
    return Object.keys(state.errors).length === 0;
  }

  return {
    getState: (): StepperState => state,
    setValue(name: string, value: string) {
      state.values[name] = value;
      delete state.errors[name];
    },
    next() {
      if (state.step >= steps.length - 1) return;
      if (validateCurrent()) state.step += 1;
    },
    back() {
      if (state.step > 0) state.step -= 1;
      state.errors = {};
    },
    async submit() {
      if (!validateCurrent()) return;
      state.status = "submitting";
      const result = await submitFn({ ...state.values });
      state.status = result.ok ? "done" : "error";
    },
  };
}
