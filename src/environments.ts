export const Environments = {
	PUBLIC: {
		SUPABASE: {
			URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
			ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
		}
	},
	PRIVATE: {
		SUPABASE: {
			// For testing only
			SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!
		},
		VIETQR: {
			API_KEY: process.env.VIETQR_API_KEY!,
			CLIENT_ID: process.env.VIETQR_CLIENT_ID!
		}
	}
};
