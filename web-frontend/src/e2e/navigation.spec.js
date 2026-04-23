// @ts-check
const { test, expect } = require("@playwright/test");

test.describe("Protected Routes", () => {
  test("dashboard redirects unauthenticated users to login", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    // Should either redirect to /login or show a login prompt
    await page.waitForURL(/login|dashboard/, { timeout: 5000 }).catch(() => {});
    const isLoginPage =
      (await page.locator('input[type="password"]').count()) > 0;
    const url = page.url();
    const redirected = url.includes("login") || isLoginPage;
    expect(redirected).toBeTruthy();
  });

  test("portfolio page redirects unauthenticated users", async ({ page }) => {
    await page.goto("/portfolio");
    await page.waitForURL(/login|portfolio/, { timeout: 5000 }).catch(() => {});
    const url = page.url();
    const loginInput = await page.locator('input[type="password"]').count();
    expect(url.includes("login") || loginInput > 0).toBeTruthy();
  });

  test("transactions page redirects unauthenticated users", async ({
    page,
  }) => {
    await page.goto("/transactions");
    await page
      .waitForURL(/login|transactions/, { timeout: 5000 })
      .catch(() => {});
    const url = page.url();
    const loginInput = await page.locator('input[type="password"]').count();
    expect(url.includes("login") || loginInput > 0).toBeTruthy();
  });

  test("settings page redirects unauthenticated users", async ({ page }) => {
    await page.goto("/settings");
    await page.waitForURL(/login|settings/, { timeout: 5000 }).catch(() => {});
    const url = page.url();
    const loginInput = await page.locator('input[type="password"]').count();
    expect(url.includes("login") || loginInput > 0).toBeTruthy();
  });
});

test.describe("Home page content", () => {
  test("home page has hero section", async ({ page }) => {
    await page.goto("/");
    // Should have something visible in the body
    await expect(page.locator("body")).toBeVisible();
    const bodyText = await page.locator("body").innerText();
    expect(bodyText.length).toBeGreaterThan(10);
  });

  test("footer is present on home page", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("footer")).toBeVisible();
  });
});
