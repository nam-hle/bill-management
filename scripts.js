const fs = require("fs");
const { exec } = require("child_process");

function runCommand(command, callback) {
	exec(command, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error: ${error.message}`);

			return;
		}

		if (stderr) {
			console.error(`stderr: ${stderr}`);
		}

		callback(stdout.trim());
	});
}

runCommand("supabase status", (statusOutput) => {
	console.log("Supabase Status Output:\n", statusOutput);

	const SUPABASE_URL = extractConfig(statusOutput, "Supabase URL", /API URL:\s*(\S+)/);
	const SUPABASE_SERVICE_ROLE_KEY = extractConfig(statusOutput, "Service role key", /service_role key:\s*(\S+)/);
	const SUPABASE_ANON_KEY = extractConfig(statusOutput, "Anon key", /anon key:\s*(\S+)/);

	const environments = {
		SUPABASE_SERVICE_ROLE_KEY,
		NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
		NEXT_PUBLIC_SUPABASE_ANON_KEY: SUPABASE_ANON_KEY
	};

	for (const [key, value] of Object.entries(environments)) {
		console.log(`${key}=${value.split("").map((e) => e.charCodeAt(0))}`);
	}

	fs.writeFileSync(
		process.env.CI ? ".env.local" : ".env.test.local",
		Object.entries(environments)
			.map(([key, value]) => {
				console.log(value.split("").map((e) => e.charCodeAt(0)));

				return `${key}=${value}`;
			})
			.join("\n")
	);
});

function extractConfig(output, name, pattern) {
	const match = output.match(pattern);

	if (!match) {
		throw new Error(`Could not extract ${name} from output`);
	}

	if (match) {
		console.log(`Extracted ${name}:`, match[1]);

		return match[1];
	}
}
