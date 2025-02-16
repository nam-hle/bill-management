import React from "react";

import { Pagination, PaginationItem, PaginationLink, PaginationNext, PaginationContent, PaginationPrevious } from "@/components/shadcn/pagination";

export namespace DataTablePagination {
	export interface Props {
		readonly fullSize: number;
		readonly pageSize: number;
		// 1-based
		readonly pageNumber: number;
		readonly onPageChange: (pageNumber: number) => void;
	}
}
export const DataTablePagination: React.FC<DataTablePagination.Props> = () => {
	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious href="#" />
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#" isActive>
						1
					</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationNext href="#" />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};
