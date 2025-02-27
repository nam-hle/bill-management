// Import from playwright instead of the setup file to avoid truncate function
import { test, expect, type Page } from "@playwright/test";

import { Actions } from "@/test/helpers/actions";
import { Locators } from "@/test/helpers/locators";
import { USERNAMES, FULL_NAMES } from "@/test/utils";
import { truncate } from "@/test/functions/truncate";
import { Assertions } from "@/test/helpers/assertions";
import { seedGroup } from "@/test/functions/seed-group";
import { type TableLocator } from "@/test/locators/table-locator";

const presetBills: Omit<Actions.BillForm.FillParams, "description">[] = [
	{
		creditor: { amount: "90", name: FULL_NAMES.HARRY },
		debtors: [
			{ amount: "20", name: FULL_NAMES.RON },
			{ amount: "70", name: FULL_NAMES.HERMIONE }
		]
	},
	{
		creditor: { amount: "90", name: FULL_NAMES.RON },
		debtors: [
			{ amount: "20", name: FULL_NAMES.HARRY },
			{ amount: "70", name: FULL_NAMES.HERMIONE }
		]
	},
	{
		creditor: { amount: "90", name: FULL_NAMES.HERMIONE },
		debtors: [
			{ amount: "20", name: FULL_NAMES.HARRY },
			{ amount: "70", name: FULL_NAMES.RON }
		]
	}
];

const expectedRows: Assertions.BillsTableExpectation["rows"] = [
	{
		description: "Breakfast 0",
		creditor: { amount: "90.000", name: FULL_NAMES.HARRY },
		debtors: [
			{ amount: "20.000", name: FULL_NAMES.RON },
			{ amount: "70.000", name: FULL_NAMES.HERMIONE }
		]
	},
	{
		description: "Breakfast 1",
		creditor: { amount: "90.000", name: FULL_NAMES.RON },
		debtors: [
			{ amount: "20.000", name: FULL_NAMES.HARRY },
			{ amount: "70.000", name: FULL_NAMES.HERMIONE }
		]
	},
	{
		description: "Breakfast 2",
		creditor: { amount: "90.000", name: FULL_NAMES.HERMIONE },
		debtors: [
			{ amount: "20.000", name: FULL_NAMES.HARRY },
			{ amount: "70.000", name: FULL_NAMES.RON }
		]
	},
	{
		description: "Lunch 3",
		creditor: { amount: "90.000", name: FULL_NAMES.HARRY },
		debtors: [
			{ amount: "20.000", name: FULL_NAMES.RON },
			{ amount: "70.000", name: FULL_NAMES.HERMIONE }
		]
	},
	{
		description: "Lunch 4",
		creditor: { amount: "90.000", name: FULL_NAMES.RON },
		debtors: [
			{ amount: "20.000", name: FULL_NAMES.HARRY },
			{ amount: "70.000", name: FULL_NAMES.HERMIONE }
		]
	},
	{
		description: "Lunch 5",
		creditor: { amount: "90.000", name: FULL_NAMES.HERMIONE },
		debtors: [
			{ amount: "20.000", name: FULL_NAMES.HARRY },
			{ amount: "70.000", name: FULL_NAMES.RON }
		]
	},
	{
		description: "Dinner 6",
		creditor: { amount: "90.000", name: FULL_NAMES.HARRY },
		debtors: [
			{ amount: "20.000", name: FULL_NAMES.RON },
			{ amount: "70.000", name: FULL_NAMES.HERMIONE }
		]
	},
	{
		description: "Dinner 7",
		creditor: { amount: "90.000", name: FULL_NAMES.RON },
		debtors: [
			{ amount: "20.000", name: FULL_NAMES.HARRY },
			{ amount: "70.000", name: FULL_NAMES.HERMIONE }
		]
	},
	{
		description: "Dinner 8",
		creditor: { amount: "90.000", name: FULL_NAMES.HERMIONE },
		debtors: [
			{ amount: "20.000", name: FULL_NAMES.HARRY },
			{ amount: "70.000", name: FULL_NAMES.RON }
		]
	},
	{
		description: "Party",
		creditor: { amount: "90.000", name: FULL_NAMES.HARRY },
		debtors: [
			{ amount: "20.000", name: FULL_NAMES.HARRY },
			{ amount: "30.000", name: FULL_NAMES.RON },
			{ amount: "40.000", name: FULL_NAMES.HERMIONE }
		]
	}
];

