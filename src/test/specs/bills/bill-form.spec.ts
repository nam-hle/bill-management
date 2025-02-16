import { expect } from "@playwright/test";

import { test } from "@/test/setup";
import { FULL_NAMES } from "@/test/utils";
import { Actions } from "@/test/helpers/actions";
import { Locators } from "@/test/helpers/locators";
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
						creditor: `${FULL_NAMES.RON} (90)`,
						debtors: [`${FULL_NAMES.HERMIONE} (30)`, `${FULL_NAMES.DUMBLEDORE} (40)`, `${FULL_NAMES.RON} (20)`]
					}
				]
			}
		},
		{
			description: "As creditor only",
			statsExpectation: { Paid: "90", "Net Balance": "90" },
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
						creditor: `${FULL_NAMES.HARRY} (90)`,
						debtors: [`${FULL_NAMES.HERMIONE} (30)`, `${FULL_NAMES.DUMBLEDORE} (40)`, `${FULL_NAMES.RON} (20)`]
					}
				]
			}
		},
		{
			description: "As debtor only",
			statsExpectation: { Owed: "20", "Net Balance": "-20" },
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
						creditor: `${FULL_NAMES.RON} (100)`,
						debtors: [`${FULL_NAMES.HARRY} (20)`, `${FULL_NAMES.HERMIONE} (35)`, `${FULL_NAMES.DUMBLEDORE} (45)`]
					}
				]
			}
		},
		{
			description: "As creditor and debtor",
			statsExpectation: { Paid: "60", "Net Balance": "60" },
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
						creditor: `${FULL_NAMES.HARRY} (90)`,
						debtors: [`${FULL_NAMES.HARRY} (30)`, `${FULL_NAMES.DUMBLEDORE} (40)`, `${FULL_NAMES.RON} (20)`]
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
			const recentBills = await Locators.locateTable(page, 0);

			await Assertions.assertBillsTable(recentBills, testCase.expectedRecentTable);
			await Assertions.assertStats(page, testCase.statsExpectation);
		});
	}
});
