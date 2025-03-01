"use client";
import superjson from "superjson";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getFetch, loggerLink, httpBatchLink, createTRPCReact } from "@trpc/react-query";

import { type Container } from "@/types";
import type { AppRouter } from "@/routers/app.router";

export const trpc = createTRPCReact<AppRouter>();

const queryClient = new QueryClient({
	defaultOptions: { queries: { staleTime: 5 * 1000 } }
});

export const TrpcProvider: React.FC<Container> = ({ children }) => {
	// NOTE: Your production URL environment variable may be different
	const url =
		process.env.NEXT_PUBLIC_APP_DOMAIN && !process.env.NEXT_PUBLIC_APP_DOMAIN.includes("localhost")
			? `https://www.${process.env.NEXT_PUBLIC_APP_DOMAIN}/api/trpc/`
			: "http://localhost:3000/api/trpc/";

	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				loggerLink({
					enabled: () => true
				}),
				httpBatchLink({
					url,
					transformer: superjson,
					fetch: async (input, init?) => {
						const fetch = getFetch();

						return fetch(input, {
							...init,
							credentials: "include"
						});
					}
				})
			]
		})
	);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	);
};
