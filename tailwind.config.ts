import type { Config } from "tailwindcss";

export default {
	plugins: [],
	theme: {
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)"
			}
		}
	},
	content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"]
} satisfies Config;
