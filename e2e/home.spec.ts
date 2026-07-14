import { test, expect } from "@playwright/test";

const BASE_URL = "https://coffee-shop.avenceslau.workers.dev";

test("Homepage — verify hero content and navigate to Menu", async ({ page }) => {
	const response = await page.goto(`${BASE_URL}/`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify main heading
	await expect(
		page.getByRole("heading", { name: "Coffee, made slow. Served fast." }),
	).toBeVisible();

	// Verify Menu nav link exists
	const nav = page.getByRole("navigation");
	await expect(nav.getByRole("link", { name: "Menu", exact: true })).toBeVisible();

	// Verify feature headings
	await expect(page.getByRole("heading", { name: "Direct trade beans" })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Order ahead" })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Fresh pastries" })).toBeVisible();

	// Verify Visit us section
	await expect(page.getByRole("heading", { name: "Visit us" })).toBeVisible();

	// Click 'See the menu →' CTA
	await page.getByRole("link", { name: "See the menu →" }).click();
	await page.waitForURL(/\/menu/);
	await page.waitForLoadState("domcontentloaded");

	// Confirm we landed on the menu page
	expect(page.url()).toContain("/menu");
	await expect(page.getByRole("heading", { name: "Menu" })).toBeVisible();
});

test('Homepage — navigate to About via "About us" CTA', async ({ page }) => {
	const response = await page.goto(`${BASE_URL}/`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Click the 'About us' CTA button in the main content
	const main = page.getByRole("main");
	await main.getByRole("link", { name: "About us" }).click();
	await page.waitForURL(/\/about/);
	await page.waitForLoadState("domcontentloaded");

	// Confirm we landed on the about page — 'OUR STORY' is a text label, not a heading
	expect(page.url()).toContain("/about");
	await expect(page.getByRole("heading", { name: "Small shop, big beans." })).toBeVisible();
});

test("Global navigation — traverse all nav links from the homepage", async ({ page }) => {
	const response = await page.goto(`${BASE_URL}/`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Click 'About' nav link
	const nav = page.getByRole("navigation");
	await nav.getByRole("link", { name: "About", exact: true }).click();
	await page.waitForURL(/\/about/);
	await page.waitForLoadState("domcontentloaded");
	// 'OUR STORY' is a text label, not a heading — assert the actual h2 heading
	await expect(page.getByRole("heading", { name: "Small shop, big beans." })).toBeVisible();

	// Click 'My orders' nav link
	await page.getByRole("navigation").getByRole("link", { name: "My orders", exact: true }).click();
	await page.waitForURL(/\/orders/);
	await page.waitForLoadState("domcontentloaded");
	await expect(page.getByRole("heading", { name: "My orders" })).toBeVisible();

	// Click 'Feedback' nav link
	await page.getByRole("navigation").getByRole("link", { name: "Feedback", exact: true }).click();
	await page.waitForURL(/\/feedback/);
	await page.waitForLoadState("domcontentloaded");
	await expect(page.getByRole("heading", { name: "Send us feedback" })).toBeVisible();

	// Click the logo link to return to homepage
	await page.getByRole("link", { name: "☕ Bean & Brew" }).click();
	await page.waitForURL(/coffee-shop\.avenceslau\.workers\.dev\/?$/);
	await page.waitForLoadState("domcontentloaded");
	await expect(
		page.getByRole("heading", { name: "Coffee, made slow. Served fast." }),
	).toBeVisible();
});
