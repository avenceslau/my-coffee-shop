import { test, expect } from "@playwright/test";

const BASE_URL = "https://coffee-shop.avenceslau.workers.dev";

test("Menu — browse items and open Latte customisation page", async ({ page }) => {
	const response = await page.goto(`${BASE_URL}/menu`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify the page heading 'Menu' is visible
	await expect(page.getByRole("heading", { name: "Menu", level: 2 })).toBeVisible();

	// Verify menu items are listed
	await expect(page.getByText("Espresso", { exact: true })).toBeVisible();
	await expect(page.getByText("Cortado", { exact: true })).toBeVisible();
	await expect(page.getByText("Cold Brew", { exact: true })).toBeVisible();

	// Click the Customize link for the Latte item
	const latteCustomizeLink = page.locator('a[href="/order?item=latte"]').first();
	await expect(latteCustomizeLink).toBeVisible();
	await latteCustomizeLink.click();

	await page.waitForURL(/order\?item=latte/);
	await page.waitForLoadState("domcontentloaded");

	expect(page.url()).toContain("/order?item=latte");
});

test("Menu — navigate to Espresso customisation page", async ({ page }) => {
	const response = await page.goto(`${BASE_URL}/menu`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify the page heading is visible before interacting
	await expect(page.getByRole("heading", { name: "Menu", level: 2 })).toBeVisible();

	// Click the Customize link for the Espresso item
	const espressoCustomizeLink = page.locator('a[href="/order?item=espresso"]').first();
	await expect(espressoCustomizeLink).toBeVisible();
	await espressoCustomizeLink.click();

	await page.waitForURL(/order\?item=espresso/);
	await page.waitForLoadState("domcontentloaded");

	expect(page.url()).toContain("/order?item=espresso");
});

test("Menu — navigate to Mocha customisation page", async ({ page }) => {
	const response = await page.goto(`${BASE_URL}/menu`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify the page heading is visible before interacting
	await expect(page.getByRole("heading", { name: "Menu", level: 2 })).toBeVisible();

	// Click the Customize link for the Mocha item
	const mochaCustomizeLink = page.locator('a[href="/order?item=mocha"]').first();
	await expect(mochaCustomizeLink).toBeVisible();
	await mochaCustomizeLink.click();

	await page.waitForURL(/order\?item=mocha/);
	await page.waitForLoadState("domcontentloaded");

	expect(page.url()).toContain("/order?item=mocha");
});

test("Menu — page structure and navigation links", async ({ page }) => {
	const response = await page.goto(`${BASE_URL}/menu`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify the brand logo/link
	await expect(page.getByRole("link", { name: "☕ Bean & Brew" })).toBeVisible();

	// Verify nav links have correct hrefs
	const nav = page.getByRole("navigation");
	await expect(nav.getByRole("link", { name: "Home", exact: true })).toHaveAttribute("href", "/");
	await expect(nav.getByRole("link", { name: "Menu", exact: true })).toHaveAttribute(
		"href",
		"/menu",
	);
	await expect(nav.getByRole("link", { name: "About", exact: true })).toHaveAttribute(
		"href",
		"/about",
	);
	await expect(nav.getByRole("link", { name: "My orders", exact: true })).toHaveAttribute(
		"href",
		"/orders",
	);
	await expect(nav.getByRole("link", { name: "Feedback", exact: true })).toHaveAttribute(
		"href",
		"/feedback",
	);

	// Verify footer
	await expect(page.getByRole("contentinfo")).toHaveText("© Bean & Brew — a demo app.");

	// Verify the subtitle text
	await expect(page.getByText("Pick a drink and customize it on the next page.")).toBeVisible();

	// Verify all 8 menu items are present
	const customizeLinks = page.locator('a[href^="/order?item="]');
	await expect(customizeLinks).toHaveCount(8);
});
