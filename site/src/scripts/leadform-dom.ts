import { createStepper } from "../lib/stepper";
import { leadProvider } from "../lib/leads";
import type { FormStep } from "../content/site";

for (const form of document.querySelectorAll<HTMLFormElement>("[data-lead-form]")) {
  const kind = form.dataset.kind as "quote" | "driver" | "fulfilment";
  const steps: FormStep[] = JSON.parse(form.querySelector("[data-lead-steps]")!.textContent!);
  const stepper = createStepper(steps, (fields) => leadProvider.submitLead({ kind, fields }));

  const fieldsets = form.querySelectorAll<HTMLFieldSetElement>("[data-step]");
  const backBtn = form.querySelector<HTMLButtonElement>("[data-back]")!;
  const nextBtn = form.querySelector<HTMLButtonElement>("[data-next]")!;
  const submitBtn = form.querySelector<HTMLButtonElement>("[data-submit]")!;
  const indicator = form.querySelector<HTMLElement>("[data-step-indicator]")!;
  const formError = form.querySelector<HTMLElement>("[data-form-error]")!;

  form.addEventListener("input", (e) => {
    const t = e.target as HTMLInputElement | HTMLSelectElement;
    if (t.name) stepper.setValue(t.name, t.value);
    render();
  });

  function render() {
    const { step, errors, status } = stepper.getState();
    fieldsets.forEach((fs, i) => fs.classList.toggle("hidden", i !== step));
    backBtn.classList.toggle("hidden", step === 0);
    nextBtn.classList.toggle("hidden", step === steps.length - 1);
    submitBtn.classList.toggle("hidden", step !== steps.length - 1);
    submitBtn.disabled = status === "submitting";
    indicator.textContent = `Step ${step + 1} of ${steps.length}`;
    formError.classList.toggle("hidden", status !== "error");
    for (const p of form.querySelectorAll<HTMLElement>("[data-error-for]")) {
      const msg = errors[p.dataset.errorFor!];
      p.textContent = msg ?? "";
      p.classList.toggle("hidden", !msg);
      const field = form.querySelector<HTMLElement>(`[name="${p.dataset.errorFor}"]`);
      if (field) {
        if (msg) field.setAttribute("aria-invalid", "true");
        else field.removeAttribute("aria-invalid");
      }
    }
  }

  function focusFirstError() {
    const { errors } = stepper.getState();
    const firstError = Object.keys(errors)[0];
    if (firstError) form.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus();
  }

  backBtn.addEventListener("click", () => { stepper.back(); render(); });
  nextBtn.addEventListener("click", () => {
    stepper.next();
    render();
    focusFirstError();
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await stepper.submit();
    render();
    if (stepper.getState().status === "done") window.location.href = `${import.meta.env.BASE_URL.replace(/\/+$/, "")}/thanks`;
    else focusFirstError();
  });
}
