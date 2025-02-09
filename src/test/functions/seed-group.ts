import { seedRon, seedHarry, seedHermione } from "@/test/functions/seed-user";

export async function seedGroup() {
	await seedHarry();
	await seedRon();
	await seedHermione();
}
