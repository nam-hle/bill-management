import React from "react";
import { Box, Stack, HStack } from "@chakra-ui/react";

import { type Container } from "@/types";
import { Link } from "@/components/ui/link";

export const RootContainer: React.FC<Container> = (props) => {
  return (
    <>
      <HStack
        as="header"
        marginInline="auto"
        maxWidth="{sizes.8xl}"
        paddingInline="{spacing.8}"
        justifyContent="space-between"
      >
        <Stack
          direction="row"
          minHeight="48px"
          gap="{spacing.8}"
          alignItems="center"
        >
          <Link href="/users">Users</Link>
          <Link href="/bills">Bills</Link>
        </Stack>
        <Stack
          direction="row"
          minHeight="48px"
          gap="{spacing.8}"
          alignItems="center"
        >
          <Link colorPalette="steal" href="/api/auth/login">
            Login
          </Link>
        </Stack>
      </HStack>
      <Box
        as="main"
        marginInline="auto"
        maxWidth="{sizes.8xl}"
        paddingTop="{spacing.4}"
        paddingInline="{spacing.8}"
        minHeight="calc(100vh - 48px)"
      >
        {props.children}
      </Box>
    </>
  );
};
