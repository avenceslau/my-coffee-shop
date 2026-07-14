import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL || "https://coffee-shop.avenceslau.workers.dev";

test("Homepage — verify hero content and navigate to Menu", async ({ page }) => {
	const response = await page.goto(`${baseUrl}/`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify main heading
	await expect(
		page.getByRole("heading", { name: "Coffee, made slow. Served fast." }),
	).toBeVisible();

	// Verify feature sections
	await expect(page.getByRole("heading", { name: "Direct trade beans" })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Order ahead" })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Fresh pastries" })).toBeVisible();

	// Verify Visit us section
	await expect(page.getByRole("heading", { name: "Visit us" })).toBeVisible();
	await expect(page.getByText("221B Bean Street, Roasterville")).toBeVisible();

	// Click the CTA and navigate to menu
	await page.getByRole("link", { name: "See the menu →" }).click();
	await page.waitForURL(`${baseUrl}/menu`);
	await page.waitForLoadState("domcontentloaded");

	expect(page.url()).toContain("/menu");
	await expect(page.getByRole("heading", { name: "Menu" })).toBeVisible();
});

test("Homepage — navigate to About via CTA button", async ({ page }) => {
	const response = await page.goto(`${baseUrl}/`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Click the About us CTA button (scoped to main to avoid nav link collision)
	await page.getByRole("main").getByRole("link", { name: "About us" }).click();
	await page.waitForURL(`${baseUrl}/about`);
	await page.waitForLoadState("domcontentloaded");

	expect(page.url()).toContain("/about");
	// "OUR STORY" is rendered as styled text, not a heading — assert visible text instead
	await expect(page.getByText("Our story")).toBeVisible();
	await expect(page.getByRole("heading", { name: "Small shop, big beans." })).toBeVisible();
});

test("Global navigation — verify all nav links reach correct pages", async ({ page }) => {
	const response = await page.goto(`${baseUrl}/`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	const nav = page.getByRole("navigation");

	// Navigate to Menu
	await nav.getByRole("link", { name: "Menu", exact: true }).click();
	await page.waitForURL(`${baseUrl}/menu`);
	await page.waitForLoadState("domcontentloaded");
	expect(page.url()).toContain("/menu");
	await expect(page.getByRole("heading", { name: "Menu" })).toBeVisible();

	// Navigate to About
	await page.getByRole("navigation").getByRole("link", { name: "About", exact: true }).click();
	await page.waitForURL(`${baseUrl}/about`);
	await page.waitForLoadState("domcontentloaded");
	expect(page.url()).toContain("/about");
	// "OUR STORY" is styled text, not a heading — assert the actual h2 heading instead
	await expect(page.getByRole("heading", { name: "Small shop, big beans." })).toBeVisible();

	// Navigate to My orders
	await page.getByRole("navigation").getByRole("link", { name: "My orders", exact: true }).click();
	await page.waitForURL(`${baseUrl}/orders`);
	await page.waitForLoadState("domcontentloaded");
	expect(page.url()).toContain("/orders");
	await expect(page.getByRole("heading", { name: "My orders" })).toBeVisible();

	// Navigate to Feedback
	await page.getByRole("navigation").getByRole("link", { name: "Feedback", exact: true }).click();
	await page.waitForURL(`${baseUrl}/feedback`);
	await page.waitForLoadState("domcontentloaded");
	expect(page.url()).toContain("/feedback");
	await expect(page.getByRole("heading", { name: "Send us feedback" })).toBeVisible();

	// Navigate back to Home
	await page.getByRole("navigation").getByRole("link", { name: "Home", exact: true }).click();
	await page.waitForURL(`${baseUrl}/`);
	await page.waitForLoadState("domcontentloaded");
	expect(page.url()).toMatch(new RegExp(`${baseUrl}/?$`));
	await expect(
		page.getByRole("heading", { name: "Coffee, made slow. Served fast." }),
	).toBeVisible();
});
