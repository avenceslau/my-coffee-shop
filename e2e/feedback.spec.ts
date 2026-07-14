import { test, expect } from "@playwright/test";

const FEEDBACK_URL = "https://coffee-shop.avenceslau.workers.dev/feedback";

test("Feedback — submit a complete feedback form successfully", async ({ page }) => {
	const response = await page.goto(FEEDBACK_URL);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify the feedback form heading is visible
	await expect(page.getByRole("heading", { name: "Send us feedback" })).toBeVisible();

	// Fill in the Name field
	await page.getByLabel("Name").fill("Jane Tester");

	// Fill in the Email field
	await page.getByLabel("Email").fill("jane.tester@example.com");

	// Select the 'Drinks' topic option from the combobox
	await page.getByLabel("Topic").selectOption("Drinks");

	// Select 5-star rating
	await page.getByLabel("5 stars").check();

	// Fill in the Message field
	await page
		.getByLabel("Message")
		.fill("The cold brew is absolutely fantastic — best in the neighbourhood!");

	// Submit the feedback form
	await page.getByRole("button", { name: "Submit feedback" }).click();

	// Verify a success confirmation is shown after submission
	await expect(page.getByText(/thank/i)).toBeVisible();
});

test("Feedback — validate required fields prevent empty submission", async ({ page }) => {
	const response = await page.goto(FEEDBACK_URL);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify the Submit feedback button is present
	const submitButton = page.getByRole("button", { name: "Submit feedback" });
	await expect(submitButton).toBeVisible();

	// Attempt to submit the form without filling any fields
	await submitButton.click();

	// Verify the Name field is still visible (form not submitted — browser validation prevents it)
	await expect(page.getByLabel("Name")).toBeVisible();

	// Verify the page URL has not changed away from /feedback
	expect(page.url()).toContain("/feedback");
});

test("Feedback — page structure and navigation links", async ({ page }) => {
	const response = await page.goto(FEEDBACK_URL);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify the brand logo link
	const brandLink = page.getByRole("link", { name: "☕ Bean & Brew" });
	await expect(brandLink).toBeVisible();
	await expect(brandLink).toHaveAttribute("href", "/");

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

	// Verify footer text
	await expect(page.getByRole("contentinfo")).toHaveText("© Bean & Brew — a demo app.");
});

test("Feedback — form fields and default values are rendered correctly", async ({ page }) => {
	const response = await page.goto(FEEDBACK_URL);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify all form fields are present
	await expect(page.getByLabel("Name")).toBeVisible();
	await expect(page.getByLabel("Email")).toBeVisible();
	await expect(page.getByLabel("Topic")).toBeVisible();
	await expect(page.getByLabel("Message")).toBeVisible();

	// Verify Topic combobox has 'Service' selected by default
	// The actual option value is lowercase 'service' even though the label shows 'Service'
	await expect(page.getByLabel("Topic")).toHaveValue("service");

	// Verify 5 stars is checked by default
	await expect(page.getByLabel("5 stars")).toBeChecked();

	// Verify all rating options are present
	await expect(page.getByLabel("1 star")).toBeVisible();
	await expect(page.getByLabel("2 stars")).toBeVisible();
	await expect(page.getByLabel("3 stars")).toBeVisible();
	await expect(page.getByLabel("4 stars")).toBeVisible();
	await expect(page.getByLabel("5 stars")).toBeVisible();

	// Verify submit button is present
	await expect(page.getByRole("button", { name: "Submit feedback" })).toBeVisible();
});
