import React from "react";
import NextLink from "next/link";

import { TableBodySkeleton } from "@/components/table-body-skeleton";
import { type DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";

import { type Linkable, type Container, type Identifiable } from "@/types";

export namespace DataTable {
	export interface Props<RowType extends Identifiable & Linkable, ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>> {
		columns: ColumnType[];
		toolbar?: React.ReactNode;
		data: RowType[] | undefined;
		pagination?: DataTablePagination.Props;
	}

	export interface BaseColumnType<RowType extends Identifiable> {
		readonly key: string;
		readonly label: string;
		readonly titleGetter?: (params: { row: RowType }) => string;
		readonly dataGetter: (params: { row: RowType }) => React.ReactNode;
	}
}

export function DataTable<
	RowType extends Identifiable & Linkable,
	ColumnType extends DataTable.BaseColumnType<RowType> = DataTable.BaseColumnType<RowType>
>(props: DataTable.Props<RowType, ColumnType>) {
	const { data, columns, toolbar } = props;

	return (
		<div className="space-y-4">
			{toolbar}
			<div className="rounded-md border">
				<Table data-testid="table__settled">
					<TableHeader>
						<TableRow>
							{columns.map((column) => {
								return <TableHead key={column.key}>{column.label}</TableHead>;
							})}
						</TableRow>
					</TableHeader>
					<TableBody>
						{data === undefined ? (
							<TableBodySkeleton numberOfRows={5} numberOfCols={columns.length} />
						) : (
							data.map((row) => (
								<LinkedTableRow key={row.id} href={row.href}>
									{columns.map((column) => {
										return <TableCell key={column.key}>{column.dataGetter({ row })}</TableCell>;
									})}
								</LinkedTableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
			{/*<DataTablePagination />*/}
		</div>
	);
}

const ForwardedTableRow = React.forwardRef<HTMLTableRowElement, Container & React.HTMLAttributes<HTMLTableRowElement>>(
	function ForwardedRow(props, ref) {
		const { children, ...rest } = props;

		return (
			<TableRow ref={ref} {...rest}>
				{children}
			</TableRow>
		);
	}
);

export const LinkedTableRow: React.FC<{ href?: string } & Container & React.HTMLAttributes<HTMLTableRowElement>> = ({ href, ...props }) => {
	if (href === undefined) {
		return <ForwardedTableRow {...props} />;
	}

	return (
		<NextLink passHref prefetch href={href} legacyBehavior>
			<ForwardedTableRow {...props} className="cursor-pointer" />
		</NextLink>
	);
};
