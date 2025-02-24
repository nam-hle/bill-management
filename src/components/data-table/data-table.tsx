import React from "react";
import NextLink from "next/link";

import { Table, TableRow, TableBody, TableCell, TableHead, TableHeader } from "@/components/shadcn/table";

import { EmptyState } from "@/components/empty-state";
import { TypographyH1 } from "@/components/typography";
import { TableBodySkeleton } from "@/components/data-table/table-body-skeleton";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";

import { cn } from "@/utils/cn";
import { type Linkable, type ClassName, type Container, type Identifiable } from "@/types";

export namespace DataTable {
	export interface Props<RowType extends Identifiable & Linkable, ColumnType extends BaseColumnType<RowType> = BaseColumnType<RowType>> {
		title: string;
		loading?: boolean;
		filtering?: boolean;
		columns: ColumnType[];
		action?: React.ReactNode;
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
	const { data, title, action, columns, toolbar, loading, filtering, pagination } = props;

	return (
		<div className="w-full space-y-4">
			<div data-testid="table-heading" className="flex w-full flex-row items-center justify-between">
				<TypographyH1>{title + (pagination?.fullSize ? ` (${pagination.fullSize})` : "")}</TypographyH1>
				{action}
			</div>
			{toolbar}
			<div className="rounded-md border">
				<Table data-testid="table__settled">
					<TableHeader>
						<TableRow className="h-16">
							{columns.map((column) => {
								return <TableHead key={column.key}>{column.label}</TableHead>;
							})}
						</TableRow>
					</TableHeader>
					<TableBody>
						{data === undefined || loading ? (
							<TableBodySkeleton numberOfRows={5} numberOfCols={columns.length} />
						) : data.length === 0 ? (
							<TableRow>
								<TableCell colSpan={columns.length}>
									<EmptyState title={filtering ? `No matched ${title.toLowerCase()} found` : `You have no ${title.toLowerCase()} yet`} />
								</TableCell>
							</TableRow>
						) : (
							data.map((row) => (
								<LinkedTableRow key={row.id} href={row.href} className="h-16">
									{columns.map((column) => {
										return (
											<TableCell key={column.key} title={column.titleGetter?.({ row })}>
												{column.dataGetter({ row })}
											</TableCell>
										);
									})}
								</LinkedTableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination {...props.pagination} />
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

export const LinkedTableRow: React.FC<{ href?: string } & ClassName & Container & React.HTMLAttributes<HTMLTableRowElement>> = ({
	href,
	...props
}) => {
	if (href === undefined) {
		return <ForwardedTableRow {...props} />;
	}

	return (
		<NextLink passHref prefetch href={href} legacyBehavior>
			<ForwardedTableRow {...props} className={cn(props.className, "cursor-pointer")} />
		</NextLink>
	);
};
