import { devices, defineConfig } from "@playwright/test";

const LOCAL_PORT: number = 3000;
const PROD = LOCAL_PORT === 4000;
const profiles = {
	CI: {
		port: 4000,
		retries: 2,
		timeout: 60_000,
		reporter: "list",
		forbidOnly: false,
		command: "pnpm start",
		expectTimeout: 20_000,
		reuseExistingServer: false,
		video: "retain-on-failure"
	},
	LOCAL: {
		retries: 0,
		video: "on",
		port: LOCAL_PORT,
		reporter: "html",
		forbidOnly: false,
		reuseExistingServer: true,
		timeout: PROD ? 30_000 : 30_000,
		expectTimeout: PROD ? 30_000 : 60_000,
		command: PROD ? "pnpm start" : "pnpm dev"
	}
} as const;

const profile = profiles[process.env.CI ? "CI" : "LOCAL"];

export default defineConfig({
	fullyParallel: false,
	timeout: profile.timeout,
	retries: profile.retries,
	reporter: profile.reporter,
	testDir: "./src/test/specs",
	forbidOnly: profile.forbidOnly,
	expect: {
		timeout: profile.expectTimeout
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] }
		}
	],
	use: {
		video: profile.video,
		trace: "retain-on-failure",
		baseURL: `http://127.0.0.1:${profile.port}`
	},

	webServer: {
		stdout: "pipe",
		stderr: "pipe",
		timeout: 60_000,
		command: profile.command,
		url: `http://127.0.0.1:${profile.port}`,
		reuseExistingServer: profile.reuseExistingServer
	}
});
