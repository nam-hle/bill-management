"use client";

import React from "react";
import { defaultConditions } from "@chakra-ui/react/preset-base";
import { createSystem, defaultConfig, ChakraProvider } from "@chakra-ui/react";

import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

export const system = createSystem({
	...defaultConfig,
	preflight: false,
	cssVarsRoot: ".ck",
	conditions: { ...defaultConditions, light: ".ck" }
});

export function Provider(props: ColorModeProviderProps) {
	return (
		<ChakraProvider value={system}>
			<ColorModeProvider {...props} />
		</ChakraProvider>
	);
}
