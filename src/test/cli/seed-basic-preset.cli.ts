#!/usr/bin/env tsx

import { seedBasicPreset } from "@/test/functions/seed-basic-preset";

async function main() {
	try {
		await seedBasicPreset();
	} catch (error) {
		console.error("Error creating user:", error);
	}
}

main();
