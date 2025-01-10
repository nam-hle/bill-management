import React from "react";
import { type Container } from "@/types";
import { Link } from "@/components/ui/link";
import { Box, Stack } from "@chakra-ui/react";

export const RootContainer: React.FC<Container> = (props) => {
  return (
    <>
      <Box
        as="header"
        marginInline="auto"
        maxWidth="{sizes.8xl}"
        paddingInline="{spacing.8}"
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
      </Box>
      <Box
        as="main"
        marginInline="auto"
        maxWidth="{sizes.8xl}"
        paddingInline="{spacing.8}"
      >
        {props.children}
      </Box>
    </>
  );
};
