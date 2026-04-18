import { isRouteErrorResponse, useRouteError } from "react-router";

import { ErrorCard } from "../Components/ui/error-card";

export function ErrorBoundary() {
	const error = useRouteError();
	const isNotFound = isRouteErrorResponse(error) && error.status === 404;
	return <ErrorCard error={isNotFound ? "404 | Not Found" : (error as Error)} />;
}
