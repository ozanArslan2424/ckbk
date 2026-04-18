import ReactDOM from "react-dom/client";

import { App } from "./app.tsx";

function main() {
	const el = document.getElementById("root");
	if (!el) throw new Error("DOM element not found.");
	const root = ReactDOM.createRoot(el);
	root.render(<App />);
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", main);
} else {
	main();
}
