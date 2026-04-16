import { test, expect } from "@playwright/test";

test.describe("Auth Guard - Protected Routes", () => {
  test("unauthenticated user is redirected from /dashboard to /login", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    // Middleware should redirect to /login
    await expect(page).toHaveURL(/\/login/);
  });

  test("unauthenticated user is redirected from /dashboard/journal to /login", async ({
    page,
  }) => {
    await page.goto("/dashboard/journal");
    await expect(page).toHaveURL(/\/login/);
  });

  test("unauthenticated user is redirected from /dashboard/barbell to /login", async ({
    page,
  }) => {
    await page.goto("/dashboard/barbell");
    await expect(page).toHaveURL(/\/login/);
  });

  test("unauthenticated user is redirected from /dashboard/setting to /login", async ({
    page,
  }) => {
    await page.goto("/dashboard/setting");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login page loads without redirect for unauthenticated user", async ({
    page,
  }) => {
    await page.goto("/login");
    await expect(page).toHaveURL("/login");
  });

  test("public routes remain accessible", async ({ page }) => {
    // These should NOT redirect
    for (const route of ["/", "/about", "/blog", "/contact"]) {
      await page.goto(route);
      await expect(page).toHaveURL(route);
    }
  });
});
