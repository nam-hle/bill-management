import { expect, type Page } from "@playwright/test";

import { test } from "@/test/setup";
import { type BillMember, DEFAULT_PASSWORD } from "@/test/utils";

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

	export async function goToBillsPage(page: Page) {
		await test.step(`Go to Bills page`, async () => {
			await page.getByRole("button", { name: "Bills" }).click();
		});
	}

	export async function login(page: Page, emailName: string) {
		await test.step(`Login as ${emailName}`, async () => {
			await page.goto("/login");

			await fillInput(page, "email", `${emailName}@example.com`);
			await fillInput(page, "password", DEFAULT_PASSWORD);

			await submit(page);
			await expect(page).toHaveURL("/");
		});
	}

	// TODO: Use sign out feature
	export async function logout(page: Page) {
		await test.step(`Logout`, async () => {
			await page.context().clearCookies();
			await page.reload();

			await expect(page).toHaveURL("/login");
		});
	}

	export async function selectOption(page: Page, label: string, option: string) {
		await test.step(`Select ${option} in ${label}`, async () => {
			await page.getByRole("combobox", { name: label }).click();
			await page.getByRole("option", { name: option }).click();
		});
	}

	export async function fillInput(page: Page, name: string, value: string) {
		await test.step(`Fill ${name} with ${value}`, async () => {
			await page.fill(`input[name="${name}"]`, value);
		});
	}

	export async function submit(page: Page) {
		await test.step("Submit", async () => {
			await page.locator(`button[type="submit"]`).click();
		});
	}

	export async function fillTransactionForm(page: Page, params: { amount: string; receiver: string }) {
		await test.step(`Fill transaction form: receiver=${params.receiver}, amount= ${params.amount}`, async () => {
			await expect(page).toHaveURL("/transactions");

			await page.getByRole("link", { name: "New" }).click();

			await selectOption(page, "Receiver", params.receiver);
			await fillInput(page, "amount", params.amount);

			await page.getByRole("main").getByRole("button", { name: "Create" }).click();

			await expect(page).toHaveURL("/transactions");
		});
	}

	export interface FillBillFormParams {
		description: string;
		creditor: BillMember;
		debtors: BillMember[];
	}
	export async function fillBillForm(page: Page, params: { description: string; creditor: BillMember; debtors: BillMember[] }) {
		await test.step(`Fill bill form`, async () => {
			await expect(page).toHaveURL("/bills");

			await page.getByRole("link", { name: "New" }).click();

			await fillInput(page, "description", params.description);
			await selectOption(page, "Creditor", params.creditor.name);
			await fillInput(page, "creditor.amount", params.creditor.amount);

			for (let debtorIndex = 0; debtorIndex < params.debtors.length; debtorIndex++) {
				if (debtorIndex > 0) {
					await page.getByRole("button", { name: "Add debtor" }).click();
				}

				const debtor = params.debtors[debtorIndex];
				await selectOption(page, `Debtor ${debtorIndex + 1}`, debtor.name);
				await fillInput(page, `debtors.${debtorIndex}.amount`, debtor.amount);
			}
		});
	}
}
