import React from "react";
import NextLink from "next/link";
import { type Container } from "@/types";
import { type LinkProps, Link as ChakraLink } from "@chakra-ui/react";

const MyButton: React.ForwardRefRenderFunction<HTMLAnchorElement, LinkProps> = (
  props,
  ref,
) => {
  return (
    <ChakraLink
      ref={ref}
      color="{colors.fg}"
      fontSize="{fontSizes.md}"
      borderColor="{colors.fg}"
      fontWeight="{fontWeights.medium}"
    >
      {props.children}
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
