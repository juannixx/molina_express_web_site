import { test, expect, type Page } from "@playwright/test";

function trackConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

for (const path of ["/", "/drivers", "/thanks"]) {
  test(`${path} renders without console errors`, async ({ page }) => {
    const errors = trackConsoleErrors(page);
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("quote form walks two steps to /thanks", async ({ page }) => {
  await page.goto("/");
  const form = page.locator('[data-lead-form][data-kind="quote"]');
  await form.scrollIntoViewIfNeeded();

  await form.getByRole("button", { name: "Continue" }).click();
  await expect(form.locator('[data-error-for="name"]')).toBeVisible();

  await form.locator('[name="name"]').fill("Test Person");
  await form.locator('[name="company"]').fill("Test Co");
  await form.locator('[name="email"]').fill("test@example.com");
  await form.locator('[name="phone"]').fill("07911123456");
  await form.getByRole("button", { name: "Continue" }).click();

  await form.locator('[name="volume"]').fill("40");
  await form.locator('[name="pickup_area"]').fill("Ipswich");
  await form.getByRole("button", { name: "Request quote" }).click();

  await page.waitForURL("**/thanks");
  await expect(page.locator("h1")).toContainText("Got it");
});

test("driver form reaches /thanks", async ({ page }) => {
  await page.goto("/drivers");
  const form = page.locator('[data-lead-form][data-kind="driver"]');
  await form.scrollIntoViewIfNeeded();
  await form.locator('[name="name"]').fill("Test Driver");
  await form.locator('[name="email"]').fill("driver@example.com");
  await form.locator('[name="phone"]').fill("07911123456");
  await form.getByRole("button", { name: "Continue" }).click();
  await form.locator('[name="right_to_work"]').selectOption("Yes");
  await form.locator('[name="licence_years"]').fill("5");
  await form.locator('[name="preferred_area"]').selectOption("Suffolk");
  await form.locator('[name="availability"]').fill("5");
  await form.getByRole("button", { name: "Send application" }).click();
  await page.waitForURL("**/thanks");
});
