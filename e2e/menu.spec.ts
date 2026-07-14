import { test, expect } from "@playwright/test";

const BASE_URL = "https://coffee-shop.avenceslau.workers.dev";

test("Menu — browse items and open Latte customisation page", async ({ page }) => {
	const response = await page.goto(`${BASE_URL}/menu`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify the Menu page heading is visible
	await expect(page.getByRole("heading", { name: "Menu", level: 2 })).toBeVisible();

	// Verify Espresso item is listed (exact match to avoid strict mode violation)
	await expect(page.getByText("Espresso", { exact: true })).toBeVisible();

	// Verify Cortado item is listed
	await expect(page.getByText("Cortado", { exact: true })).toBeVisible();

	// Verify Latte item is listed
	await expect(page.getByText("Latte", { exact: true })).toBeVisible();

	// Click the Customize link for the Latte item
	const latteCustomizeLink = page.locator('a[href="/order?item=latte"]');
	await latteCustomizeLink.click();
	await page.waitForURL(/order\?item=latte/);
	await page.waitForLoadState("domcontentloaded");

	// Confirm the URL contains the latte order query parameter
	expect(page.url()).toContain("item=latte");
});

test("Menu — customize a Cortado (popular item)", async ({ page }) => {
	const response = await page.goto(`${BASE_URL}/menu`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify the Cortado item is listed and marked as POPULAR
	await expect(page.getByText("Cortado", { exact: true })).toBeVisible();
	await expect(page.getByText("Popular", { exact: true })).toBeVisible();

	// Click the Customize link for the Cortado item
	const cortadoCustomizeLink = page.locator('a[href="/order?item=cortado"]');
	await cortadoCustomizeLink.click();
	await page.waitForURL(/order\?item=cortado/);
	await page.waitForLoadState("domcontentloaded");

	// Confirm the URL contains the cortado order query parameter
	expect(page.url()).toContain("item=cortado");
});

test("Menu — customize a Cold Brew (iced item)", async ({ page }) => {
	const response = await page.goto(`${BASE_URL}/menu`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify the Cold Brew item is listed
	await expect(page.getByText("Cold Brew", { exact: true })).toBeVisible();

	// Verify the Iced badge is shown
	await expect(page.getByText("Iced", { exact: true })).toBeVisible();

	// Click the Customize link for the Cold Brew item
	const coldBrewCustomizeLink = page.locator('a[href="/order?item=cold-brew"]');
	await coldBrewCustomizeLink.click();
	await page.waitForURL(/order\?item=cold-brew/);
	await page.waitForLoadState("domcontentloaded");

	// Confirm the URL contains the cold-brew order query parameter
	expect(page.url()).toContain("item=cold-brew");
});

test("Menu — page structure: nav links and footer", async ({ page }) => {
	const response = await page.goto(`${BASE_URL}/menu`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify brand link
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
});

test("Menu — all eight drink items are listed", async ({ page }) => {
	const response = await page.goto(`${BASE_URL}/menu`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify all eight drinks are present using exact match to avoid strict mode violations
	await expect(page.getByText("Espresso", { exact: true })).toBeVisible();
	await expect(page.getByText("Cortado", { exact: true })).toBeVisible();
	await expect(page.getByText("Flat White", { exact: true })).toBeVisible();
	await expect(page.getByText("Latte", { exact: true })).toBeVisible();
	await expect(page.getByText("Cappuccino", { exact: true })).toBeVisible();
	await expect(page.getByText("Mocha", { exact: true })).toBeVisible();
	await expect(page.getByText("Cold Brew", { exact: true })).toBeVisible();
	await expect(page.getByText("Chai Latte", { exact: true })).toBeVisible();

	// Verify all eight Customize links exist
	const customizeLinks = page.getByRole("link", { name: "Customize" });
	await expect(customizeLinks).toHaveCount(8);
});

test("Menu — Customize links have correct hrefs for all items", async ({ page }) => {
	const response = await page.goto(`${BASE_URL}/menu`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	const expectedHrefs = [
		"/order?item=espresso",
		"/order?item=cortado",
		"/order?item=flat-white",
		"/order?item=latte",
		"/order?item=cappuccino",
		"/order?item=mocha",
		"/order?item=cold-brew",
		"/order?item=chai",
	];

	for (const href of expectedHrefs) {
		await expect(page.locator(`a[href="${href}"]`)).toBeVisible();
	}
});
