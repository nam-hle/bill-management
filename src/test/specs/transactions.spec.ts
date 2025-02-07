import { expect } from "@playwright/test";

import { test } from "@/test/setup";
import { Actions } from "@/test/helpers/actions";
import { Locators } from "@/test/helpers/locators";
import { seedUser } from "@/test/functions/seed-user";
import { Assertions } from "@/test/helpers/assertions";

test("test", async ({ page, browser }) => {
	await seedUser({ email: "harry", fullName: "Harry Potter" });
	await seedUser({ email: "ron", fullName: "Ron Weasley" });

	await Actions.login(page, "harry");

	await page.getByRole("button", { name: "Transactions" }).click();
	await page.getByRole("link", { name: "New" }).click();

	await page.getByRole("combobox", { name: "Receiver" }).click();
	await page.getByRole("option", { name: "Ron Weasley" }).click();

	await page.fill('input[name="amount"]', "42");

	await page.getByRole("main").getByRole("button", { name: "Create" }).click();

	await expect(page.locator(".chakra-field__errorText")).toHaveCount(0);
	await expect(page).toHaveURL("/transactions");

	const transactionsTable = await Locators.locateTable(page);

	await Assertions.assertTransactionsTable(transactionsTable, {
		amount: "42",
		status: "Waiting",
		action: "Decline",
		issuedAt: "Today",
		sender: "Harry Potter",
		receiver: "Ron Weasley"
	});

	await page.goto("/");
	await Assertions.assertStats(page, { Sent: "42", "Net Balance": "-42" });

	const recentTable = await Locators.locateTable(page, 1);
	await Assertions.assertTransactionsTable(recentTable, {
		amount: "42",
		status: "Waiting",
		issuedAt: "Today",
		sender: "Harry Potter",
		receiver: "Ron Weasley"
	});

	const ronPage = await (await browser.newContext()).newPage();

	await Actions.login(ronPage, "ron");

	await Assertions.assertStats(ronPage, { Received: "42", "Net Balance": "42" });
	const ronRecentTable = await Locators.locateTable(ronPage, 1);
	await Assertions.assertTransactionsTable(ronRecentTable, {
		amount: "42",
		status: "Waiting",
		issuedAt: "Today",
		sender: "Harry Potter",
		receiver: "Ron Weasley"
	});

	// Assert notifications
});
