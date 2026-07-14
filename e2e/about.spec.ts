import { test, expect } from "@playwright/test";

const BASE_URL = "https://coffee-shop.avenceslau.workers.dev";

test("About — verify story and brand content", async ({ page }) => {
	// Navigate to the About page and assert HTTP 200
	const response = await page.goto(`${BASE_URL}/about`);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify the 'OUR STORY' section text is visible — the text is rendered in uppercase via CSS
	// but the DOM text is 'Our story', so match case-insensitively
	await expect(page.getByText("Our story", { exact: true })).toBeVisible();

	// Verify the main heading is visible
	await expect(page.getByRole("heading", { name: "Small shop, big beans." })).toBeVisible();

	// Verify the navigation bar is present with all main links
	const nav = page.getByRole("navigation");
	await expect(nav).toBeVisible();
	await expect(nav.getByRole("link", { name: "Home", exact: true })).toBeVisible();
	await expect(nav.getByRole("link", { name: "Menu", exact: true })).toBeVisible();
	await expect(nav.getByRole("link", { name: "About", exact: true })).toBeVisible();
	await expect(nav.getByRole("link", { name: "My orders", exact: true })).toBeVisible();
	await expect(nav.getByRole("link", { name: "Feedback", exact: true })).toBeVisible();

	// Verify 'The beans' section text is present
	await expect(page.getByText("The beans", { exact: true })).toBeVisible();

	// Verify 'The roast' section text is present
	await expect(page.getByText("The roast", { exact: true })).toBeVisible();

	// Verify 'The people' section text is present
	await expect(page.getByText("The people", { exact: true })).toBeVisible();

	// Verify section sub-headings / descriptors
	await expect(page.getByText("Traceable to the farm", { exact: true })).toBeVisible();
	await expect(page.getByText("Small batches, weekly", { exact: true })).toBeVisible();
	await expect(page.getByText("Ten baristas, one dog", { exact: true })).toBeVisible();

	// Verify CTA buttons are present
	await expect(page.getByRole("button", { name: "Order a drink" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Say hello" })).toBeVisible();

	// Verify footer
	await expect(page.getByRole("contentinfo")).toHaveText("© Bean & Brew — a demo app.");

	// Click the 'Menu' nav link to navigate away from About
	const menuLink = nav.getByRole("link", { name: "Menu", exact: true });
	await expect(menuLink).toHaveAttribute("href", "/menu");
	await menuLink.click();
	await page.waitForURL(`${BASE_URL}/menu`);
	await page.waitForLoadState("domcontentloaded");

	// Confirm navigation landed on the /menu page
	expect(page.url()).toContain("/menu");
	await expect(page.getByRole("heading", { name: "Menu" })).toBeVisible();
});
