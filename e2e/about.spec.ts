import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL || "https://coffee-shop.avenceslau.workers.dev";

test("About — verify story and navigation structure", async ({ page }) => {
	const response = await page.goto(`${baseUrl}/about`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify 'OUR STORY' section text is present
	await expect(page.getByText("Our story", { exact: false })).toBeVisible();

	// Verify the main heading
	await expect(page.getByRole("heading", { name: "Small shop, big beans." })).toBeVisible();

	// Verify 'The beans' section
	await expect(page.getByText("The beans", { exact: false })).toBeVisible();
	await expect(page.getByText("Traceable to the farm", { exact: false })).toBeVisible();

	// Verify 'The roast' section
	await expect(page.getByText("The roast", { exact: false })).toBeVisible();
	await expect(page.getByText("Small batches, weekly", { exact: false })).toBeVisible();

	// Verify 'The people' section
	await expect(page.getByText("The people", { exact: false })).toBeVisible();
	await expect(page.getByText("Ten baristas, one dog", { exact: false })).toBeVisible();

	// Click the 'Order a drink' CTA link
	await page.getByRole("link", { name: "Order a drink" }).click();
	await page.waitForURL(`${baseUrl}/menu`);
	await page.waitForLoadState("domcontentloaded");

	// Confirm navigation landed on /menu
	expect(page.url()).toContain("/menu");
	await expect(page.getByRole("heading", { name: "Menu" })).toBeVisible();
});

test('About — navigate to Feedback via "Say hello" CTA', async ({ page }) => {
	const response = await page.goto(`${baseUrl}/about`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify we are on the About page before clicking
	await expect(page.getByText("Small shop, big beans.")).toBeVisible();

	// Click the 'Say hello' CTA link
	await page.getByRole("link", { name: "Say hello" }).click();
	await page.waitForURL(`${baseUrl}/feedback`);
	await page.waitForLoadState("domcontentloaded");

	// Confirm navigation landed on /feedback
	expect(page.url()).toContain("/feedback");
	await expect(page.getByRole("heading", { name: "Send us feedback" })).toBeVisible();
});

test("About — nav links have correct hrefs", async ({ page }) => {
	const response = await page.goto(`${baseUrl}/about`);
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

test("About — footer and brand link are present", async ({ page }) => {
	const response = await page.goto(`${baseUrl}/about`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Brand logo/link in banner
	await expect(page.getByRole("link", { name: "☕ Bean & Brew" })).toBeVisible();
	await expect(page.getByRole("link", { name: "☕ Bean & Brew" })).toHaveAttribute("href", "/");

	// Footer copyright
	await expect(page.getByRole("contentinfo")).toContainText("© Bean & Brew — a demo app.");
});
