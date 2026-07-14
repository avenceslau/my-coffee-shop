import { test, expect } from "@playwright/test";

test("My Orders — empty state and redirect to menu", async ({ page }) => {
	// Navigate to the My Orders page
	const response = await page.goto("/orders");
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify the 'My orders' page heading is visible
	await expect(page.getByRole("heading", { name: "My orders", level: 2 })).toBeVisible();

	// Verify the empty-state alert text is displayed
	const alert = page.getByRole("alert");
	await expect(alert).toBeVisible();
	await expect(alert).toContainText("No orders yet");
	await expect(alert).toContainText("You haven't placed any orders in this browser.");

	// Verify the 'Start an order' link points to /menu before clicking
	const startOrderLink = page.getByRole("link", { name: "Start an order" });
	await expect(startOrderLink).toBeVisible();
	await expect(startOrderLink).toHaveAttribute("href", "/menu");

	// Click the 'Start an order' link and confirm navigation to the Menu page
	await startOrderLink.click();
	await page.waitForURL(/\/menu/);
	await page.waitForLoadState("domcontentloaded");

	// Confirm navigation landed on the Menu page
	await expect(page.getByRole("heading", { name: "Menu" })).toBeVisible();
});
