import NextLink from "next/link";
import { Link as ChakraLink, LinkProps } from "@chakra-ui/react";
import { Container } from "@/types";
import React from "react";

const MyButton: React.ForwardRefRenderFunction<HTMLAnchorElement, LinkProps> = (
  props,
  ref,
) => {
  return (
    <ChakraLink
      color={"{colors.fg}"}
      fontWeight={"{fontWeights.medium}"}
      fontSize={"{fontSizes.md}"}
      borderColor={"{colors.fg}"}
      ref={ref}
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
  <NextLink href={href} passHref legacyBehavior prefetch>
    <ForwardedMyButton {...props} />
  </NextLink>
);
