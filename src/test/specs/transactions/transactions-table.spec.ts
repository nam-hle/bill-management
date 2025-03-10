import { test } from "@/test/setup";
import { Actions } from "@/test/helpers/actions";
import { Locators } from "@/test/helpers/locators";
import { Assertions } from "@/test/helpers/assertions";
import { createRequester } from "@/test/helpers/requester";
import { USERNAMES, FULL_NAMES, getCurrentDate } from "@/test/utils";
import { seedBasicPreset } from "@/test/functions/seed-basic-preset";

test("basic", async ({ page }) => {
	const { userIds } = await seedBasicPreset();

	await test.step("Create transactions from Ron to Harry", async () => {
		const requester = await createRequester(USERNAMES.ron);

		await requester.transactions.create.mutate({ amount: 40, receiverId: userIds.harry, issuedAt: getCurrentDate() });
		await requester.transactions.create.mutate({ amount: 41, receiverId: userIds.harry, issuedAt: getCurrentDate() });
	});

	await test.step("Create transactions from Hermione to Harry", async () => {
		const requester = await createRequester(USERNAMES.hermione);

		await requester.transactions.create.mutate({ amount: 42, receiverId: userIds.harry, issuedAt: getCurrentDate() });
		await requester.transactions.create.mutate({ amount: 43, receiverId: userIds.harry, issuedAt: getCurrentDate() });
	});

	await test.step("Create transactions from Harry to others", async () => {
		const requester = await createRequester(USERNAMES.harry);

		await requester.transactions.create.mutate({ amount: 44, receiverId: userIds.ron, issuedAt: getCurrentDate() });
		await requester.transactions.create.mutate({ amount: 45, issuedAt: getCurrentDate(), receiverId: userIds.hermione });
	});

	await Actions.login(page, USERNAMES.harry);

	await page.getByRole("link", { name: "Transactions" }).click();
	const transactionsTable = await Locators.locateTable(page, 0);

	const firstRows = [
		{ amount: "40", status: "Waiting", action: "Confirm", issuedAt: "Today", sender: FULL_NAMES.ron, receiver: FULL_NAMES.harry },
		{ amount: "41", status: "Waiting", action: "Confirm", issuedAt: "Today", sender: FULL_NAMES.ron, receiver: FULL_NAMES.harry },
		{ amount: "42", status: "Waiting", action: "Confirm", issuedAt: "Today", receiver: FULL_NAMES.harry, sender: FULL_NAMES.hermione },
		{ amount: "43", status: "Waiting", action: "Confirm", issuedAt: "Today", receiver: FULL_NAMES.harry, sender: FULL_NAMES.hermione },
		{ amount: "44", status: "Waiting", action: "Decline", issuedAt: "Today", receiver: FULL_NAMES.ron, sender: FULL_NAMES.harry }
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
		rows: [{ amount: "45", status: "Waiting", action: "Decline", issuedAt: "Today", sender: FULL_NAMES.harry, receiver: FULL_NAMES.hermione }]
	});

	await Actions.goToHomePage(page);
	await Assertions.assertStats(page, { Sent: "89.000", Received: "166.000", "Net Balance": "77.000" });
	// TODO: Enable
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
