import { expect, type Page } from "@playwright/test";

import { DEFAULT_PASSWORD } from "@/test/constants";

export namespace Actions {
	export async function login(page: Page, emailName: string) {
		await page.goto("/login");

		await page.fill('input[name="email"]', `${emailName}@example.com`);
		await page.fill('input[name="password"]', DEFAULT_PASSWORD);

		await page.click('button[type="submit"]');
		await expect(page).toHaveURL("/");
	}

	export async function logout(page: Page) {
		await page.context().clearCookies();
		await page.reload();

		await expect(page).toHaveURL("/login");
	}

	export async function fillTransactionForm(page: Page, params: { amount: string; receiver: string }) {
		await expect(page).toHaveURL("/transactions");

		await page.getByRole("link", { name: "New" }).click();

		await page.getByRole("combobox", { name: "Receiver" }).click();
		await page.getByRole("option", { name: params.receiver }).click();

		await page.fill('input[name="amount"]', params.amount);

		await page.getByRole("main").getByRole("button", { name: "Create" }).click();

		await expect(page).toHaveURL("/transactions");
	}
}
