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
		await test.step(`Go to Notifications page`, async () => {
			await page.goto("/notifications");
		});
	}

	export async function goToTransactionsPage(page: Page) {
		await test.step(`Go to Transactions page`, async () => {
			await page.getByRole("link", { name: "Transactions" }).click();
		});
	}

	export async function goToBillsPage(page: Page) {
		await test.step(`Go to Bills page`, async () => {
			await page.getByRole("link", { name: "Bills" }).click();
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

	export namespace TransactionForm {
		export async function submit(page: Page) {
			await test.step("Submit transaction", async () => {
				await page.getByRole("main").getByRole("button", { name: "Create" }).click();
			});
		}

		export async function selectReceiver(page: Page, name: string) {
			await selectOption(page, "Receiver", name);
		}

		export async function fillAmount(page: Page, amount: string) {
			await fillInput(page, "amount", amount);
		}

		export async function fill(page: Page, params: { amount: string; receiver: string }) {
			await test.step(`Fill transaction form: receiver=${params.receiver}, amount= ${params.amount}`, async () => {
				await expect(page).toHaveURL("/transactions");

				await page.getByRole("link", { name: "New" }).click();

				await selectReceiver(page, params.receiver);
				await fillAmount(page, params.amount);

				await Actions.TransactionForm.submit(page);

				await expect(page).toHaveURL("/transactions");
			});
		}
	}

	export namespace BillForm {
		export async function edit(page: Page) {
			await test.step(`Edit bill`, async () => {
				await page.getByRole("button", { name: "Edit" }).click();
			});
		}

		export async function save(page: Page) {
			await test.step("Save bill", async () => {
				await page.getByRole("button", { name: "Done" }).click();
			});
		}

		export async function cancel(page: Page) {
			await test.step("Cancel changes", async () => {
				await page.getByRole("button", { name: "Cancel" }).click();
			});
		}

		export async function addDebtor(page: Page) {
			await test.step(`Add debtor`, async () => {
				await page.getByRole("button", { name: "Add debtor" }).click();
			});
		}

		export async function removeDebtor(page: Page, debtorIndex: number) {
			await test.step(`Remove debtor`, async () => {
				await page.getByRole("button", { name: "Delete" }).nth(debtorIndex).click();
			});
		}

		export async function fillDescription(page: Page, value: string) {
			await fillInput(page, "description", value);
		}

		export async function selectCreditor(page: Page, name: string) {
			await selectOption(page, "Creditor", name);
		}

		export async function fillCreditorAmount(page: Page, amount: string) {
			await fillInput(page, "creditor.amount", amount);
		}

		export async function selectDebtor(page: Page, debtorIndex: number, name: string) {
			await selectOption(page, `Debtor ${debtorIndex + 1}`, name);
		}

		export async function fillDebtorAmount(page: Page, debtorIndex: number, amount: string) {
			await fillInput(page, `debtors.${debtorIndex}.amount`, amount);
		}

		export interface FillParams {
			description: string;
			creditor: BillMember;
			debtors: BillMember[];
		}
		export async function fill(page: Page, params: { description: string; creditor: BillMember; debtors: BillMember[] }) {
			await test.step(`Fill bill form`, async () => {
				await expect(page).toHaveURL("/bills");

				// TODO: Move click outside this function
				await page.getByRole("link", { name: "New" }).click();

				await fillDescription(page, params.description);
				await selectCreditor(page, params.creditor.name);
				await fillCreditorAmount(page, params.creditor.amount);

				for (let debtorIndex = 0; debtorIndex < params.debtors.length; debtorIndex++) {
					if (debtorIndex > 0) {
						await addDebtor(page);
					}

					const debtor = params.debtors[debtorIndex];
					await selectDebtor(page, debtorIndex, debtor.name);
					await fillDebtorAmount(page, debtorIndex, debtor.amount);
				}
			});
		}
	}
}
