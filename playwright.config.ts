import { devices, defineConfig } from "@playwright/test";

const profiles = {
	LOCAL: {
		port: 4000,
		retries: 0,
		video: "on",
		timeout: 20_000,
		reporter: "html",
		forbidOnly: false,
		expectTimeout: 10_000,
		reuseExistingServer: true
	},
	CI: {
		port: 4000,
		retries: 2,
		timeout: 60_000,
		reporter: "list",
		forbidOnly: true,
		expectTimeout: 20_000,
		reuseExistingServer: false,
		video: "retain-on-failure"
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
		command: "pnpm start",
		url: `http://127.0.0.1:${profile.port}`,
		reuseExistingServer: profile.reuseExistingServer
	}
});
