export const DEFAULT_PASSWORD = "123456";

export type USER_KEY = keyof typeof USERNAMES;

export interface BillMember {
	name: string;
	amount: string;
}

export const FULL_NAMES = {
	RON: "Ron Weasley",
	HARRY: "Harry Potter",
	SNAPE: "Severus Snape",
	HERMIONE: "Hermione Granger",
	DUMBLEDORE: "Albus Dumbledore"
} as const;

export const USERNAMES = {
	RON: "ron",
	HARRY: "harry",
	SNAPE: "snape",
	HERMIONE: "hermione",
	DUMBLEDORE: "dumbledore"
} as const;
