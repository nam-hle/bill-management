import { test } from "@/test/setup";
import { FULL_NAMES } from "@/test/constants";
import { Actions } from "@/test/helpers/actions";
import { Locators } from "@/test/helpers/locators";
import { Assertions } from "@/test/helpers/assertions";
import { seedGroup } from "@/test/functions/seed-group";

// TODO: Assert bill tables as well
// TODO: Assert toast notifications
// TODO: Assert bill form validation
// TODO: Assert bill metadata

test.describe("basic", () => {
	const testCases: {
		description: string;
		formParams: Actions.BillFormParams;
		statsExpectation: Assertions.StatsExpectation;
		expectedRecentTable: Assertions.BillsTableExpectation;
	}[] = [
		{
			statsExpectation: {},
			description: "As creator only",
			expectedRecentTable: {
				rows: [],
				heading: "Recent bills"
			},
			formParams: {
				description: "Dinner",
				creditor: { amount: "90", name: FULL_NAMES.RON },
				debtors: [
					{ amount: "30", name: FULL_NAMES.HERMIONE },
					{ amount: "40", name: FULL_NAMES.DUMBLEDORE },
					{ amount: "20", name: FULL_NAMES.RON }
				]
			}
		},
		{
			description: "As creditor only",
			statsExpectation: { Paid: "90", "Net Balance": "90" },
			expectedRecentTable: {
				heading: "Recent bills",
				rows: [
					{
						description: "Dinner",
						creditor: `${FULL_NAMES.HARRY} (90)`,
						debtors: [`${FULL_NAMES.HERMIONE} (30)`, `${FULL_NAMES.DUMBLEDORE} (40)`, `${FULL_NAMES.RON} (20)`]
					}
				]
			},
			formParams: {
				description: "Dinner",
				creditor: { amount: "90", name: FULL_NAMES.HARRY },
				debtors: [
					{ amount: "30", name: FULL_NAMES.HERMIONE },
					{ amount: "40", name: FULL_NAMES.DUMBLEDORE },
					{ amount: "20", name: FULL_NAMES.RON }
				]
			}
		},
		{
			description: "As debtor only",
			statsExpectation: { Owed: "20", "Net Balance": "-20" },
			expectedRecentTable: {
				heading: "Recent bills",
				rows: [
					{
						description: "Dinner",
						creditor: `${FULL_NAMES.RON} (100)`,
						debtors: [`${FULL_NAMES.HARRY} (20)`, `${FULL_NAMES.HERMIONE} (35)`, `${FULL_NAMES.DUMBLEDORE} (45)`]
					}
				]
			},
			formParams: {
				description: "Dinner",
				creditor: { amount: "100", name: FULL_NAMES.RON },
				debtors: [
					{ amount: "20", name: FULL_NAMES.HARRY },
					{ amount: "35", name: FULL_NAMES.HERMIONE },
					{ amount: "45", name: FULL_NAMES.DUMBLEDORE }
				]
			}
		},
		{
			description: "As creditor and debtor",
			statsExpectation: { Paid: "60", "Net Balance": "60" },
			expectedRecentTable: {
				heading: "Recent bills",
				rows: [
					{
						description: "Dinner",
						creditor: `${FULL_NAMES.HARRY} (90)`,
						debtors: [`${FULL_NAMES.HARRY} (30)`, `${FULL_NAMES.DUMBLEDORE} (40)`, `${FULL_NAMES.RON} (20)`]
					}
				]
			},
			formParams: {
				description: "Dinner",
				creditor: { amount: "90", name: FULL_NAMES.HARRY },
				debtors: [
					{ amount: "30", name: FULL_NAMES.HARRY },
					{ amount: "40", name: FULL_NAMES.DUMBLEDORE },
					{ amount: "20", name: FULL_NAMES.RON }
				]
			}
		}
	];

	for (const testCase of testCases) {
		test(testCase.description, async ({ page }) => {
			await seedGroup();

			await Actions.login(page, "harry");

			await Actions.goToBillsPage(page);
			await Actions.fillBillForm(page, testCase.formParams);

			await Actions.submitBillForm(page);

			await Actions.goToHomePage(page);
			const recentBills = await Locators.locateTable(page, 0);

			await Assertions.assertBillsTable(recentBills, testCase.expectedRecentTable);
			await Assertions.assertStats(page, testCase.statsExpectation);
		});
	}
});
