import React from "react";

import { type DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";

import { type Identifiable } from "@/types";

export namespace DataTable {
	export interface Props<RowType extends Identifiable, ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>> {
		data: RowType[];
		columns: ColumnType[];
		pagination?: DataTablePagination.Props;
	}

	export interface BaseColumnType<RowType extends Identifiable> {
		readonly key: string;
		readonly label: string;
		readonly titleGetter?: (params: { row: RowType }) => string;
		readonly dataGetter: (params: { row: RowType }) => React.ReactNode;
	}
}

export function DataTable<RowType extends Identifiable, ColumnType extends DataTable.BaseColumnType<RowType> = DataTable.BaseColumnType<RowType>>(
	props: DataTable.Props<RowType, ColumnType>
) {
	const { data, columns } = props;

	return (
		<div>
			<Table data-testid="table__settled">
				<TableHeader>
					<TableRow>
						{columns.map((column) => {
							return <TableHead key={column.key}>{column.label}</TableHead>;
						})}
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((row) => (
						<TableRow key={row.id}>
							{columns.map((column) => {
								return <TableCell key={column.key}>{column.dataGetter({ row })}</TableCell>;
							})}
						</TableRow>
					))}
				</TableBody>
			</Table>
			{/*<DataTablePagination />*/}
		</div>
	);
}
