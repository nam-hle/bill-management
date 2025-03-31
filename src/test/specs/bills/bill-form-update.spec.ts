import { expect } from "@playwright/test";

import { test } from "@/test/setup";
import { Actions } from "@/test/helpers/actions";
import { Locators } from "@/test/helpers/locators";
import { USERNAMES, FULL_NAMES } from "@/test/utils";
import { Assertions } from "@/test/helpers/assertions";
import { seedBasicPreset } from "@/test/functions/seed-basic-preset";

const expectedBillsTable: Assertions.BillsTableExpectation = {
	pagination: null,
	heading: "Bills (1)",
	rows: [
		{
			description: "Party",
			creditor: { amount: "150.000", name: `${FULL_NAMES.snape}` },
			debtors: [
				{
					amount: "40.000",
					name: FULL_NAMES.dumbledore
				},
				{
					amount: "50.000",
					name: FULL_NAMES.hermione
				},
				{
					amount: "60.000",
					name: FULL_NAMES.ron
				},
				{
					amount: "45.000",
					name: FULL_NAMES.snape
				}
			]
		}
	]
};

test("basic", async ({ page }, testInfo) => {
	test.setTimeout(testInfo.timeout * 1.5);

	const getBillsTable = async () => Locators.locateTable(page, 0);
	await seedBasicPreset();

	await test.step("Harry creates a bill", async () => {
		await Actions.login(page, USERNAMES.harry);
		await Actions.goToBillsPage(page);
		await Actions.BillForm.fill(page, {
			description: "Dinner",
			creditor: { amount: "125", name: FULL_NAMES.ron },
			debtors: [
				{ amount: "20", name: FULL_NAMES.harry },
				{ amount: "70", name: FULL_NAMES.hermione },
				{ amount: "35", name: FULL_NAMES.snape }
			]
		});
		await Actions.submit(page);

		await Assertions.assertToast(page, "A new bill has been created and saved successfully.");
		await expect(page).toHaveURL("/bills");

		await Actions.logout(page);
	});

	await test.step("Hermione updates the bill", async () => {
		await Actions.login(page, USERNAMES.hermione);
		await Actions.goToBillsPage(page);

		const billsTable = await getBillsTable();
		await billsTable.getRow(0).click();

		await expect(page).toHaveURL(/.*\/bills\/[A-Z0-9-]{6}$/);

		await Actions.BillForm.edit(page);

		await Actions.BillForm.fillDescription(page, "Party");
		await Actions.BillForm.selectCreditor(page, FULL_NAMES.snape);
		await Actions.BillForm.fillCreditorAmount(page, "150");

		await Actions.BillForm.removeDebtor(page, 0);

		await Actions.BillForm.selectDebtor(page, 0, FULL_NAMES.dumbledore);
		await Actions.BillForm.fillDebtorAmount(page, 0, "40");

		await Actions.BillForm.fillDebtorAmount(page, 1, "45");

		await Actions.BillForm.addDebtor(page);
		await Actions.BillForm.selectDebtor(page, 2, FULL_NAMES.hermione);
		await Actions.BillForm.fillDebtorAmount(page, 2, "50");

		await Actions.BillForm.addDebtor(page);
		await Actions.BillForm.selectDebtor(page, 3, FULL_NAMES.ron);
		await Actions.BillForm.fillDebtorAmount(page, 3, "60");

		await Actions.BillForm.save(page);

		await Assertions.assertToast(page, "The bill details have been updated successfully.");

		await Actions.logout(page);
	});

	await test.step("Ron checks the bill, update description but cancel later", async () => {
		await Actions.login(page, USERNAMES.ron);
		await Actions.goToBillsPage(page);
		const billsTable = await getBillsTable();

		await Assertions.assertBillsTable(billsTable, expectedBillsTable);

		await billsTable.getRow(0).click();
		await expect(page.getByRole("heading", { name: "Bill Details" })).toBeVisible();

		await Actions.BillForm.edit(page);
		await Actions.BillForm.fillDescription(page, "Team building");
		await Actions.BillForm.cancel(page);

		await Actions.logout(page);
	});

	await test.step("Snape checks the bill", async () => {
		await Actions.login(page, USERNAMES.snape);
		await Actions.goToBillsPage(page);
		const billsTable = await getBillsTable();

		await Assertions.assertBillsTable(billsTable, expectedBillsTable);

		await billsTable.getRow(0).click();

		await expect(page.getByText(/Last updated [ \w]+ by Hermione Granger/)).toBeVisible();
		await expect(page.getByText(/Created [ \w]+ by Harry Potter/)).toBeVisible();

		await Actions.logout(page);
	});

	await test.step("Assert notifications", async () => {
		const expectations = [
			{ username: USERNAMES.harry, messages: ["You’ve been removed as a Debtor from the bill Party by Hermione Granger."] },
			{
				username: USERNAMES.ron,
				messages: [
					"You’ve been removed as a Creditor from the bill Party by Hermione Granger.",
					"You’ve been added to the bill Party by Hermione Granger as a Debtor with an amount of 60.",
					"You’ve been added to the bill Party by Harry Potter as a Creditor with an amount of 125."
				]
			},
			{
				username: USERNAMES.hermione,
				messages: ["You’ve been added to the bill Party by Harry Potter as a Debtor with an amount of 70."]
			},
			{
				username: USERNAMES.dumbledore,
				messages: ["You’ve been added to the bill Party by Hermione Granger as a Debtor with an amount of 40."]
			},
			{
				username: USERNAMES.snape,
				messages: [
					"You’ve been added to the bill Party by Hermione Granger as a Creditor with an amount of 150.",
					"Your amount in the bill Party has been updated from 35 to 45 by Hermione Granger. Please review the change.",
					"You’ve been added to the bill Party by Harry Potter as a Debtor with an amount of 35."
				]
			}
		];

		for (const expectation of expectations) {
			await Actions.login(page, expectation.username);

			await Actions.goToNotificationsPage(page);
			await page.waitForSelector(".loading", { state: "detached" });

			expect(await Locators.locateNotifications(page).allTextContents()).toEqual(expectation.messages);

			await Actions.logout(page);
		}
	});
});
