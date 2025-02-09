import { expect, type Page } from "@playwright/test";

import { test } from "@/test/setup";
import { Locators } from "@/test/helpers/locators";
import { type TableLocator } from "@/test/locators/table-locator";

export namespace Assertions {
	const StateLabels = ["Owed", "Received", "Paid", "Sent", "Net Balance"] as const;
	export async function assertStats(page: Page, expected: Partial<Record<(typeof StateLabels)[number], string>>) {
		for (const label of StateLabels) {
			await expect(Locators.locateStatValue(page, label)).toHaveText(expected[label] ?? "0");
		}
	}

	export async function assertTransactionsTable(
		table: TableLocator,
		expected: { heading?: string; rows: { sender: string; amount: string; status: string; action?: string; receiver: string; issuedAt?: string }[] }
	) {
		if (expected.heading) {
			await expect(table.getHeading()).toHaveText(expected.heading);
		}

		for (let rowIndex = 0; rowIndex < expected.rows.length; rowIndex++) {
			await test.step(`Assert Transaction row index ${rowIndex}`, async () => {
				const row = expected.rows[rowIndex];
				await table.getRow(rowIndex).getCell("Sender").assertContent(row.sender);
				await table.getRow(rowIndex).getCell("Receiver").assertContent(row.receiver);
				await table.getRow(rowIndex).getCell("Amount").assertContent(row.amount);
				await table.getRow(rowIndex).getCell("Status").assertContent(row.status);

				if (row.issuedAt !== undefined) {
					await table.getRow(rowIndex).getCell("Issued At").assertContent(row.issuedAt);
				}

				if (row.action !== undefined) {
					await expect(table.getRow(rowIndex).getCell("Action").locator.getByRole("button", { name: row.action })).toBeVisible();
				}
			});
		}
	}
}
