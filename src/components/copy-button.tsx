"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/shadcn/button";

export const CopyButton = ({ text }: { text: string }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error("Failed to copy:", err);
		}
	};

	return (
		<Button size="sm" variant="outline" onClick={handleCopy}>
			{copied ? (
				<>
					<Check />
					Copied
				</>
			) : (
				"Copy"
			)}
		</Button>
	);
};
