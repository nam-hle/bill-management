import React from "react";
import NextLink from "next/link";
import { type LinkProps, Link as ChakraLink } from "@chakra-ui/react";

import { type Container } from "@/types";

const MyButton: React.ForwardRefRenderFunction<HTMLAnchorElement, LinkProps> = (
  props,
  ref,
) => {
  const { children, ...rest } = props;

  return (
    <ChakraLink
      {...rest}
      ref={ref}
      fontSize="{fontSizes.md}"
      fontWeight="{fontWeights.medium}"
    >
      {children}
    </ChakraLink>
  );
};

const ForwardedMyButton = React.forwardRef(MyButton);

export const Link: React.FC<{ href: string } & LinkProps & Container> = ({
  href,
  ...props
}) => (
  <NextLink passHref prefetch href={href} legacyBehavior>
    <ForwardedMyButton {...props} />
  </NextLink>
);
