"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { type Container } from "@/types";

export const ReactQueryClientProvider = ({ children }: Container) => {
	const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 60 * 1000 } } }));

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
