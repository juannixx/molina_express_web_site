import { test, expect, type Page } from "@playwright/test";

function trackConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

for (const path of ["/", "/drivers", "/fulfilment", "/thanks"]) {
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

test("fulfilment form reaches /thanks", async ({ page }) => {
  await page.goto("/fulfilment");
  const form = page.locator('[data-lead-form][data-kind="fulfilment"]');
  await form.scrollIntoViewIfNeeded();
  await form.locator('[name="name"]').fill("Test Buyer");
  await form.locator('[name="company"]').fill("Brand Co");
  await form.locator('[name="email"]').fill("ops@example.com");
  await form.locator('[name="phone"]').fill("07911123456");
  await form.getByRole("button", { name: "Continue" }).click();
  await form.locator('[name="pallets"]').fill("60");
  await form.locator('[name="orders_month"]').fill("2000");
  await form.locator('[name="items_per_order"]').fill("1.4");
  await form.locator('[name="channels"]').selectOption("Shopify");
  await form.getByRole("button", { name: "Request fulfilment quote" }).click();
  await page.waitForURL("**/thanks");
});

test("mobile menu opens and closes at 375px", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  const nav = page.getByRole("navigation", { name: "Main" });
  const menuToggle = nav.getByText("Menu", { exact: true });
  await expect(menuToggle).toBeVisible();

  const mobileLinks = nav.locator("details ul a");
  const firstMobileLink = mobileLinks.first();
  await expect(firstMobileLink).not.toBeVisible();

  await menuToggle.click();
  await expect(firstMobileLink).toBeVisible();

  await menuToggle.click();
  await expect(firstMobileLink).not.toBeVisible();
});

for (const path of ["/", "/drivers", "/fulfilment"]) {
  test(`no horizontal overflow at 360px on ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto(path);
    const overflow = await page.evaluate(() => {
      const el = document.scrollingElement!;
      return { scrollWidth: el.scrollWidth, clientWidth: el.clientWidth };
    });
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  });
}
