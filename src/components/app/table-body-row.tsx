import React from "react";
import NextLink from "next/link";
import { Table, type TableRowProps } from "@chakra-ui/react";

import type { Container } from "@/types";

const ForwardedTableRow = React.forwardRef<HTMLTableRowElement, TableRowProps & Container>(function ForwardedRow(props, ref) {
	const { children, ...rest } = props;

	return (
		<Table.Row ref={ref} {...rest}>
			{children}
		</Table.Row>
	);
});

export const LinkedTableRow: React.FC<{ href: string } & TableRowProps & Container> = ({ href, ...props }) => (
	<NextLink passHref prefetch href={href} legacyBehavior>
		<ForwardedTableRow {...props} cursor="pointer" />
	</NextLink>
);
