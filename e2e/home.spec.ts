import { test, expect } from "@playwright/test";

const BASE_URL = "https://coffee-shop.avenceslau.workers.dev";

test("Homepage — verify hero content and navigate to Menu", async ({ page }) => {
	const response = await page.goto(BASE_URL + "/");
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	await expect(
		page.getByRole("heading", { name: "Coffee, made slow. Served fast." }),
	).toBeVisible();
	await expect(page.getByText("Est. 2019 · Neighborhood roaster")).toBeVisible();
	await expect(page.getByRole("heading", { name: "Direct trade beans" })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Order ahead" })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Fresh pastries" })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Visit us" })).toBeVisible();

	await page.getByRole("link", { name: "See the menu →" }).click();
	await page.waitForURL(/\/menu/);
	await page.waitForLoadState("domcontentloaded");

	await expect(page.getByRole("heading", { name: "Menu" })).toBeVisible();
});

test("Homepage — navigate to About via CTA button", async ({ page }) => {
	const response = await page.goto(BASE_URL + "/");
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	await page.getByRole("link", { name: "About us" }).click();
	await page.waitForURL(/\/about/);
	await page.waitForLoadState("domcontentloaded");

	// "OUR STORY" is rendered as a styled text element, not a heading — assert by text
	await expect(page.getByText("Our story")).toBeVisible();
	await expect(page.getByRole("heading", { name: "Small shop, big beans." })).toBeVisible();
});

test("Global navigation — verify all nav links route to correct pages", async ({ page }) => {
	const response = await page.goto(BASE_URL + "/");
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	const nav = page.getByRole("navigation");

	// Navigate to Menu
	await nav.getByRole("link", { name: "Menu", exact: true }).click();
	await page.waitForURL(/\/menu/);
	await page.waitForLoadState("domcontentloaded");
	await expect(page.getByRole("heading", { name: "Menu" })).toBeVisible();

	// Navigate to About
	await nav.getByRole("link", { name: "About", exact: true }).click();
	await page.waitForURL(/\/about/);
	await page.waitForLoadState("domcontentloaded");
	// "OUR STORY" is a styled text element, not a heading
	await expect(page.getByText("Our story")).toBeVisible();
	await expect(page.getByRole("heading", { name: "Small shop, big beans." })).toBeVisible();

	// Navigate to My orders
	await nav.getByRole("link", { name: "My orders", exact: true }).click();
	await page.waitForURL(/\/orders/);
	await page.waitForLoadState("domcontentloaded");
	await expect(page.getByRole("heading", { name: "My orders" })).toBeVisible();

	// Navigate to Feedback
	await nav.getByRole("link", { name: "Feedback", exact: true }).click();
	await page.waitForURL(/\/feedback/);
	await page.waitForLoadState("domcontentloaded");
	await expect(page.getByRole("heading", { name: "Send us feedback" })).toBeVisible();

	// Navigate back home via logo
	await page.getByRole("banner").getByRole("link", { name: "☕ Bean & Brew" }).click();
	await page.waitForURL(/coffee-shop\.avenceslau\.workers\.dev\/?$/);
	await page.waitForLoadState("domcontentloaded");
	await expect(
		page.getByRole("heading", { name: "Coffee, made slow. Served fast." }),
	).toBeVisible();
});
