import * as React from "react";
import { LuX } from "react-icons/lu";
import type { ButtonProps } from "@chakra-ui/react";
import { IconButton as ChakraIconButton } from "@chakra-ui/react";

export type CloseButtonProps = ButtonProps;

export const CloseButton = React.forwardRef<
  HTMLButtonElement,
  CloseButtonProps
>(function CloseButton(props, ref) {
  return (
    <ChakraIconButton ref={ref} variant="ghost" aria-label="Close" {...props}>
      {props.children ?? <LuX />}
    </ChakraIconButton>
  );
});
