import { test, expect } from "@playwright/test";

const BASE_URL = "https://coffee-shop.avenceslau.workers.dev";

test("Homepage — verify hero content and navigate to Menu", async ({ page }) => {
	const response = await page.goto(BASE_URL + "/");
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	await expect(
		page.getByRole("heading", { name: "Coffee, made slow. Served fast." }),
	).toBeVisible();
	await expect(page.getByRole("heading", { name: "Direct trade beans" })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Order ahead" })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Fresh pastries" })).toBeVisible();
	await expect(page.getByRole("heading", { name: "Visit us" })).toBeVisible();

	await page.getByRole("link", { name: "See the menu →" }).click();
	await page.waitForURL(/\/menu/);
	await page.waitForLoadState("domcontentloaded");

	await expect(page.getByRole("heading", { name: "Menu" })).toBeVisible();
});

test("Homepage — navigate to About via hero CTA", async ({ page }) => {
	const response = await page.goto(BASE_URL + "/");
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	await page.getByRole("main").getByRole("link", { name: "About us" }).click();
	await page.waitForURL(/\/about/);
	await page.waitForLoadState("domcontentloaded");

	// "OUR STORY" is rendered as a text label, not a heading — assert the h2 heading instead
	await expect(page.getByRole("heading", { name: "Small shop, big beans." })).toBeVisible();
});

test("Homepage — global nav links are all reachable", async ({ page }) => {
	const response = await page.goto(BASE_URL + "/");
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	const nav = page.getByRole("navigation");

	const homeLink = nav.getByRole("link", { name: "Home", exact: true });
	await expect(homeLink).toBeVisible();
	await expect(homeLink).toHaveAttribute("href", "/");

	const menuLink = nav.getByRole("link", { name: "Menu", exact: true });
	await expect(menuLink).toBeVisible();
	await expect(menuLink).toHaveAttribute("href", "/menu");

	const aboutLink = nav.getByRole("link", { name: "About", exact: true });
	await expect(aboutLink).toBeVisible();
	await expect(aboutLink).toHaveAttribute("href", "/about");

	const ordersLink = nav.getByRole("link", { name: "My orders", exact: true });
	await expect(ordersLink).toBeVisible();
	await expect(ordersLink).toHaveAttribute("href", "/orders");

	const feedbackLink = nav.getByRole("link", { name: "Feedback", exact: true });
	await expect(feedbackLink).toBeVisible();
	await expect(feedbackLink).toHaveAttribute("href", "/feedback");

	await page.getByRole("banner").getByRole("link", { name: "☕ Bean & Brew" }).click();
	await page.waitForURL(/coffee-shop\.avenceslau\.workers\.dev\/?$/);
	await page.waitForLoadState("domcontentloaded");

	await expect(
		page.getByRole("heading", { name: "Coffee, made slow. Served fast." }),
	).toBeVisible();
});
