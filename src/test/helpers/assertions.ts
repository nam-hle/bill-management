import { expect, type Page } from "@playwright/test";

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
		expected: { sender: string; amount: string; status: string; action?: string; receiver: string; issuedAt?: string }
	) {
		await table.getRow(0).getCell("Sender").assertContent(expected.sender);
		await table.getRow(0).getCell("Receiver").assertContent(expected.receiver);
		await table.getRow(0).getCell("Amount").assertContent(expected.amount);
		await table.getRow(0).getCell("Status").assertContent(expected.status);

		if (expected.issuedAt !== undefined) {
			await table.getRow(0).getCell("Issued At").assertContent(expected.issuedAt);
		}

		if (expected.action !== undefined) {
			await expect(table.getRow(0).getCell("Action").locator.getByRole("button", { name: expected.action })).toBeVisible();
		}
	}
}
