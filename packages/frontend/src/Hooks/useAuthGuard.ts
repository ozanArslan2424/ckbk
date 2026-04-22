import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { useAppContext } from "@/app/AppContext";
import { routes } from "@/router";

export function useAuthGuard() {
	const navigate = useNavigate();
	const { queryClient: query, authClient: auth, store } = useAppContext();
	const [isPending, setIsPending] = useState(true);

	useEffect(() => {
		async function init() {
			try {
				const res = await query.fetchQuery(auth.queryMe({}));
				store.set("auth", res);
			} catch {
				await navigate(routes.login);
			} finally {
				setIsPending(false);
			}
		}

		void init();
	}, [query, auth, store, navigate]);

	return { isPending };
}
