"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { defaultSystem, ChakraProvider } from "@chakra-ui/react";

import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

export function LayoutProvider(props: ColorModeProviderProps) {
	return (
		<ChakraProvider value={defaultSystem}>
			<ThemeProvider attribute="class" disableTransitionOnChange>
				<ColorModeProvider {...props} />
			</ThemeProvider>
		</ChakraProvider>
	);
}
