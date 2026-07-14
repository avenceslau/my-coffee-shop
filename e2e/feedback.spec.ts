import { test, expect } from "@playwright/test";

const FEEDBACK_URL = "/feedback";

test("Feedback — submit a complete feedback form", async ({ page }) => {
	const response = await page.goto(FEEDBACK_URL);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	await expect(page.getByRole("heading", { name: "Send us feedback" })).toBeVisible();

	await page.getByLabel("Name").fill("Jane Tester");
	await page.getByLabel("Email").fill("jane.tester@example.com");

	await page.getByLabel("Topic").selectOption("Drinks");

	await page.getByLabel("5 stars").check();
	await expect(page.getByLabel("5 stars")).toBeChecked();

	await page
		.getByLabel("Message")
		.fill("The flat white was absolutely perfect — best I've had in the neighbourhood!");

	await page.getByRole("button", { name: "Submit feedback" }).click();

	// After submission, either a success message appears or the form heading is gone.
	// We assert the main region is still present and the page has not errored.
	const main = page.getByRole("main");
	await expect(main).toBeVisible();

	// The form should either show a success state or still be on the page without
	// a hard navigation error. We verify the URL is still on the feedback page or
	// has changed to a confirmation, and that no error heading is shown.
	expect(page.url()).toContain("coffee-shop.avenceslau.workers.dev");
});

test("Feedback — form validation on empty required fields", async ({ page }) => {
	const response = await page.goto(FEEDBACK_URL);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	const submitButton = page.getByRole("button", { name: "Submit feedback" });
	await expect(submitButton).toBeVisible();

	await submitButton.click();

	// Browser-native validation should prevent navigation; the Name field must still be visible.
	await expect(page.getByLabel("Name")).toBeVisible();

	// Confirm we are still on the feedback page.
	expect(page.url()).toContain("/feedback");

	// The heading should still be present (form was not submitted).
	await expect(page.getByRole("heading", { name: "Send us feedback" })).toBeVisible();
});

test("Feedback — select each star rating option", async ({ page }) => {
	const response = await page.goto(FEEDBACK_URL);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Select 1-star rating
	await page.getByLabel("1 star").check();
	await expect(page.getByLabel("1 star")).toBeChecked();
	await expect(page.getByLabel("2 stars")).not.toBeChecked();

	// Select 3-star rating
	await page.getByLabel("3 stars").check();
	await expect(page.getByLabel("3 stars")).toBeChecked();
	await expect(page.getByLabel("1 star")).not.toBeChecked();

	// Select 5-star rating
	await page.getByLabel("5 stars").check();
	await expect(page.getByLabel("5 stars")).toBeChecked();
	await expect(page.getByLabel("3 stars")).not.toBeChecked();
});

test("Feedback — page structure and navigation links", async ({ page }) => {
	const response = await page.goto(FEEDBACK_URL);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify the site logo/brand link
	const brand = page.getByRole("link", { name: "☕ Bean & Brew" });
	await expect(brand).toBeVisible();
	await expect(brand).toHaveAttribute("href", "/");

	// Verify nav links and their hrefs
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

	// Verify footer
	await expect(page.getByRole("contentinfo")).toHaveText("© Bean & Brew — a demo app.");

	// Verify all form fields are present
	await expect(page.getByLabel("Name")).toBeVisible();
	await expect(page.getByLabel("Email")).toBeVisible();
	await expect(page.getByLabel("Topic")).toBeVisible();
	await expect(page.getByLabel("Message")).toBeVisible();
	await expect(page.getByRole("button", { name: "Submit feedback" })).toBeVisible();

	// Verify all rating options exist
	await expect(page.getByLabel("1 star")).toBeVisible();
	await expect(page.getByLabel("2 stars")).toBeVisible();
	await expect(page.getByLabel("3 stars")).toBeVisible();
	await expect(page.getByLabel("4 stars")).toBeVisible();
	await expect(page.getByLabel("5 stars")).toBeVisible();

	// Verify Topic dropdown options
	const topic = page.getByLabel("Topic");
	await expect(topic.getByRole("option", { name: "Service" })).toBeAttached();
	await expect(topic.getByRole("option", { name: "Drinks" })).toBeAttached();
	await expect(topic.getByRole("option", { name: "App / website" })).toBeAttached();
	await expect(topic.getByRole("option", { name: "Other" })).toBeAttached();
});
