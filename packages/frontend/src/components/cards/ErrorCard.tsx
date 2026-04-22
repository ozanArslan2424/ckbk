import { AlertTriangleIcon } from "lucide-react";
import { Link } from "react-router";

import { useCommonLocale } from "@/hooks/useCommonLocale";
import { routes } from "@/router";

export function ErrorCard({ error }: { error: Error | null | string }) {
	const { txt } = useCommonLocale();
	const message = typeof error === "string" ? error : (error?.message ?? txt.error);

	return (
		<div className="flex min-h-screen w-full items-center justify-center p-6">
			<div className="card w-full max-w-md">
				<article className="flex flex-col items-center gap-6 py-10 text-center">
					<div className="squircle accent xl">
						<AlertTriangleIcon />
					</div>
					<div className="flex flex-col gap-1.5">
						<h2 className="text-xl font-black">{txt.error}</h2>
						<p className="text-muted-foreground text-sm">{message}</p>
					</div>
					<Link to={routes.dashboard}>
						<button type="button" className="outlined sm">
							{txt.back}
						</button>
					</Link>
				</article>
			</div>
		</div>
	);
}
