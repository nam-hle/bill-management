import { test } from "@/test/setup";
import { FULL_NAMES } from "@/test/constants";
import { Actions } from "@/test/helpers/actions";
import { Locators } from "@/test/helpers/locators";
import { Assertions } from "@/test/helpers/assertions";
import { seedGroup } from "@/test/functions/seed-group";

test("As creditor only", async ({ page }) => {
	await seedGroup();

	await Actions.login(page, "harry");

	await Actions.goToBillsPage(page);
	await Actions.fillBillForm(page, {
		description: "Dinner",
		creditor: { amount: "90", name: FULL_NAMES.HARRY },
		debtors: [
			{ amount: "30", name: FULL_NAMES.HERMIONE },
			{ amount: "40", name: FULL_NAMES.DUMBLEDORE },
			{ amount: "20", name: FULL_NAMES.RON }
		]
	});

	await Actions.submitBillForm(page);
	// TODO: Assert bill tables as well

	await Actions.goToHomePage(page);

	const recentBills = await Locators.locateTable(page, 0);
	await Assertions.assertBillsTable(recentBills, {
		heading: "Recent bills",
		rows: [
			{
				description: "Dinner",
				creditor: `${FULL_NAMES.HARRY} (90)`,
				debtors: [`${FULL_NAMES.HERMIONE} (30)`, `${FULL_NAMES.DUMBLEDORE} (40)`, `${FULL_NAMES.RON} (20)`]
			}
		]
	});
	await Assertions.assertStats(page, { Paid: "90", "Net Balance": "90" });
});

test("basic", async ({ page }) => {
	await seedGroup();

	await Actions.login(page, "harry");

	await Actions.goToBillsPage(page);
	await Actions.fillBillForm(page, {
		description: "Dinner",
		creditor: { amount: "100", name: FULL_NAMES.RON },
		debtors: [
			{ amount: "20", name: FULL_NAMES.HARRY },
			{ amount: "35", name: FULL_NAMES.HERMIONE },
			{ amount: "45", name: FULL_NAMES.DUMBLEDORE }
		]
	});

	await Actions.submitBillForm(page);
	// TODO: Assert bill tables as well

	await Actions.goToHomePage(page);

	const recentBills = await Locators.locateTable(page, 0);
	await Assertions.assertBillsTable(recentBills, {
		heading: "Recent bills",
		rows: [
			{
				description: "Dinner",
				creditor: `${FULL_NAMES.RON} (100)`,
				debtors: [`${FULL_NAMES.HARRY} (20)`, `${FULL_NAMES.HERMIONE} (35)`, `${FULL_NAMES.DUMBLEDORE} (45)`]
			}
		]
	});
	await Assertions.assertStats(page, { Owed: "20", "Net Balance": "-20" });
});
