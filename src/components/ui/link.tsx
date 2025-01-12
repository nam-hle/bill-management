import React from "react";
import NextLink from "next/link";
import { type LinkProps, Link as ChakraLink } from "@chakra-ui/react";

import { type Container } from "@/types";

const StyledLink: React.ForwardRefRenderFunction<HTMLAnchorElement, LinkProps & { active?: boolean }> = (props, ref) => {
	const { children, active, ...rest } = props;

	return (
		<ChakraLink {...rest} ref={ref} fontWeight={active ? "{fontWeights.medium}" : undefined}>
			{children}
		</ChakraLink>
	);
};

const ForwardedStyledLink = React.forwardRef(StyledLink);

export const Link: React.FC<{ href: string; active?: boolean } & LinkProps & Container> = ({ href, ...props }) => (
	<NextLink passHref prefetch href={href} legacyBehavior>
		<ForwardedStyledLink {...props} />
	</NextLink>
);
