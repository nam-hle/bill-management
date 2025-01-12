import React from "react";
import NextLink from "next/link";

import type { Container } from "@/types";
import { Button, type ButtonProps } from "@/components/ui/button";

const StyledButton: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonProps & { active?: boolean }> = (props, ref) => {
	const { children, active, size = "xs", ...rest } = props;

	return (
		<Button ref={ref} size={size} variant={active ? "outline" : "ghost"} {...rest}>
			{children}
		</Button>
	);
};

const ForwardedStyledButton = React.forwardRef(StyledButton);

export const LinkButton: React.FC<{ href: string; active?: boolean } & ButtonProps & Container> = ({ href, ...props }) => (
	<NextLink passHref prefetch href={href} legacyBehavior>
		<ForwardedStyledButton {...props} />
	</NextLink>
);
