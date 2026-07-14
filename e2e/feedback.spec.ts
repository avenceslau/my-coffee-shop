import { test, expect } from "@playwright/test";

const FEEDBACK_URL = "/feedback";

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

	// Select the 'Drinks' topic option
	await page.getByLabel("Topic").selectOption("Drinks");

	// Select 5-star rating (it is already checked by default, but explicitly select it)
	await page.getByRole("radio", { name: "5 stars" }).check();

	// Fill in the Message field
	await page
		.getByLabel("Message")
		.fill("The cold brew is absolutely fantastic — best I've had in the neighbourhood!");

	// Submit the feedback form
	await page.getByRole("button", { name: "Submit feedback" }).click();

	// The screenshot shows "Thanks! Your feedback was submitted." as the success message
	await expect(page.getByText("Thanks!")).toBeVisible({ timeout: 15000 });
	await expect(page.getByText("Your feedback was submitted.")).toBeVisible({ timeout: 15000 });
});

test("Feedback — validate required fields prevent empty submission", async ({ page }) => {
	const response = await page.goto(FEEDBACK_URL);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Attempt to submit the form without filling in any fields
	await page.getByRole("button", { name: "Submit feedback" }).click();

	// Verify the Name field is marked as invalid (HTML5 required validation)
	const nameInput = page.getByLabel("Name");
	await expect(nameInput).toBeVisible();
	await expect(nameInput).toHaveAttribute("required", /.*/);
	const nameValid = await nameInput.evaluate((el) => (el as HTMLInputElement).validity.valid);
	expect(nameValid).toBe(false);

	// Verify the Email field is marked as invalid
	const emailInput = page.getByLabel("Email");
	await expect(emailInput).toBeVisible();
	await expect(emailInput).toHaveAttribute("required", /.*/);
	const emailValid = await emailInput.evaluate((el) => (el as HTMLInputElement).validity.valid);
	expect(emailValid).toBe(false);

	// Verify the Message field is marked as invalid
	const messageInput = page.getByLabel("Message");
	await expect(messageInput).toBeVisible();
	await expect(messageInput).toHaveAttribute("required", /.*/);
	const messageValid = await messageInput.evaluate(
		(el) => (el as HTMLTextAreaElement).validity.valid,
	);
	expect(messageValid).toBe(false);
});

test("Feedback — page structure and navigation links are correct", async ({ page }) => {
	const response = await page.goto(FEEDBACK_URL);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Verify the site logo/brand link
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

test("Feedback — form fields and controls are present and functional", async ({ page }) => {
	const response = await page.goto(FEEDBACK_URL);
	expect(response?.status()).toBe(200);
	await page.waitForLoadState("domcontentloaded");

	// Name and Email text inputs are visible
	await expect(page.getByLabel("Name")).toBeVisible();
	await expect(page.getByLabel("Email")).toBeVisible();

	// Topic combobox has expected options
	const topicSelect = page.getByLabel("Topic");
	await expect(topicSelect).toBeVisible();
	await expect(topicSelect.getByRole("option", { name: "Service" })).toBeAttached();
	await expect(topicSelect.getByRole("option", { name: "Drinks" })).toBeAttached();
	await expect(topicSelect.getByRole("option", { name: "App / website" })).toBeAttached();
	await expect(topicSelect.getByRole("option", { name: "Other" })).toBeAttached();

	// Rating radio buttons are all visible
	const radioGroup = page.getByRole("radiogroup");
	await expect(radioGroup.getByRole("radio", { name: "1 star" })).toBeVisible();
	await expect(radioGroup.getByRole("radio", { name: "2 stars" })).toBeVisible();
	await expect(radioGroup.getByRole("radio", { name: "3 stars" })).toBeVisible();
	await expect(radioGroup.getByRole("radio", { name: "4 stars" })).toBeVisible();
	await expect(radioGroup.getByRole("radio", { name: "5 stars" })).toBeVisible();

	// 5 stars is checked by default
	await expect(radioGroup.getByRole("radio", { name: "5 stars" })).toBeChecked();

	// Message textarea is visible
	await expect(page.getByLabel("Message")).toBeVisible();

	// Submit button is visible
	await expect(page.getByRole("button", { name: "Submit feedback" })).toBeVisible();
});
