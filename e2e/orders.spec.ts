import { test, expect } from "@playwright/test";

const BASE_URL = "https://coffee-shop.avenceslau.workers.dev";

test("My Orders — empty state and navigate to Menu to start an order", async ({ page }) => {
	// Navigate to the My Orders page
	const response = await page.goto(`${BASE_URL}/orders`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify the 'My orders' heading is visible
	await expect(page.getByRole("heading", { name: "My orders", level: 2 })).toBeVisible();

	// Verify the empty-state alert message is shown
	const alert = page.getByRole("alert");
	await expect(alert).toBeVisible();
	await expect(alert).toContainText("No orders yet");
	await expect(alert).toContainText("You haven't placed any orders in this browser.");

	// Verify the 'Start an order' CTA link is visible and points to /menu
	const startOrderLink = page.getByRole("link", { name: "Start an order" });
	await expect(startOrderLink).toBeVisible();
	await expect(startOrderLink).toHaveAttribute("href", "/menu");

	// Click 'Start an order' to navigate to the Menu page
	await startOrderLink.click();
	await page.waitForURL(`${BASE_URL}/menu`);
	await page.waitForLoadState("domcontentloaded");

	// Confirm navigation landed on the /menu page
	expect(page.url()).toContain("/menu");
	await expect(page.getByRole("heading", { name: "Menu" })).toBeVisible();
});
