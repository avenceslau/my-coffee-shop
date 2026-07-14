import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL || "https://coffee-shop.avenceslau.workers.dev";

test.describe("Menu page", () => {
	test("Menu — browse items and open Latte customization", async ({ page }) => {
		const response = await page.goto(`${baseUrl}/menu`);
		expect(response?.status()).toBe(200);
		await page.waitForLoadState("domcontentloaded");

		// Verify the Menu page heading is visible
		await expect(page.getByRole("heading", { name: "Menu", level: 2 })).toBeVisible();

		// Verify the subtitle text
		await expect(page.getByText("Pick a drink and customize it on the next page.")).toBeVisible();

		// Verify Espresso menu item is listed
		await expect(page.getByText("Espresso").first()).toBeVisible();

		// Verify Cortado menu item is listed
		await expect(page.getByText("Cortado").first()).toBeVisible();

		// Verify Mocha menu item is listed
		await expect(page.getByText("Mocha").first()).toBeVisible();

		// Click the Customize link for the Latte item
		const latteCustomizeLink = page.locator('a[href="/order?item=latte"]');
		await expect(latteCustomizeLink).toBeVisible();
		await latteCustomizeLink.click();

		await page.waitForURL(/item=latte/);
		await page.waitForLoadState("domcontentloaded");

		expect(page.url()).toContain("item=latte");
	});

	test("Menu — navigate to Espresso customization page", async ({ page }) => {
		const response = await page.goto(`${baseUrl}/menu`);
		expect(response?.status()).toBe(200);
		await page.waitForLoadState("domcontentloaded");

		// Verify the page loaded correctly
		await expect(page.getByRole("heading", { name: "Menu", level: 2 })).toBeVisible();

		// Click the Customize link for the Espresso item
		const espressoCustomizeLink = page.locator('a[href="/order?item=espresso"]');
		await expect(espressoCustomizeLink).toBeVisible();
		await espressoCustomizeLink.click();

		await page.waitForURL(/item=espresso/);
		await page.waitForLoadState("domcontentloaded");

		expect(page.url()).toContain("item=espresso");
	});

	test("Menu — navigate to Cold Brew customization page", async ({ page }) => {
		const response = await page.goto(`${baseUrl}/menu`);
		expect(response?.status()).toBe(200);
		await page.waitForLoadState("domcontentloaded");

		// Verify the page loaded correctly
		await expect(page.getByRole("heading", { name: "Menu", level: 2 })).toBeVisible();

		// Verify Cold Brew item is listed with its badge
		await expect(page.getByText("Cold Brew").first()).toBeVisible();

		// Click the Customize link for the Cold Brew item
		const coldBrewCustomizeLink = page.locator('a[href="/order?item=cold-brew"]');
		await expect(coldBrewCustomizeLink).toBeVisible();
		await coldBrewCustomizeLink.click();

		await page.waitForURL(/item=cold-brew/);
		await page.waitForLoadState("domcontentloaded");

		expect(page.url()).toContain("item=cold-brew");
	});

	test("Menu — page structure: nav links and footer", async ({ page }) => {
		const response = await page.goto(`${baseUrl}/menu`);
		expect(response?.status()).toBe(200);
		await page.waitForLoadState("domcontentloaded");

		// Verify brand logo/link
		await expect(page.getByRole("link", { name: "☕ Bean & Brew" })).toBeVisible();

		// Verify navigation links
		const nav = page.getByRole("navigation");
		await expect(nav.getByRole("link", { name: "Home", exact: true })).toBeVisible();
		await expect(nav.getByRole("link", { name: "Menu", exact: true })).toBeVisible();
		await expect(nav.getByRole("link", { name: "About", exact: true })).toBeVisible();
		await expect(nav.getByRole("link", { name: "My orders", exact: true })).toBeVisible();
		await expect(nav.getByRole("link", { name: "Feedback", exact: true })).toBeVisible();

		// Verify footer
		await expect(page.getByRole("contentinfo")).toHaveText("© Bean & Brew — a demo app.");
	});

	test("Menu — all eight drink items are listed", async ({ page }) => {
		const response = await page.goto(`${baseUrl}/menu`);
		expect(response?.status()).toBe(200);
		await page.waitForLoadState("domcontentloaded");

		// Verify all eight drinks appear on the page
		await expect(page.getByText("Espresso").first()).toBeVisible();
		await expect(page.getByText("Cortado").first()).toBeVisible();
		await expect(page.getByText("Flat White").first()).toBeVisible();
		await expect(page.getByText("Latte").first()).toBeVisible();
		await expect(page.getByText("Cappuccino").first()).toBeVisible();
		await expect(page.getByText("Mocha").first()).toBeVisible();
		await expect(page.getByText("Cold Brew").first()).toBeVisible();
		await expect(page.getByText("Chai Latte").first()).toBeVisible();

		// Verify all eight Customize links are present
		const customizeLinks = page.getByRole("link", { name: "Customize" });
		await expect(customizeLinks).toHaveCount(8);
	});

	test("Menu — Customize link hrefs point to correct order query params", async ({ page }) => {
		const response = await page.goto(`${baseUrl}/menu`);
		expect(response?.status()).toBe(200);
		await page.waitForLoadState("domcontentloaded");

		await expect(page.locator('a[href="/order?item=espresso"]')).toBeVisible();
		await expect(page.locator('a[href="/order?item=cortado"]')).toBeVisible();
		await expect(page.locator('a[href="/order?item=flat-white"]')).toBeVisible();
		await expect(page.locator('a[href="/order?item=latte"]')).toBeVisible();
		await expect(page.locator('a[href="/order?item=cappuccino"]')).toBeVisible();
		await expect(page.locator('a[href="/order?item=mocha"]')).toBeVisible();
		await expect(page.locator('a[href="/order?item=cold-brew"]')).toBeVisible();
		await expect(page.locator('a[href="/order?item=chai"]')).toBeVisible();
	});
});
