#!/usr/bin/env tsx

import { seedRon, seedHarry, seedHermione } from "@/test/functions/seed-user";

async function main() {
	try {
		await seedHarry();
		await seedRon();
		await seedHermione();
	} catch (error) {
		console.error("Error creating user:", error);
	}
}

main();
