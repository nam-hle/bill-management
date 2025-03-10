import { test } from "@/test/setup";
import { Actions } from "@/test/helpers/actions";
import { Locators } from "@/test/helpers/locators";
import { USERNAMES, FULL_NAMES } from "@/test/utils";
import { Assertions } from "@/test/helpers/assertions";
import { seedBasicPreset } from "@/test/functions/seed-basic-preset";

test("basic", async ({ page, browser }) => {
	await seedBasicPreset();

	await Actions.login(page, USERNAMES.harry);

	await Actions.goToTransactionsPage(page);
	await Actions.TransactionForm.fill(page, {
		amount: "42",
		receiver: FULL_NAMES.ron,
		candidateReceivers: [FULL_NAMES.dumbledore, FULL_NAMES.hermione, FULL_NAMES.ron, FULL_NAMES.snape]
	});

	const transactionsTable = await Locators.locateTable(page, 0);

	await Assertions.assertTransactionsTable(transactionsTable, {
		pagination: null,
		rows: [{ amount: "42", status: "Waiting", action: "Decline", issuedAt: "Today", receiver: FULL_NAMES.ron, sender: FULL_NAMES.harry }]
	});

	await Actions.goToHomePage(page);
	await Assertions.assertStats(page, { Sent: "42.000", "Net Balance": "-42.000" });

	// TODO: Enable
	// const recentTable = await Locators.locateTable(page, 1);
	// await Assertions.assertTransactionsTable(recentTable, {
	// 	pagination: null,
	// 	rows: [{ amount: "42", status: "Waiting", issuedAt: "Today", receiver: FULL_NAMES.RON, sender: FULL_NAMES.HARRY }]
	// });

	const ronPage = await (await browser.newContext()).newPage();

	await Actions.login(ronPage, "ron");

	await Assertions.assertStats(ronPage, { Received: "42.000", "Net Balance": "42.000" });
	// const ronRecentTable = await Locators.locateTable(ronPage, 1);
	// await Assertions.assertTransactionsTable(ronRecentTable, {
	// 	rows: [{ amount: "42", status: "Waiting", issuedAt: "Today", receiver: FULL_NAMES.RON, sender: FULL_NAMES.HARRY }]
	// });
});
