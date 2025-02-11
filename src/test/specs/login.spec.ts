import { expect } from "@playwright/test";

import { test } from "@/test/setup";
import { Actions } from "@/test/helpers/actions";
import { seedUser } from "@/test/functions/seed-user";
import { FULL_NAMES, DEFAULT_PASSWORD } from "@/test/utils";

test("Login should fail with incorrect credentials", async ({ page }) => {
	await page.goto("/");

	await expect(page).toHaveURL("/login");

	await Actions.fillInput(page, "email", "harry@example.com");
	await Actions.fillInput(page, "password", DEFAULT_PASSWORD);
	await Actions.submit(page);

	await expect(page.locator(".chakra-alert__root")).toHaveText("Invalid login credentials");

	await seedUser({ email: "harry", fullName: FULL_NAMES.HARRY });

	await Actions.submit(page);

	await expect(page).toHaveURL("/");
	await expect(page.locator("h1").first()).toHaveText("Balance");
});