// TODO: Call API to seed instead
test.beforeAll("Seed bills", async ({ browser }, testInfo) => {
	test.setTimeout(testInfo.timeout * 1.5);
	await truncate();
	await seedGroup();

	const page = await browser.newPage();

	await test.step("Ron creates bills", async () => {
		await Actions.login(page, USERNAMES.RON);
		await Actions.goToBillsPage(page);

		for (const index of [0, 1, 2]) {
			await Actions.BillForm.fill(page, { description: `Breakfast ${index}`, ...presetBills[index % 3] });
			await Actions.submit(page);
			await Assertions.assertToast(page, "Bill created successfully");
		}

		await Actions.logout(page);
	});

	await test.step("Hermione creates bills", async () => {
		await Actions.login(page, USERNAMES.HERMIONE);
		await Actions.goToBillsPage(page);

		for (const index of [3, 4, 5]) {
			await Actions.BillForm.fill(page, { description: `Lunch ${index}`, ...presetBills[index % 3] });
			await Actions.submit(page);
			await Assertions.assertToast(page, "Bill created successfully");
		}

		await Actions.logout(page);
	});

	await test.step("Harry creates bills", async () => {
		await Actions.login(page, USERNAMES.HARRY);
		await Actions.goToBillsPage(page);

		for (const index of [6, 7, 8]) {
			await Actions.BillForm.fill(page, { description: `Dinner ${index}`, ...presetBills[index % 3] });
			await Actions.submit(page);
			await Assertions.assertToast(page, "Bill created successfully");
		}

		await Actions.logout(page);
	});

	await test.step("Ron creates a bill with Hermione only", async () => {
		await Actions.login(page, USERNAMES.RON);
		await Actions.goToBillsPage(page);

		await Actions.BillForm.fill(page, {
			description: `Coffee`,
			creditor: { amount: "90", name: FULL_NAMES.RON },
			debtors: [
				{ amount: "20", name: FULL_NAMES.RON },
				{ amount: "70", name: FULL_NAMES.HERMIONE }
			]
		});
		await Actions.submit(page);
		await Assertions.assertToast(page, "Bill created successfully");

		await Actions.logout(page);
	});

	await test.step("Harry creates a self bill", async () => {
		await Actions.login(page, USERNAMES.HARRY);
		await Actions.goToBillsPage(page);

		await Actions.BillForm.fill(page, {
			description: `Party`,
			creditor: { amount: "90", name: FULL_NAMES.HARRY },
			debtors: [
				{ amount: "20", name: FULL_NAMES.HARRY },
				{ amount: "30", name: FULL_NAMES.RON },
				{ amount: "40", name: FULL_NAMES.HERMIONE }
			]
		});
		await Actions.submit(page);

		await Actions.logout(page);
	});
});

test.beforeEach(async ({ page }) => {
	await Actions.login(page, USERNAMES.HARRY);
	await Actions.goToBillsPage(page);
});

test.afterEach(async ({ page }) => {
	await Actions.logout(page);
});

async function waitForLoading(page: Page, action: () => Promise<void>) {
	await action();
	await page.waitForTimeout(1000);
}

export const testBillsPage = test.extend<{
	billsTableLocator: TableLocator;
}>({
	billsTableLocator: async ({ page }, use) => {
		await use(await Locators.locateTable(page, 0));
	}
});

testBillsPage("Pagination", async ({ page, billsTableLocator }) => {
	await Assertions.assertBillsTable(billsTableLocator, {
		heading: "Bills (10)",
		pagination: { totalPages: 2, currentPage: 1 },
		rows: [expectedRows[9], expectedRows[8], expectedRows[7], expectedRows[6], expectedRows[5]]
	});

	await waitForLoading(page, () => billsTableLocator.nextPageButton.click());
	await Assertions.assertBillsTable(billsTableLocator, {
		heading: "Bills (10)",
		pagination: { totalPages: 2, currentPage: 2 },
		rows: [expectedRows[4], expectedRows[3], expectedRows[2], expectedRows[1], expectedRows[0]]
	});
	await expect(page).toHaveURL("/bills?page=2");
});

testBillsPage("Creator filter", async ({ page, billsTableLocator }) => {
	await waitForLoading(page, () => page.getByRole("button", { name: "As creator" }).click());
	await Assertions.assertBillsTable(billsTableLocator, {
		pagination: null,
		heading: "Bills (4)",
		rows: [expectedRows[9], expectedRows[8], expectedRows[7], expectedRows[6]]
	});

	await expect(page).toHaveURL("/bills?creator=me");
});

