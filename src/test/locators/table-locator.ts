import { expect, type Page, type Locator } from "@playwright/test";

export class TableLocator {
	private readonly table: Locator;
	private headerCells: string[];

	constructor(
		private page: Page,
		private tableIndex: number = 0
	) {
		this.table = page.locator(`table`).nth(tableIndex);
		this.headerCells = [];
	}

	async init() {
		await this.page.locator(`table:nth-of-type(${this.tableIndex}) .chakra-skeleton`).first().waitFor({ state: "detached" });
		this.headerCells = await this.table.locator("thead tr th").allInnerTexts();

		return this;
	}

	getRow(rowIndex: number): Row {
		return new Row(this.table, rowIndex, this.headerCells);
	}
}

export class Row {
	private readonly row: Locator;
	private headerCells: string[];

	constructor(
		private table: Locator,
		rowIndex: number,
		headerCells: string[]
	) {
		this.row = this.table.locator(`tbody tr:nth-of-type(${rowIndex + 1})`);
		this.headerCells = headerCells;
	}

	getCell(columnLabel: string): Cell {
		const columnIndex = this.headerCells.indexOf(columnLabel);

		if (columnIndex === -1) {
			throw new Error(`Column '${columnLabel}' not found`);
		}

		return new Cell(this.row, columnIndex);
	}
}

export class Cell {
	private readonly cell: Locator;

	constructor(
		private row: Locator,
		columnIndex: number
	) {
		this.cell = this.row.locator(`td:nth-of-type(${columnIndex + 1})`);
	}

	get locator(): Locator {
		return this.cell;
	}

	async assertContent(expected: string) {
		const actualText = (await this.cell.innerText()).trim();
		expect(actualText).toBe(expected);
	}
}
