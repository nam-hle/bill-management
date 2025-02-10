import { devices, defineConfig } from "@playwright/test";

const CI = process.env.CI;
const port = CI ? 4000 : 3000;

export default defineConfig({
	forbidOnly: !!CI,
	retries: CI ? 2 : 0,
	fullyParallel: false,
	testDir: "./src/test/specs",
	reporter: CI ? "list" : "html",
	expect: {
		timeout: CI ? 30_000 : 5_000
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] }
		}
	],
	use: {
		trace: "on-first-retry",
		baseURL: `http://127.0.0.1:${port}`,
		video: CI ? "retain-on-failure" : "on"
	},

	webServer: {
		port,
		stdout: "pipe",
		stderr: "pipe",
		timeout: 60_000,
		reuseExistingServer: !CI,
		command: CI ? "pnpm start" : "pnpm dev"
	}
});
