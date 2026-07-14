import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL || "https://coffee-shop.avenceslau.workers.dev";

test.describe("/orders page — Bean & Brew", () => {
	test("My Orders — empty state and redirect to menu", async ({ page }) => {
		// Navigate to the My Orders page and assert HTTP status
		const response = await page.goto(`${baseUrl}/orders`);
		expect(response?.status()).toBe(200);
		await page.waitForLoadState("domcontentloaded");

		// Verify the 'My orders' heading is visible
		await expect(page.getByRole("heading", { name: "My orders", level: 2 })).toBeVisible();

		// Verify the empty-state alert message is shown
		const alert = page.getByRole("alert");
		await expect(alert).toBeVisible();
		await expect(alert).toContainText("No orders yet");
		await expect(alert).toContainText("You haven't placed any orders in this browser.");

		// Verify the 'Start an order' link has the correct href before clicking
		const startOrderLink = page.getByRole("link", { name: "Start an order" });
		await expect(startOrderLink).toBeVisible();
		await expect(startOrderLink).toHaveAttribute("href", "/menu");

		// Click the 'Start an order' link and confirm navigation to /menu
		await startOrderLink.click();
		await page.waitForURL(`${baseUrl}/menu`);
		await page.waitForLoadState("domcontentloaded");

		// Confirm we landed on the menu page
		await expect(page.getByRole("heading", { name: "Menu" })).toBeVisible();
		expect(page.url()).toContain("/menu");
	});

	test("My Orders — page title and navigation chrome are correct", async ({ page }) => {
		const response = await page.goto(`${baseUrl}/orders`);
		expect(response?.status()).toBe(200);
		await page.waitForLoadState("domcontentloaded");

		// Verify the page title
		await expect(page).toHaveTitle("Bean & Brew — Coffee Shop");

		// Verify the site logo/brand link
		const brandLink = page.getByRole("link", { name: "☕ Bean & Brew" });
		await expect(brandLink).toBeVisible();
		await expect(brandLink).toHaveAttribute("href", "/");

		// Verify navigation links are present with correct hrefs
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

		// Verify footer text
		await expect(page.getByRole("contentinfo")).toContainText("© Bean & Brew — a demo app.");
	});
});
