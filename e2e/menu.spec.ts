import { test, expect } from "@playwright/test";

const BASE_URL = "https://coffee-shop.avenceslau.workers.dev";
const MENU_URL = `${BASE_URL}/menu`;

test("Menu — browse items and open Latte customization page", async ({ page }) => {
	// Navigate to the Menu page and assert HTTP status
	const response = await page.goto(MENU_URL);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify the page heading 'Menu' is visible
	await expect(page.getByRole("heading", { name: "Menu", level: 2 })).toBeVisible();

	// Verify the Espresso item is listed
	await expect(page.getByText("Espresso", { exact: false }).first()).toBeVisible();

	// Verify the Cortado item is listed
	await expect(page.getByText("Cortado", { exact: false }).first()).toBeVisible();

	// Verify the Mocha item is listed
	await expect(page.getByText("Mocha", { exact: false }).first()).toBeVisible();

	// Click the Customize link for the Latte item
	const latteCustomizeLink = page.locator('a[href="/order?item=latte"]');
	await expect(latteCustomizeLink).toBeVisible();
	await latteCustomizeLink.click();

	// Confirm the URL changed to the Latte order/customization page
	await page.waitForURL(/order\?item=latte/);
	await page.waitForLoadState("domcontentloaded");
	expect(page.url()).toContain("/order?item=latte");
});

test("Menu — open Cold Brew customization page", async ({ page }) => {
	// Navigate to the Menu page and assert HTTP status
	const response = await page.goto(MENU_URL);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify the Cold Brew item is listed
	await expect(page.getByText("Cold Brew", { exact: false }).first()).toBeVisible();

	// Click the Customize link for the Cold Brew item
	const coldBrewCustomizeLink = page.locator('a[href="/order?item=cold-brew"]');
	await expect(coldBrewCustomizeLink).toBeVisible();
	await coldBrewCustomizeLink.click();

	// Confirm the URL changed to the Cold Brew order/customization page
	await page.waitForURL(/order\?item=cold-brew/);
	await page.waitForLoadState("domcontentloaded");
	expect(page.url()).toContain("/order?item=cold-brew");
});

test("Menu — page structure and navigation links", async ({ page }) => {
	const response = await page.goto(MENU_URL);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify the site logo/brand link
	await expect(page.getByRole("link", { name: "☕ Bean & Brew" })).toBeVisible();

	// Verify navigation links and their hrefs
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

	// Verify the footer text
	await expect(page.getByRole("contentinfo")).toHaveText("© Bean & Brew — a demo app.");
});

test("Menu — all drink items are listed with Customize links", async ({ page }) => {
	const response = await page.goto(MENU_URL);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify the subtitle text
	await expect(page.getByText("Pick a drink and customize it on the next page.")).toBeVisible();

	// Verify all eight drink items are present
	await expect(page.getByText("Espresso", { exact: false }).first()).toBeVisible();
	await expect(page.getByText("Cortado", { exact: false }).first()).toBeVisible();
	await expect(page.getByText("Flat White", { exact: false }).first()).toBeVisible();
	await expect(page.getByText("Latte", { exact: false }).first()).toBeVisible();
	await expect(page.getByText("Cappuccino", { exact: false }).first()).toBeVisible();
	await expect(page.getByText("Mocha", { exact: false }).first()).toBeVisible();
	await expect(page.getByText("Cold Brew", { exact: false }).first()).toBeVisible();
	await expect(page.getByText("Chai Latte", { exact: false }).first()).toBeVisible();

	// Verify all Customize links have correct hrefs
	await expect(page.locator('a[href="/order?item=espresso"]')).toBeVisible();
	await expect(page.locator('a[href="/order?item=cortado"]')).toBeVisible();
	await expect(page.locator('a[href="/order?item=flat-white"]')).toBeVisible();
	await expect(page.locator('a[href="/order?item=latte"]')).toBeVisible();
	await expect(page.locator('a[href="/order?item=cappuccino"]')).toBeVisible();
	await expect(page.locator('a[href="/order?item=mocha"]')).toBeVisible();
	await expect(page.locator('a[href="/order?item=cold-brew"]')).toBeVisible();
	await expect(page.locator('a[href="/order?item=chai"]')).toBeVisible();
});
