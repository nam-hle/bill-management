import { test } from "@/test/setup";
import { Actions } from "@/test/helpers/actions";
import { Locators } from "@/test/helpers/locators";
import { Assertions } from "@/test/helpers/assertions";
import { RON, HARRY, HERMIONE } from "@/test/constants";
import { seedGroup } from "@/test/functions/seed-group";

test("basic", async ({ page }) => {
	await seedGroup();

	await test.step("Create transactions from Ron to Harry", async () => {
		await Actions.login(page, "ron");

		await page.getByRole("button", { name: "Transactions" }).click();
		await Actions.fillTransactionForm(page, { amount: "40", receiver: HARRY });

		await page.getByRole("button", { name: "Transactions" }).click();
		await Actions.fillTransactionForm(page, { amount: "41", receiver: HARRY });

		await Actions.logout(page);
	});

	await test.step("Create transactions from Hermione to Harry", async () => {
		await Actions.login(page, "hermione");

		await page.getByRole("button", { name: "Transactions" }).click();
		await Actions.fillTransactionForm(page, { amount: "42", receiver: HARRY });

		await page.getByRole("button", { name: "Transactions" }).click();
		await Actions.fillTransactionForm(page, { amount: "43", receiver: HARRY });

		await Actions.logout(page);
	});

	await test.step("Create transactions from Harry to others", async () => {
		await Actions.login(page, "harry");

		await page.getByRole("button", { name: "Transactions" }).click();
		await Actions.fillTransactionForm(page, { amount: "44", receiver: RON });

		await page.getByRole("button", { name: "Transactions" }).click();
		await Actions.fillTransactionForm(page, { amount: "45", receiver: HERMIONE });

		await page.getByRole("button", { name: "Transactions" }).click();
	});

	const transactionsTable = await Locators.locateTable(page, 0);

	await Assertions.assertTransactionsTable(transactionsTable, {
		heading: "Transactions (6)",
		rows: [
			{ sender: RON, amount: "40", receiver: HARRY, status: "Waiting", action: "Confirm", issuedAt: "Today" },
			{ sender: RON, amount: "41", receiver: HARRY, status: "Waiting", action: "Confirm", issuedAt: "Today" },
			{ amount: "42", receiver: HARRY, sender: HERMIONE, status: "Waiting", action: "Confirm", issuedAt: "Today" },
			{ amount: "43", receiver: HARRY, sender: HERMIONE, status: "Waiting", action: "Confirm", issuedAt: "Today" },
			{ amount: "44", receiver: RON, sender: HARRY, status: "Waiting", action: "Decline", issuedAt: "Today" }
		]
	});

	await transactionsTable.nextPageButton.click();

	await Assertions.assertTransactionsTable(transactionsTable, {
		heading: "Transactions (6)",
		rows: [{ amount: "45", sender: HARRY, status: "Waiting", action: "Decline", issuedAt: "Today", receiver: HERMIONE }]
	});
});
