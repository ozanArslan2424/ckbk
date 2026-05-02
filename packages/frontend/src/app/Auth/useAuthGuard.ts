import { useState, useEffect } from "react";

import { useAppContext } from "@/app/AppContext";

export function useAuthGuard({
	onSuccess,
	onError,
}: {
	onSuccess?: () => void;
	onError?: () => void;
}) {
	const { queryClient, profileClient, store, authClient } = useAppContext();
	const [isPending, setIsPending] = useState(true);

	useEffect(() => {
		async function init() {
			try {
				await authClient.ensureAccessToken();
				const res = await queryClient.fetchQuery(profileClient.get({}));
				console.log(res);
				store.set("auth", res);
				onSuccess?.();
			} catch {
				onError?.();
			} finally {
				setIsPending(false);
			}
		}

		void init();
		// oxlint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps
	}, []);

	return { isPending };
}
