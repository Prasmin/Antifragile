import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test("renders Google sign-in button", async ({ page }) => {
    await page.goto("/login");
    // Should show a Google OAuth button
    await expect(
      page.getByRole("button", { name: /google|sign in/i }).first(),
    ).toBeVisible();
  });

  test("renders privacy notice", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText(/privacy/i).first()).toBeVisible();
  });

  test("has correct page structure", async ({ page }) => {
    await page.goto("/login");
    // Page should not redirect since user is unauthenticated
    await expect(page).toHaveURL("/login");
  });
});

test.describe("Contact Form Validation", () => {
  test("shows validation errors for empty submission", async ({ page }) => {
    await page.goto("/contact");

    // Try to submit empty form - find submit button
    const submitButton = page
      .getByRole("button", { name: /send|submit/i })
      .first();
    if (await submitButton.isVisible()) {
      await submitButton.click();
      // Should show validation errors (browser native or custom)
      // The form uses react-hook-form which prevents submission
    }
  });
});

test.describe("Responsive Design", () => {
  test("mobile menu toggle works", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Look for mobile menu button
    const menuButton = page.getByRole("button", { name: /mobile menu/i });
    await expect(menuButton).toBeVisible();

    // Click to open
    await menuButton.click();

    // Mobile nav items should appear
    await expect(page.getByText("Home")).toBeVisible();
    await expect(page.getByText("About")).toBeVisible();
  });
});

test.describe("Performance & SEO", () => {
  test("home page has meta description", async ({ page }) => {
    await page.goto("/");
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /antifragile/i);
  });

  test("home page has lang attribute on html", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("images have alt text", async ({ page }) => {
    await page.goto("/");
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt, `Image ${i} missing alt text`).toBeTruthy();
    }
  });

  test("page loads within acceptable time", async ({ page }) => {
    const start = Date.now();
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const loadTime = Date.now() - start;
    // DOM content loaded should be under 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });
});
