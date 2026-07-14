import { test, expect } from "@playwright/test";

const BASE_URL = "https://coffee-shop.avenceslau.workers.dev";

test("About — verify story content and navigation links", async ({ page }) => {
	const response = await page.goto(`${BASE_URL}/about`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify 'OUR STORY' section text is visible
	await expect(page.getByText("Our story", { exact: false })).toBeVisible();

	// Verify the main heading
	await expect(page.getByRole("heading", { name: "Small shop, big beans." })).toBeVisible();

	// Verify 'The beans' section
	await expect(page.getByText("The beans", { exact: false })).toBeVisible();

	// Verify 'The roast' section
	await expect(page.getByText("The roast", { exact: false })).toBeVisible();

	// Verify 'The people' section
	await expect(page.getByText("The people", { exact: false })).toBeVisible();

	// Click 'Order a drink' CTA and verify navigation to /menu
	const orderLink = page.getByRole("link", { name: "Order a drink", exact: true });
	await expect(orderLink).toBeVisible();
	await orderLink.click();
	await page.waitForURL(/\/menu/);
	await page.waitForLoadState("domcontentloaded");
	expect(page.url()).toContain("/menu");
});

test('About — navigate to Feedback via "Say hello" link', async ({ page }) => {
	const response = await page.goto(`${BASE_URL}/about`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify the 'Say hello' link is present and has the correct href
	const sayHelloLink = page.getByRole("link", { name: "Say hello", exact: true });
	await expect(sayHelloLink).toBeVisible();
	await expect(sayHelloLink).toHaveAttribute("href", "/feedback");

	// Click 'Say hello' and verify navigation to /feedback
	await sayHelloLink.click();
	await page.waitForURL(/\/feedback/);
	await page.waitForLoadState("domcontentloaded");
	expect(page.url()).toContain("/feedback");

	// Confirm we landed on the feedback page by checking for a stable heading
	await expect(page.getByRole("heading", { name: "Send us feedback" })).toBeVisible();
});

test("About — nav links have correct hrefs", async ({ page }) => {
	const response = await page.goto(`${BASE_URL}/about`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

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
});

test("About — footer is visible", async ({ page }) => {
	const response = await page.goto(`${BASE_URL}/about`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	await expect(page.getByRole("contentinfo")).toContainText("© Bean & Brew — a demo app.");
});
