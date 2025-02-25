import { test } from "@/test/setup";
import { Actions } from "@/test/helpers/actions";
import { Locators } from "@/test/helpers/locators";
import { USERNAMES, FULL_NAMES } from "@/test/utils";
import { Assertions } from "@/test/helpers/assertions";
import { seedGroup } from "@/test/functions/seed-group";

test("basic", async ({ page }) => {
	await seedGroup();

	await test.step("Create transactions from Ron to Harry", async () => {
		await Actions.login(page, USERNAMES.RON);

		await page.getByRole("link", { name: "Transactions" }).click();
		await Actions.TransactionForm.fill(page, { amount: "40", receiver: FULL_NAMES.HARRY });

		await page.getByRole("link", { name: "Transactions" }).click();
		await Actions.TransactionForm.fill(page, { amount: "41", receiver: FULL_NAMES.HARRY });

		await Actions.logout(page);
	});

	await test.step("Create transactions from Hermione to Harry", async () => {
		await Actions.login(page, USERNAMES.HERMIONE);

		await page.getByRole("link", { name: "Transactions" }).click();
		await Actions.TransactionForm.fill(page, { amount: "42", receiver: FULL_NAMES.HARRY });

		await page.getByRole("link", { name: "Transactions" }).click();
		await Actions.TransactionForm.fill(page, { amount: "43", receiver: FULL_NAMES.HARRY });

		await Actions.logout(page);
	});

	await test.step("Create transactions from Harry to others", async () => {
		await Actions.login(page, USERNAMES.HARRY);

		await page.getByRole("link", { name: "Transactions" }).click();
		await Actions.TransactionForm.fill(page, { amount: "44", receiver: FULL_NAMES.RON });

		await page.getByRole("link", { name: "Transactions" }).click();
		await Actions.TransactionForm.fill(page, { amount: "45", receiver: FULL_NAMES.HERMIONE });

		await page.getByRole("link", { name: "Transactions" }).click();
	});

	const transactionsTable = await Locators.locateTable(page, 0);

	const firstRows = [
		{ amount: "40", status: "Waiting", action: "Confirm", issuedAt: "Today", sender: FULL_NAMES.RON, receiver: FULL_NAMES.HARRY },
		{ amount: "41", status: "Waiting", action: "Confirm", issuedAt: "Today", sender: FULL_NAMES.RON, receiver: FULL_NAMES.HARRY },
		{ amount: "42", status: "Waiting", action: "Confirm", issuedAt: "Today", receiver: FULL_NAMES.HARRY, sender: FULL_NAMES.HERMIONE },
		{ amount: "43", status: "Waiting", action: "Confirm", issuedAt: "Today", receiver: FULL_NAMES.HARRY, sender: FULL_NAMES.HERMIONE },
		{ amount: "44", status: "Waiting", action: "Decline", issuedAt: "Today", receiver: FULL_NAMES.RON, sender: FULL_NAMES.HARRY }
	];
	await Assertions.assertTransactionsTable(transactionsTable, {
		rows: firstRows,
		heading: "Transactions (6)",
		pagination: {
			totalPages: 2,
			currentPage: 1
		}
	});

	await transactionsTable.nextPageButton.click();

	await Assertions.assertTransactionsTable(transactionsTable, {
		heading: "Transactions (6)",
		pagination: {
			totalPages: 2,
			currentPage: 2
		},
		rows: [{ amount: "45", status: "Waiting", action: "Decline", issuedAt: "Today", sender: FULL_NAMES.HARRY, receiver: FULL_NAMES.HERMIONE }]
	});

	await Actions.goToHomePage(page);
	await Assertions.assertStats(page, { Sent: "89.000", Received: "166.000", "Net Balance": "77.000" });
	// const recentTable = await Locators.locateTable(page, 1);
	// await Assertions.assertTransactionsTable(recentTable, { pagination: null, rows: firstRows.map((row) => _.omit(row, "action")) });

	await Actions.goToNotificationsPage(page);
	await Assertions.assertNotificationsTable(page, {
		messages: [
			`You have received a new transaction of 43 from Hermione Granger. Please review and confirm it.`,
			`You have received a new transaction of 42 from Hermione Granger. Please review and confirm it.`,
			`You have received a new transaction of 41 from Ron Weasley. Please review and confirm it.`,
			`You have received a new transaction of 40 from Ron Weasley. Please review and confirm it.`
		]
	});
});
