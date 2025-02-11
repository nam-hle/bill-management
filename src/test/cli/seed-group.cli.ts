#!/usr/bin/env tsx

import { seedGroup } from "@/test/functions/seed-group";

async function main() {
	try {
		await seedGroup();
	} catch (error) {
		console.error("Error creating user:", error);
	}
}

main();
