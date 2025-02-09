import React from "react";
import { MdCheck } from "react-icons/md";

import { type Container } from "@/types";
import { Button, type ButtonProps } from "@/chakra/button";

export const FilterButton: React.FC<Container & ButtonProps & { active: boolean }> = (props) => {
	const { active, children, ...rest } = props;

	return (
		<Button size="sm" variant={active ? "surface" : "outline"} colorPalette={active ? "blue" : undefined} {...rest}>
			{active ? <MdCheck /> : undefined}
			{children}
		</Button>
	);
};
