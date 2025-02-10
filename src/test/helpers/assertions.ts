import { expect, type Page } from "@playwright/test";

import { test } from "@/test/setup";
import { Locators } from "@/test/helpers/locators";
import { type TableLocator } from "@/test/locators/table-locator";

export namespace Assertions {
	const StateLabels = ["Owed", "Received", "Paid", "Sent", "Net Balance"] as const;
	export async function assertStats(page: Page, expected: Partial<Record<(typeof StateLabels)[number], string>>) {
		await test.step("Assert Stats", async () => {
			for (const label of StateLabels) {
				await expect(Locators.locateStatValue(page, label)).toHaveText(expected[label] ?? "0");
			}
		});
	}

	export async function assertNotificationsTable(page: Page, params: { messages: string[] }) {
		await test.step("Assert Notifications Table", async () => {
			const messages = page.getByTestId("table").getByTestId("notification-text");

			await expect(messages).toHaveCount(params.messages.length);

			for (let i = 0; i < params.messages.length; i++) {
				await expect(messages.nth(i)).toHaveText(params.messages[i]);
			}
		});
	}

	export async function assertTransactionsTable(
		table: TableLocator,
		params: {
			heading?: string;
			pagination?: null | { totalPages: number; currentPage: number };
			rows: { sender: string; amount: string; status: string; action?: string; receiver: string; issuedAt?: string }[];
		}
	) {
		await table.waitForLoading();

		await test.step("Assert Transactions Table", async () => {
			if (params.heading) {
				await expect(table.getHeading()).toHaveText(params.heading);
			}

			if (params.pagination !== undefined) {
				const pagination = table.getContainer().locator(`[aria-label="pagination"]`);

				if (params.pagination === null) {
					await expect(pagination).not.toBeVisible();
				} else {
					await expect(pagination).toBeVisible();
					await expect(pagination.locator(`[aria-label$="page ${params.pagination.currentPage}"][aria-current="page"]`)).toBeVisible();
					await expect(pagination.locator(`[aria-label="last page, page ${params.pagination.totalPages}"]`)).toBeVisible();
				}
			}

			for (let rowIndex = 0; rowIndex < params.rows.length; rowIndex++) {
				await test.step(`Assert Transaction row index ${rowIndex}`, async () => {
					const row = params.rows[rowIndex];
					await table.getRow(rowIndex).getCell("Sender").assertEqual(row.sender);
					await table.getRow(rowIndex).getCell("Receiver").assertEqual(row.receiver);
					await table.getRow(rowIndex).getCell("Amount").assertEqual(row.amount);
					await table.getRow(rowIndex).getCell("Status").assertEqual(row.status);

					if (row.issuedAt !== undefined) {
						await table.getRow(rowIndex).getCell("Issued At").assertEqual(row.issuedAt);
					}

					if (row.action !== undefined) {
						await expect(table.getRow(rowIndex).getCell("Action").locator.getByRole("button", { name: row.action })).toBeVisible();
					}
				});
			}
		});
	}

	export async function assertBillsTable(
		table: TableLocator,
		params: {
			heading?: string;
			// pagination?: null | { totalPages: number; currentPage: number };
			rows: { creditor: string; debtors: string[]; description: string }[];
		}
	) {
		await table.waitForLoading();

		await test.step("Assert Bills Table", async () => {
			if (params.heading) {
				await expect(table.getHeading()).toHaveText(params.heading);
			}

			// if (params.pagination !== undefined) {
			// 	const pagination = table.getContainer().locator(`[aria-label="pagination"]`);
			//
			// 	if (params.pagination === null) {
			// 		await expect(pagination).not.toBeVisible();
			// 	} else {
			// 		await expect(pagination).toBeVisible();
			// 		await expect(pagination.locator(`[aria-label$="page ${params.pagination.currentPage}"][aria-current="page"]`)).toBeVisible();
			// 		await expect(pagination.locator(`[aria-label="last page, page ${params.pagination.totalPages}"]`)).toBeVisible();
			// 	}
			// }

			for (let rowIndex = 0; rowIndex < params.rows.length; rowIndex++) {
				await test.step(`Assert bill row index ${rowIndex}`, async () => {
					const row = params.rows[rowIndex];
					await table.getRow(rowIndex).getCell("Description").assertEqual(row.description);
					await table.getRow(rowIndex).getCell("Creditor").assertEqual(row.creditor);

					for (const debtor of row.debtors) {
						await table.getRow(rowIndex).getCell("Debtors").assertContain(debtor);
					}
				});
			}
		});
	}
}
