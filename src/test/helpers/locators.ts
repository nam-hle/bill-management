import { type Page } from "@playwright/test";

import { TableLocator } from "@/test/locators/table-locator";

export namespace Locators {
	export const ErrorText = `.chakra-field__errorText`;
	export function locateErrors(page: Page) {
		return page.locator(ErrorText);
	}

	export function locateNotifications(page: Page) {
		return page.getByTestId("table").getByTestId("notification-text");
	}

	export function locateStatValue(page: Page, statLabel: string) {
		return page
			.locator(".chakra-stat__root", { has: page.locator(".chakra-stat__label", { hasText: statLabel }) })
			.locator(".chakra-stat__valueText");
	}

	export async function locateTable(page: Page, tableIndex: number = 0) {
		const table = new TableLocator(page, tableIndex);
		await table.init();

		return table;
	}
}
