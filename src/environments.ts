export const Environments = {
	PRIVATE: {
		VIETQR: {
			API_KEY: process.env.VIETQR_API_KEY!,
			CLIENT_ID: process.env.VIETQR_CLIENT_ID!
		}
	},
	PUBLIC: {
		SUPABASE: {
			URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
			ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
		}
	}
};
