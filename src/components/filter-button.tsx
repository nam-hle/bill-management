import React from "react";
import { MdCheck } from "react-icons/md";

import { Button } from "@/components/shadcn/button";

import { type Container } from "@/types";

export const FilterButton: React.FC<Container & { active: boolean }> = (props) => {
	const { active, children, ...rest } = props;

	return (
		<Button size="sm" variant={active ? "secondary" : "outline"} {...rest}>
			{active ? <MdCheck /> : undefined}
			{children}
		</Button>
	);
};
