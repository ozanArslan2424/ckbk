import { Link } from "react-router";

import { useLocale } from "@/lib/Locale/useLocale";
import { routes } from "@/router";

export function ErrorCard({ error }: { error: Error | null | string }) {
	const { t } = useLocale("common");
	const title = t("error");
	const description = typeof error === "string" ? error : error?.message || t("retry");

	return (
		<div className="flex min-h-screen w-full items-center justify-center">
			<div className="card">
				<h1>{title}</h1>
				<p>{description}</p>
				<Link to={routes.dashboard}>
					<button>{t("back")}</button>
				</Link>
			</div>
		</div>
	);
}
