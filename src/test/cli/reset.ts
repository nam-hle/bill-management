#!/usr/bin/env tsx

import { truncateTables } from "@/test/functions/truncate-tables";

async function main() {
	try {
		await truncateTables();
		console.log("Truncated tables");
	} catch (error) {
		console.error(error);
	}
}

main();