testBillsPage("Creditor filter", async ({ page, billsTableLocator }) => {
	await waitForLoading(page, () => page.getByRole("button", { name: "As creditor" }).click());
	await Assertions.assertBillsTable(billsTableLocator, {
		pagination: null,
		heading: "Bills (4)",
		rows: [expectedRows[9], expectedRows[6], expectedRows[3], expectedRows[0]]
	});

	await expect(page).toHaveURL("/bills?creditor=me");
});

testBillsPage("Debtor filter", async ({ page, billsTableLocator }) => {
	await waitForLoading(page, () => page.getByRole("button", { name: "As debtor" }).click());

	await Assertions.assertBillsTable(billsTableLocator, {
		heading: "Bills (7)",
		pagination: { totalPages: 2, currentPage: 1 },
		rows: [expectedRows[9], expectedRows[8], expectedRows[7], expectedRows[5], expectedRows[4]]
	});
	await expect(page).toHaveURL("/bills?debtor=me");

	await waitForLoading(page, () => billsTableLocator.nextPageButton.click());
	await Assertions.assertBillsTable(billsTableLocator, {
		heading: "Bills (7)",
		rows: [expectedRows[2], expectedRows[1]],
		pagination: { totalPages: 2, currentPage: 2 }
	});
	await expect(page).toHaveURL("/bills?page=2&debtor=me");

	await waitForLoading(page, () => page.getByRole("button", { name: "As creditor" }).click());
	await Assertions.assertBillsTable(billsTableLocator, {
		pagination: null,
		heading: "Bills (1)",
		rows: [expectedRows[9]]
	});
	await expect(page).toHaveURL("/bills?debtor=me&creditor=me");
});

testBillsPage("Creditor & Debtor filters", async ({ page, billsTableLocator }) => {
	await waitForLoading(page, () => page.getByRole("button", { name: "As creditor" }).click());
	await waitForLoading(page, () => page.getByRole("button", { name: "As debtor" }).click());

	await Assertions.assertBillsTable(billsTableLocator, {
		pagination: null,
		heading: "Bills (1)",
		rows: [expectedRows[9]]
	});

	await expect(page).toHaveURL("/bills?creditor=me&debtor=me");
});

testBillsPage("Creator & Debtor filters", async ({ page, billsTableLocator }) => {
	await waitForLoading(page, () => page.getByRole("button", { name: "As creator" }).click());
	await waitForLoading(page, () => page.getByRole("button", { name: "As debtor" }).click());

	await Assertions.assertBillsTable(billsTableLocator, {
		pagination: null,
		heading: "Bills (3)",
		rows: [expectedRows[9], expectedRows[8], expectedRows[7]]
	});

	await expect(page).toHaveURL("/bills?creator=me&debtor=me");
});

testBillsPage("Search", async ({ page, billsTableLocator }) => {
	await Actions.fillInput(page, "search-bar", "break");
	await Assertions.assertBillsTable(billsTableLocator, {
		pagination: null,
		heading: "Bills (3)",
		rows: [expectedRows[2], expectedRows[1], expectedRows[0]]
	});

	await expect(page).toHaveURL("/bills?q=break");
});

testBillsPage("Search & Filter", async ({ page, billsTableLocator }) => {
	await Actions.fillInput(page, "search-bar", "break");
	await waitForLoading(page, () => page.getByRole("button", { name: "As debtor" }).click());

	await Assertions.assertBillsTable(billsTableLocator, {
		pagination: null,
		heading: "Bills (2)",
		rows: [expectedRows[2], expectedRows[1]]
	});

	await expect(page).toHaveURL("/bills?q=break&debtor=me");
});

testBillsPage("Navigate with query", async ({ page, billsTableLocator }) => {
	await page.goto("/bills?debtor=me&page=2");

	await Assertions.assertBillsTable(billsTableLocator, {
		heading: "Bills (7)",
		rows: [expectedRows[2], expectedRows[1]],
		pagination: { totalPages: 2, currentPage: 2 }
	});
});

testBillsPage("Balance", async ({ page }) => {
	await Actions.goToHomePage(page);

	await Assertions.assertStats(page, { Paid: "340.000", Owed: "120.000", "Net Balance": "220.000" });
});
