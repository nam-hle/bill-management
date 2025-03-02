#!/usr/bin/env tsx

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { type UserName } from "@/test/utils";
import { seedUser } from "@/test/functions/seed-user";

const argv = yargs(hideBin(process.argv))
	.option("email", { type: "string", demandOption: true, describe: "User email" })
	.option("fullName", { type: "string", demandOption: true, describe: "Full name of the user" })
	.option("password", { type: "string", describe: "User password" })
	.help()
	.parseSync();

async function main() {
	try {
		const userId = await seedUser({ ...argv, email: argv.email as UserName });
		console.log("Created user with ID:", userId);
	} catch (error) {
		console.error("Error creating user:", error);
	}
}

main();
