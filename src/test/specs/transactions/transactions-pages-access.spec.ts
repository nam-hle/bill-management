import test, { expect } from "@playwright/test";

import { Actions } from "@/test/helpers/actions";
import { truncate } from "@/test/functions/truncate";
import { USERNAMES, getCurrentDate } from "@/test/utils";
import { createRequester } from "@/test/helpers/requester";
import { selectGroup } from "@/test/functions/select-group";
import { seedBasicPreset, type BasicPreset } from "@/test/functions/seed-basic-preset";

let transactionId: string;
let preset: BasicPreset;

test.beforeAll("Setup", async () => {
	await truncate();
	preset = await seedBasicPreset();

	const requester = await createRequester(USERNAMES.harry);

	await requester.user.selectGroup.mutate({ groupId: preset.groups.Gryffindor.id });
	await requester.transactions.create.mutate({ amount: 40, issuedAt: getCurrentDate(), receiverId: preset.userIds.ron });

	const transactions = await requester.transactions.getMany.query({ senderId: preset.userIds.harry, receiverId: preset.userIds.ron });

	expect(transactions.data).toHaveLength(1);
	transactionId = transactions.data[0].id;
});

test.beforeEach(async () => {
	await selectGroup(preset);
});

test.describe("Transactions Page", () => {
	const url = "/transactions";
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

	test("Show no transactions when select Hogwarts group", async ({ page }) => {
		await selectGroup(preset, { harry: "Hogwarts" });
		await Actions.login(page, USERNAMES.harry);
		await page.goto(url);

		await expect(page.getByText("Transactions (0)")).toBeVisible();
	});

	test("Show one transaction when select Gryffindor group", async ({ page }) => {
		await selectGroup(preset, { harry: "Gryffindor" });
		await Actions.login(page, USERNAMES.harry);
		await page.goto(url);

		await expect(page.getByText("Transactions (1)")).toBeVisible();
	});
});

test.describe("Create Transaction Page", () => {
	const url = "/transactions/new";

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

test.describe("Transaction Details Page", () => {
	const url = `/transactions/${transactionId}`;

	test("Assert transactionId", () => {
		expect(transactionId).toBeDefined();
	});

	test("Redirect to login page if not login", async ({ page }) => {
		await page.goto(url);

		await expect(page).toHaveURL("/login");
	});

	test("Users outside the group can not access the page", async ({ page }) => {
		await Actions.login(page, USERNAMES.snape);
		await page.goto(`/transactions/${transactionId}`);

		await expect(page.getByText("Access Denied")).toBeVisible();
	});

	// TODO: Check if we can allow sender and receiver to access the page only
	test("Group members can access the page but require select that group", async ({ page }) => {
		for (const username of [USERNAMES.harry, USERNAMES.ron, USERNAMES.hermione]) {
			await preset.requesters[username].user.selectGroup.mutate({ groupId: null });
			await Actions.login(page, username);
			await page.goto(`/transactions/${transactionId}`);

			await expect(page.getByText("Switch Group Required")).toBeVisible();
			await expect(page.getByText("Transaction Details")).not.toBeVisible();

			await Actions.logout(page);
		}
	});

	test("Group members can access the page", async ({ page }) => {
		for (const username of [USERNAMES.harry, USERNAMES.ron, USERNAMES.hermione]) {
			await preset.requesters[username].user.selectGroup.mutate({ groupId: preset.groups.Gryffindor.id });
			await Actions.login(page, username);
			await page.goto(`/transactions/${transactionId}`);

			await expect(page.getByText("Switch Group Required")).not.toBeVisible();
			await expect(page.getByText("Transaction Details")).toBeVisible();
			await Actions.logout(page);
		}
	});
});
