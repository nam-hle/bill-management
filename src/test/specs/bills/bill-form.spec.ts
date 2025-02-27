import { expect } from "@playwright/test";

import { test } from "@/test/setup";
import { FULL_NAMES } from "@/test/utils";
import { Actions } from "@/test/helpers/actions";
import { Assertions } from "@/test/helpers/assertions";
import { seedGroup } from "@/test/functions/seed-group";

test.describe("basic", () => {
	const testCases: {
		description: string;
		formParams: Actions.BillForm.FillParams;
		statsExpectation: Assertions.StatsExpectation;
		expectedRecentTable: Assertions.BillsTableExpectation;
	}[] = [
		{
			statsExpectation: {},
			description: "As creator only",
			formParams: {
				description: "Dinner",
				creditor: { amount: "90", name: FULL_NAMES.RON },
				debtors: [
					{ amount: "20", name: FULL_NAMES.RON },
					{ amount: "30", name: FULL_NAMES.HERMIONE },
					{ amount: "40", name: FULL_NAMES.DUMBLEDORE }
				]
			},
			expectedRecentTable: {
				pagination: null,
				heading: "Recent bills",
				rows: [
					{
						description: "Dinner",
						creditor: {
							amount: "90.000",
							name: `${FULL_NAMES.RON}`
						},
						debtors: [
							{
								amount: "30.000",
								name: `${FULL_NAMES.HERMIONE}`
							},
							{
								amount: "40.000",
								name: `${FULL_NAMES.DUMBLEDORE}`
							},
							{
								amount: "20.000",
								name: `${FULL_NAMES.RON}`
							}
						]
					}
				]
			}
		},
		{
			description: "As creditor only",
			statsExpectation: { Paid: "90.000", "Net Balance": "90.000" },
			formParams: {
				description: "Dinner",
				creditor: { amount: "90", name: FULL_NAMES.HARRY },
				debtors: [
					{ amount: "20", name: FULL_NAMES.RON },
					{ amount: "30", name: FULL_NAMES.HERMIONE },
					{ amount: "40", name: FULL_NAMES.DUMBLEDORE }
				]
			},
			expectedRecentTable: {
				pagination: null,
				heading: "Recent bills",
				rows: [
					{
						description: "Dinner",
						creditor: { amount: "90.000", name: FULL_NAMES.HARRY },
						debtors: [
							{ amount: "20.000", name: FULL_NAMES.RON },
							{ amount: "30.000", name: FULL_NAMES.HERMIONE },
							{ amount: "40.000", name: FULL_NAMES.DUMBLEDORE }
						]
					}
				]
			}
		},
		{
			description: "As debtor only",
			statsExpectation: { Owed: "20.000", "Net Balance": "-20.000" },
			formParams: {
				description: "Dinner",
				creditor: { amount: "100", name: FULL_NAMES.RON },
				debtors: [
					{ amount: "20", name: FULL_NAMES.HARRY },
					{ amount: "35", name: FULL_NAMES.HERMIONE },
					{ amount: "45", name: FULL_NAMES.DUMBLEDORE }
				]
			},
			expectedRecentTable: {
				pagination: null,
				heading: "Recent bills",
				rows: [
					{
						description: "Dinner",
						creditor: { amount: "100.000", name: FULL_NAMES.RON },
						debtors: [
							{ amount: "20.000", name: FULL_NAMES.HARRY },
							{ amount: "35.000", name: FULL_NAMES.HERMIONE },
							{ amount: "45.000", name: FULL_NAMES.DUMBLEDORE }
						]
					}
				]
			}
		},
		{
			description: "As creditor and debtor",
			statsExpectation: { Paid: "60.000", "Net Balance": "60.000" },
			formParams: {
				description: "Dinner",
				creditor: { amount: "90", name: FULL_NAMES.HARRY },
				debtors: [
					{ amount: "20", name: FULL_NAMES.RON },
					{ amount: "30", name: FULL_NAMES.HARRY },
					{ amount: "40", name: FULL_NAMES.DUMBLEDORE }
				]
			},
			expectedRecentTable: {
				pagination: null,
				heading: "Recent bills",
				rows: [
					{
						description: "Dinner",
						creditor: { amount: "90.000", name: FULL_NAMES.HARRY },
						debtors: [
							{ amount: "20.000", name: FULL_NAMES.RON },
							{ amount: "30.000", name: FULL_NAMES.HARRY },
							{ amount: "40.000", name: FULL_NAMES.DUMBLEDORE }
						]
					}
				]
			}
		}
	];

	for (const testCase of testCases) {
		test(testCase.description, async ({ page }) => {
			await seedGroup();

			await Actions.login(page, "harry");

			await Actions.goToBillsPage(page);
			await Actions.BillForm.fill(page, testCase.formParams);
			await Actions.submit(page);

			await expect(page).toHaveURL("/bills");

			await Actions.goToHomePage(page);

			await Assertions.assertBillsCardList(page, testCase.expectedRecentTable);
			await Assertions.assertStats(page, testCase.statsExpectation);
		});
	}
});
