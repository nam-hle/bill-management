import { expect, type Page } from "@playwright/test";

import { test } from "@/test/setup";
import { DEFAULT_PASSWORD } from "@/test/constants";

export namespace Actions {
	export async function goToHomePage(page: Page) {
		await test.step(`Go to Home page`, async () => {
			await page.goto("/");
		});
	}

	export async function goToNotificationsPage(page: Page) {
		await test.step(`Go to Home page`, async () => {
			await page.goto("/notifications");
		});
	}

	export async function goToTransactionsPage(page: Page) {
		await test.step(`Go to Transactions page`, async () => {
			await page.getByRole("button", { name: "Transactions" }).click();
		});
	}

	export async function login(page: Page, emailName: string) {
		await test.step(`Login as ${emailName}`, async () => {
			await page.goto("/login");

			await page.fill('input[name="email"]', `${emailName}@example.com`);
			await page.fill('input[name="password"]', DEFAULT_PASSWORD);

			await page.click('button[type="submit"]');
			await expect(page).toHaveURL("/");
		});
	}

	export async function logout(page: Page) {
		await test.step(`Logout`, async () => {
			await page.context().clearCookies();
			await page.reload();

			await expect(page).toHaveURL("/login");
		});
	}

	export async function fillTransactionForm(page: Page, params: { amount: string; receiver: string }) {
		await test.step(`Fill transaction form: receiver=${params.receiver}, amount= ${params.amount}`, async () => {
			await expect(page).toHaveURL("/transactions");

			await page.getByRole("link", { name: "New" }).click();

			await page.getByRole("combobox", { name: "Receiver" }).click();
			await page.getByRole("option", { name: params.receiver }).click();

			await page.fill('input[name="amount"]', params.amount);

			await page.getByRole("main").getByRole("button", { name: "Create" }).click();

			await expect(page).toHaveURL("/transactions");
		});
	}
}
