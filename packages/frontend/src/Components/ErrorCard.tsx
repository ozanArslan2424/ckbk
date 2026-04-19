import { Link } from "react-router";

import { useCommonLocale } from "@/Locale/useCommonLocale";
import { routes } from "@/router";

export function ErrorCard({ error }: { error: Error | null | string }) {
	const { txt } = useCommonLocale();

	return (
		<div className="flex min-h-screen w-full items-center justify-center">
			<div className="card">
				<header>
					<h1>{txt.error}</h1>
					<p>{typeof error === "string" ? error : error?.message || txt.error}</p>
				</header>
				<article>
					<Link to={routes.dashboard}>
						<button>{txt.back}</button>
					</Link>
				</article>
			</div>
		</div>
	);
}
