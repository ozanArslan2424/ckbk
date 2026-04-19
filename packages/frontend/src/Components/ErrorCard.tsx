import { Link } from "react-router";

import { useLocale } from "@/Locale/useLocale";
import { routes } from "@/router";

export function ErrorCard({ error }: { error: Error | null | string }) {
	const { t } = useLocale("common");
	const txt = {
		title: t("error"),
		description: typeof error === "string" ? error : error?.message || t("retry"),
		back: t("back"),
	};

	return (
		<div className="flex min-h-screen w-full items-center justify-center">
			<div className="card">
				<header>
					<h1>{txt.title}</h1>
					<p>{txt.description}</p>
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
