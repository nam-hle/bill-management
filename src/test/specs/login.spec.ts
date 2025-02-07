import { expect } from "@playwright/test";

import { test } from "@/test/setup";
import { seedUser } from "@/test/functions/seed-user";

test("Login should fail with incorrect credentials", async ({ page }) => {
	await page.goto("/");

	await expect(page).toHaveURL("/login");

	await page.fill('input[name="email"]', "harry@example.com");
	await page.fill('input[name="password"]', DEFAULT_PASSWORD);

	await page.click('button[type="submit"]');

	const errorMessage = page.locator(".chakra-alert__root");

	await expect(errorMessage).toBeVisible();

	await expect(errorMessage).toHaveText("Invalid login credentials");

	await seedUser({ email: "harry", fullName: "Harry Potter" });

	await page.click('button[type="submit"]');

	await expect(page).toHaveURL("/");

	const balanceHeader = page.locator("h1").first();
	await expect(balanceHeader).toBeVisible();
	await expect(balanceHeader).toHaveText("Balance");
});
