import Fs from "fs/promises";

async function writeEnvFile() {
	const fileContent = await Fs.readFile(".env", "utf-8");

	const envs: Record<string, string> = {};

	for (const line of fileContent.trim().split("\n")) {
		const [key, value] = line.split("=");
		envs[`SUPABASE_${key}`] = value;
	}

	envs[`NEXT_PUBLIC_SUPABASE_URL`] = envs["SUPABASE_API_URL"];
	envs[`NEXT_PUBLIC_SUPABASE_ANON_KEY`] = envs["SUPABASE_ANON_KEY"];

	await Fs.writeFile(
		".env.local",
		Object.entries(envs)
			.map(([key, value]) => `${key}=${value}`)
			.join("\n")
	);
}

writeEnvFile()
	.then(() => {
		console.log("Done!");
	})
	.catch((err) => {
		console.error(err);
	});
