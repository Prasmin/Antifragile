import { test, expect } from "@playwright/test";

test.describe("Public Pages Navigation", () => {
  test("home page loads with hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Antifragile/i);
    // Hero text
    await expect(page.getByText("Return Home for")).toBeVisible();
    await expect(page.getByText("Thinking")).toBeVisible();
  });

  test("home page has Enter CTA link", async ({ page }) => {
    await page.goto("/");
    const enterLink = page.getByRole("link", { name: /enter/i });
    await expect(enterLink).toBeVisible();
    await expect(enterLink).toHaveAttribute("href", "/login");
  });

  test("navbar renders on public pages", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByAltText("Zeimus Vitruvian Man")).toBeVisible();
    await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(page.getByRole("link", { name: "About" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Blog" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Contact" })).toBeVisible();
  });

  test("about page loads", async ({ page }) => {
    await page.goto("/about");
    await expect(page).toHaveURL("/about");
  });

  test("contact page loads with form", async ({ page }) => {
    await page.goto("/contact");
    await expect(page).toHaveURL("/contact");
    // Contact form should have these fields
    await expect(page.getByPlaceholder(/name/i).first()).toBeVisible();
    await expect(page.getByPlaceholder(/email/i).first()).toBeVisible();
  });

  test("footer renders on public pages", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/copyright 2026/i)).toBeVisible();
  });

  test("navigation between public pages works", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL("/about");

    await page.getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL("/contact");

    await page.getByRole("link", { name: "Home" }).click();
    await expect(page).toHaveURL("/");
  });
});
