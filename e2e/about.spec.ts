import { test, expect } from "@playwright/test";

test("About — verify story sections are rendered", async ({ page }) => {
	// Navigate to the About page
	const response = await page.goto("https://coffee-shop.avenceslau.workers.dev/about");
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify the OUR STORY heading is visible
	await expect(page.getByText("Our story")).toBeVisible();

	// Verify the 'The beans' section heading is present
	await expect(page.getByText("The beans")).toBeVisible();

	// Verify the 'The roast' section heading is present
	await expect(page.getByText("The roast")).toBeVisible();

	// Verify the 'The people' section heading is present
	await expect(page.getByText("The people")).toBeVisible();

	// Verify the main heading is visible
	await expect(page.getByRole("heading", { name: "Small shop, big beans." })).toBeVisible();

	// Click the Menu nav link to navigate away from About
	const nav = page.getByRole("navigation");
	const menuLink = nav.getByRole("link", { name: "Menu", exact: true });
	await expect(menuLink).toHaveAttribute("href", "/menu");
	await menuLink.click();
	await page.waitForURL(/\/menu/);
	await page.waitForLoadState("domcontentloaded");

	// Confirm navigation landed on the Menu page by checking the URL
	expect(page.url()).toContain("/menu");
});
