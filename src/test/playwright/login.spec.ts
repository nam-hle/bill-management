import { test, expect } from "@playwright/test";

import { deleteUser, createTestUser } from "@/test/seeds/user";

test("Login should fail with incorrect credentials", async ({ page }) => {
	await page.goto("/");

	await expect(page).toHaveURL("/login");

	await page.fill('input[name="email"]', "harry@example.com");
	await page.fill('input[name="password"]', "123456");

	await page.click('button[type="submit"]');

	const errorMessage = page.locator(".chakra-alert__root");

	await expect(errorMessage).toBeVisible();

	await expect(errorMessage).toHaveText("Invalid login credentials");

	const userId = await createTestUser();

	await page.click('button[type="submit"]');

	await expect(page).toHaveURL("/");

	const balanceHeader = page.locator("h1").first();
	await expect(balanceHeader).toBeVisible();
	await expect(balanceHeader).toHaveText("Balance");

	await deleteUser(userId);
});
