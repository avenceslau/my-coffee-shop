import { test, expect } from "@playwright/test";

test("My Orders — empty state and redirect to Menu", async ({ page }) => {
	// Navigate to the My Orders page
	const response = await page.goto("/orders");
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify the 'My orders' heading is visible
	await expect(page.getByRole("heading", { name: "My orders", level: 2 })).toBeVisible();

	// Verify the empty-state alert message is displayed
	const alert = page.getByRole("alert");
	await expect(alert).toBeVisible();
	await expect(alert).toContainText("No orders yet");
	await expect(alert).toContainText("You haven't placed any orders in this browser.");

	// Click the 'Start an order' link/button to go to the menu
	const startOrderLink = page.getByRole("link", { name: "Start an order" });
	await expect(startOrderLink).toBeVisible();
	await startOrderLink.click();

	// Confirm navigation landed on the /menu page
	await page.waitForURL(/\/menu/);
	await page.waitForLoadState("domcontentloaded");
	expect(page.url()).toContain("/menu");

	// Verify the Menu heading is present on the destination page
	await expect(page.getByRole("heading", { name: "Menu" })).toBeVisible();
});
