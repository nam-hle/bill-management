import test, { expect } from "@playwright/test";

import { Actions } from "@/test/helpers/actions";
import { truncate } from "@/test/functions/truncate";
import { USERNAMES, getCurrentDate } from "@/test/utils";
import { createRequester } from "@/test/helpers/requester";
import { selectGroup } from "@/test/functions/select-group";
import { seedBasicPreset, type BasicPreset } from "@/test/functions/seed-basic-preset";

let billId: string;
let preset: BasicPreset;

test.beforeAll("Create a bill in Gryffindor group", async () => {
	await truncate();
	preset = await seedBasicPreset();

	const requester = await createRequester(USERNAMES.harry);

	await requester.user.selectGroup.mutate({ groupId: preset.groups.Gryffindor.id });
	await requester.bills.create.mutate({
		receiptFile: null,
		issuedAt: getCurrentDate(),
		description: "Team building",
		creditor: { amount: 100, userId: preset.userIds.ron },
		debtors: [
			{ amount: 40, userId: preset.userIds.harry },
			{ amount: 60, userId: preset.userIds.ron }
		]
	});

	const bills = await requester.bills.getMany.query({});

	expect(bills.data).toHaveLength(1);
	billId = bills.data[0].id;
});

test.beforeEach(async () => {
	await selectGroup(preset);
});

test.describe("Bills Page", () => {
	const url = "/bills";
	test("Redirect to login page if not login", async ({ page }) => {
		await page.goto(url);

		await expect(page).toHaveURL("/login");
	});

	test("Show selection group message if not select group", async ({ page }) => {
		await selectGroup(preset, { harry: null });
		await Actions.login(page, USERNAMES.harry);
		await page.goto(url);

		await expect(page.getByText("Group Selection Required")).toBeVisible();
	});

	test("Show no bills when select Hogwarts group", async ({ page }) => {
		await selectGroup(preset, { harry: "Hogwarts" });
		await Actions.login(page, USERNAMES.harry);
		await page.goto(url);

		await expect(page.getByText("Bills (0)")).toBeVisible();
	});

	test("Show one bill when select Gryffindor group", async ({ page }) => {
		await selectGroup(preset, { harry: "Gryffindor" });
		await Actions.login(page, USERNAMES.harry);
		await page.goto(url);

		await expect(page.getByText("Bills (1)")).toBeVisible();
	});
});

test.describe("Create Bill Page", () => {
	const url = "/bills/new";

	test("Redirect to login page if not login", async ({ page }) => {
		await page.goto(url);

		await expect(page).toHaveURL("/login");
	});

	test("Show selection group message if not select group", async ({ page }) => {
		await selectGroup(preset, { harry: null });
		await Actions.login(page, USERNAMES.harry);
		await page.goto(url);

		await expect(page.getByText("Group Selection Required")).toBeVisible();
	});
});

test.describe("Bill Details Page", () => {
	test("Redirect to login page if not login", async ({ page }) => {
		await page.goto(`/bills/${billId}`);

		await expect(page).toHaveURL("/login");
	});

	test("Users outside the group can not access the page", async ({ page }) => {
		await Actions.login(page, USERNAMES.snape);
		await page.goto(`/bills/${billId}`);

		await expect(page.getByText("Access Denied")).toBeVisible();
	});

	test("Group members can access the page but require select that group", async ({ page }) => {
		for (const username of [USERNAMES.harry, USERNAMES.ron, USERNAMES.hermione]) {
			await preset.requesters[username].user.selectGroup.mutate({ groupId: null });
			await Actions.login(page, username);
			await page.goto(`/bills/${billId}`);

			await expect(page.getByText("Switch Group Required")).toBeVisible();
			await expect(page.getByText("Bill Details")).not.toBeVisible();

			await Actions.logout(page);
		}
	});

	test("Group members can access the page", async ({ page }) => {
		for (const username of [USERNAMES.harry, USERNAMES.ron, USERNAMES.hermione]) {
			await preset.requesters[username].user.selectGroup.mutate({ groupId: preset.groups.Gryffindor.id });
			await Actions.login(page, username);
			await page.goto(`/bills/${billId}`);

			await expect(page.getByText("Switch Group Required")).not.toBeVisible();
			await expect(page.getByText("Bill Details")).toBeVisible();

			await Actions.logout(page);
		}
	});
});
