import { test, expect } from "@playwright/test";

import { Actions } from "@/test/helpers/actions";
import { Locators } from "@/test/helpers/locators";
import { USERNAMES, FULL_NAMES } from "@/test/utils";
import { truncate } from "@/test/functions/truncate";
import { seedGroup } from "@/test/functions/seed-group";

test.beforeAll("Setup", async () => {
	await truncate();
	await seedGroup();
});

test.beforeEach(async ({ page }) => {
	await Actions.login(page, USERNAMES.HARRY);
	await Actions.goToTransactionsPage(page);
	await page.getByRole("link", { name: "New" }).click();
});

const ERRORS = {
	MISSING_AMOUNT: "Amount is required",
	MISSING_RECEIVER: "Receiver is required",
	INVALID_AMOUNT: "The amount must be a number greater than zero"
};

const INITIAL_ERRORS = [ERRORS.MISSING_RECEIVER, ERRORS.MISSING_AMOUNT];

test.describe.only("validation", () => {
	test("Empty form", async ({ page }) => {
		await Actions.TransactionForm.submit(page);

		const errors = Locators.locateErrors(page);

		expect(await errors.allTextContents()).toEqual(INITIAL_ERRORS);
	});

	test("Receiver", async ({ page }) => {
		await Actions.TransactionForm.submit(page);
		await Actions.TransactionForm.selectReceiver(page, FULL_NAMES.HERMIONE);

		const errors = Locators.locateErrors(page);

		expect(await errors.allTextContents()).toEqual([ERRORS.MISSING_AMOUNT]);
	});

	test("Amount", async ({ page }) => {
		await Actions.TransactionForm.submit(page);
		await Actions.TransactionForm.fillAmount(page, "90");

		const errors = Locators.locateErrors(page);

		expect(await errors.allTextContents()).toEqual([ERRORS.MISSING_RECEIVER]);

		await Actions.TransactionForm.fillAmount(page, "");
		expect(await errors.allTextContents()).toEqual(INITIAL_ERRORS);

		await Actions.TransactionForm.fillAmount(page, "abc");
		expect(await errors.allTextContents()).toEqual([ERRORS.MISSING_RECEIVER, ERRORS.INVALID_AMOUNT]);
	});
});
