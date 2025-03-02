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
	await Actions.login(page, USERNAMES.harry);
	await Actions.goToBillsPage(page);
	await page.getByRole("link", { name: "New" }).click();
});

const ERRORS = {
	MISSING_DEBTOR: "Debtor is required",
	MISSING_CREDITOR: "Creditor is required",
	MISSING_DESCRIPTION: "Description is required",
	MISSING_TOTAL_AMOUNT: "Total amount is required",
	INVALID_AMOUNT: "The amount must be a number greater than zero"
};

const INITIAL_ERRORS = [ERRORS.MISSING_DESCRIPTION, ERRORS.MISSING_CREDITOR, ERRORS.MISSING_TOTAL_AMOUNT, ERRORS.MISSING_DEBTOR];

test.describe("validation", () => {
	test("Empty form", async ({ page }) => {
		await Actions.submit(page);

		const errors = Locators.locateErrors(page);

		expect(await errors.allTextContents()).toEqual(INITIAL_ERRORS);
	});

	test("Description", async ({ page }) => {
		await Actions.submit(page);
		await Actions.BillForm.fillDescription(page, "Dinner");

		const errors = Locators.locateErrors(page);

		expect(await errors.allTextContents()).toEqual([ERRORS.MISSING_CREDITOR, ERRORS.MISSING_TOTAL_AMOUNT, ERRORS.MISSING_DEBTOR]);

		await Actions.BillForm.fillDescription(page, "");
		expect(await errors.allTextContents()).toEqual(INITIAL_ERRORS);
	});

	test("Creditor", async ({ page }) => {
		await Actions.submit(page);
		await Actions.BillForm.selectCreditor(page, FULL_NAMES.ron);

		const errors = Locators.locateErrors(page);

		expect(await errors.allTextContents()).toEqual([ERRORS.MISSING_DESCRIPTION, ERRORS.MISSING_TOTAL_AMOUNT, ERRORS.MISSING_DEBTOR]);
	});

	test("Total amount", async ({ page }) => {
		await Actions.submit(page);
		await Actions.BillForm.fillCreditorAmount(page, "90");

		const errors = Locators.locateErrors(page);

		expect(await errors.allTextContents()).toEqual([ERRORS.MISSING_DESCRIPTION, ERRORS.MISSING_CREDITOR, ERRORS.MISSING_DEBTOR]);

		await Actions.BillForm.fillCreditorAmount(page, "");
		expect(await errors.allTextContents()).toEqual(INITIAL_ERRORS);

		await Actions.BillForm.fillCreditorAmount(page, "abc");
		expect(await errors.allTextContents()).toEqual([
			ERRORS.MISSING_DESCRIPTION,
			ERRORS.MISSING_CREDITOR,
			ERRORS.INVALID_AMOUNT,
			ERRORS.MISSING_DEBTOR
		]);
	});

	test("Debtor", async ({ page }) => {
		await Actions.submit(page);
		await Actions.BillForm.selectDebtor(page, 0, FULL_NAMES.hermione);

		const errors = Locators.locateErrors(page);

		expect(await errors.allTextContents()).toEqual([ERRORS.MISSING_DESCRIPTION, ERRORS.MISSING_CREDITOR, ERRORS.MISSING_TOTAL_AMOUNT]);
	});

	test("Split amount", async ({ page }) => {
		await Actions.submit(page);
		const errors = Locators.locateErrors(page);

		await Actions.BillForm.fillDebtorAmount(page, 0, "abc");
		expect(await errors.allTextContents()).toEqual([
			ERRORS.MISSING_DESCRIPTION,
			ERRORS.MISSING_CREDITOR,
			ERRORS.MISSING_TOTAL_AMOUNT,
			ERRORS.MISSING_DEBTOR,
			"Amount must be a number greater than zero"
		]);

		await Actions.BillForm.fillDebtorAmount(page, 0, "45");

		expect(await errors.allTextContents()).toEqual([
			ERRORS.MISSING_DESCRIPTION,
			ERRORS.MISSING_CREDITOR,
			ERRORS.MISSING_TOTAL_AMOUNT,
			ERRORS.MISSING_DEBTOR
		]);
	});
});
