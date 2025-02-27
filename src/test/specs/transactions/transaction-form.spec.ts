import { test } from "@/test/setup";
import { Actions } from "@/test/helpers/actions";
import { Locators } from "@/test/helpers/locators";
import { USERNAMES, FULL_NAMES } from "@/test/utils";
import { Assertions } from "@/test/helpers/assertions";
import { seedGroup } from "@/test/functions/seed-group";

test("basic", async ({ page, browser }) => {
	await seedGroup();

	await Actions.login(page, USERNAMES.HARRY);

	await Actions.goToTransactionsPage(page);
	await Actions.TransactionForm.fill(page, {
		amount: "42",
		receiver: FULL_NAMES.RON,
		candidateReceivers: [FULL_NAMES.DUMBLEDORE, FULL_NAMES.HERMIONE, FULL_NAMES.RON, FULL_NAMES.SNAPE]
	});

	const transactionsTable = await Locators.locateTable(page, 0);

	await Assertions.assertTransactionsTable(transactionsTable, {
		pagination: null,
		rows: [{ amount: "42", status: "Waiting", action: "Decline", issuedAt: "Today", receiver: FULL_NAMES.RON, sender: FULL_NAMES.HARRY }]
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
