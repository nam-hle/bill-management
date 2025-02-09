import { test } from "@/test/setup";
import { Actions } from "@/test/helpers/actions";
import { Locators } from "@/test/helpers/locators";
import { seedUser } from "@/test/functions/seed-user";
import { Assertions } from "@/test/helpers/assertions";

test("basic", async ({ page, browser }) => {
	await seedUser({ email: "harry", fullName: "Harry Potter" });
	await seedUser({ email: "ron", fullName: "Ron Weasley" });

	await Actions.login(page, "harry");

	await page.getByRole("button", { name: "Transactions" }).click();
	await Actions.fillTransactionForm(page, { amount: "42", receiver: "Ron Weasley" });

	const transactionsTable = await Locators.locateTable(page, 0);

	await Assertions.assertTransactionsTable(transactionsTable, {
		rows: [
			{
				amount: "42",
				status: "Waiting",
				action: "Decline",
				issuedAt: "Today",
				sender: "Harry Potter",
				receiver: "Ron Weasley"
			}
		]
	});

	await page.goto("/");
	await Assertions.assertStats(page, { Sent: "42", "Net Balance": "-42" });

	const recentTable = await Locators.locateTable(page, 1);
	await Assertions.assertTransactionsTable(recentTable, {
		rows: [
			{
				amount: "42",
				status: "Waiting",
				issuedAt: "Today",
				sender: "Harry Potter",
				receiver: "Ron Weasley"
			}
		]
	});

	const ronPage = await (await browser.newContext()).newPage();

	await Actions.login(ronPage, "ron");

	await Assertions.assertStats(ronPage, { Received: "42", "Net Balance": "42" });
	const ronRecentTable = await Locators.locateTable(ronPage, 1);
	await Assertions.assertTransactionsTable(ronRecentTable, {
		rows: [
			{
				amount: "42",
				status: "Waiting",
				issuedAt: "Today",
				sender: "Harry Potter",
				receiver: "Ron Weasley"
			}
		]
	});

	// Assert notifications
});
