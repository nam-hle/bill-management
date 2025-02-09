import { type Page } from "@playwright/test";

import { TableLocator } from "@/test/locators/table-locator";

export namespace Locators {
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
