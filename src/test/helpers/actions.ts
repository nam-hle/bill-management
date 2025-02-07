import { expect, type Page } from "@playwright/test";

export namespace Actions {
	export async function login(page: Page, emailName: string) {
		await page.goto("/login");

		await page.fill('input[name="email"]', `${emailName}@example.com`);
		await page.fill('input[name="password"]', DEFAULT_PASSWORD);

		await page.click('button[type="submit"]');
		await expect(page).toHaveURL("/");
	}

	export async function logout(page: Page) {
		await page.click(".chakra-avatar__root", { strict: true, timeout: 5000 });
		await page.getByRole("button", { name: "Sign out" }).click();

		await expect(page).toHaveURL("/login");
	}
}
