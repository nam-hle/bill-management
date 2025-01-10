import React from "react";
import { Container } from "@/types";
import { Box, Stack } from "@chakra-ui/react";
import { Link } from "@/components/ui/link";

export const RootContainer: React.FC<Container> = (props) => {
  return (
    <>
      <Box
        as={"header"}
        paddingInline={"{spacing.8}"}
        maxWidth={"{sizes.8xl}"}
        marginInline={"auto"}
      >
        <Stack
          minHeight={"48px"}
          direction={"row"}
          alignItems={"center"}
          gap={"{spacing.8}"}
        >
          <Link href={"/users"}>Users</Link>
          <Link href={"/bills"}>Bills</Link>
        </Stack>
      </Box>
      <Box
        as={"main"}
        paddingInline={"{spacing.8}"}
        maxWidth={"{sizes.8xl}"}
        marginInline={"auto"}
      >
        {props.children}
      </Box>
    </>
  );
};
