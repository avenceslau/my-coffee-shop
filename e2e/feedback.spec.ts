import { test, expect } from "@playwright/test";

const baseUrl = process.env.BASE_URL || "https://coffee-shop.avenceslau.workers.dev";

test.describe("Feedback page", () => {
	test("Feedback — submit a complete feedback form", async ({ page }) => {
		const response = await page.goto(`${baseUrl}/feedback`);
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
		const response = await page.goto(`${baseUrl}/feedback`);
		expect(response?.status()).toBe(200);
		await page.waitForLoadState("domcontentloaded");

		// Attempt to submit the form without filling any fields
		await page.getByRole("button", { name: "Submit feedback" }).click();

		// Verify the Name field is marked as required / invalid
		const nameField = page.getByLabel("Name");
		await expect(nameField).toBeVisible();
		await expect(nameField).toHaveAttribute("required", "");

		// Verify the Email field is marked as required / invalid
		const emailField = page.getByLabel("Email");
		await expect(emailField).toBeVisible();
		await expect(emailField).toHaveAttribute("required", "");

		// Verify the Message field is marked as required / invalid
		const messageField = page.getByLabel("Message");
		await expect(messageField).toBeVisible();
		await expect(messageField).toHaveAttribute("required", "");

		// Confirm we are still on the feedback page (form was not submitted)
		expect(page.url()).toContain("/feedback");
	});

	test("Feedback — page structure and navigation links are correct", async ({ page }) => {
		const response = await page.goto(`${baseUrl}/feedback`);
		expect(response?.status()).toBe(200);
		await page.waitForLoadState("domcontentloaded");

		// Verify the page title / brand
		await expect(page.getByRole("heading", { name: "☕ Bean & Brew", level: 1 })).toBeVisible();

		// Verify navigation links have correct hrefs
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
		const response = await page.goto(`${baseUrl}/feedback`);
		expect(response?.status()).toBe(200);
		await page.waitForLoadState("domcontentloaded");

		// Verify all form fields are visible
		await expect(page.getByLabel("Name")).toBeVisible();
		await expect(page.getByLabel("Email")).toBeVisible();
		await expect(page.getByLabel("Topic")).toBeVisible();
		await expect(page.getByLabel("Message")).toBeVisible();

		// Verify Topic dropdown has expected options
		const topicSelect = page.getByLabel("Topic");
		await expect(topicSelect).toBeVisible();
		await expect(topicSelect.getByRole("option", { name: "Service" })).toBeAttached();
		await expect(topicSelect.getByRole("option", { name: "Drinks" })).toBeAttached();
		await expect(topicSelect.getByRole("option", { name: "App / website" })).toBeAttached();
		await expect(topicSelect.getByRole("option", { name: "Other" })).toBeAttached();

		// Verify rating radio buttons are present
		const radioGroup = page.getByRole("radiogroup");
		await expect(radioGroup.getByLabel("1 star")).toBeVisible();
		await expect(radioGroup.getByLabel("2 stars")).toBeVisible();
		await expect(radioGroup.getByLabel("3 stars")).toBeVisible();
		await expect(radioGroup.getByLabel("4 stars")).toBeVisible();
		await expect(radioGroup.getByLabel("5 stars")).toBeVisible();

		// Verify 5 stars is checked by default
		await expect(radioGroup.getByLabel("5 stars")).toBeChecked();

		// Verify submit button is present
		await expect(page.getByRole("button", { name: "Submit feedback" })).toBeVisible();
	});
});
