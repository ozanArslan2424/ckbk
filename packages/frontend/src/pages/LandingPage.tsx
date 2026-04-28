import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

import { useAppContext } from "@/app/AppContext";
import { PageContent } from "@/components/layout/PageContent";
import { useLocale } from "@/hooks/useLocale";
import { CONFIG } from "@/lib/CONFIG";
import { routes } from "@/router";

export function LandingPage() {
	const { txt } = useLocale("landing", {
		subtitle: ["subtitle"],
		welcomeBack: ["welcomeBack"],
		explore: ["explore"],
		tagline: ["tagline"],
		login: ["login"],
		register: ["register"],
		feature1Title: ["feature1Title"],
		feature1Body: ["feature1Body"],
		feature2Title: ["feature2Title"],
		feature2Body: ["feature2Body"],
		feature3Title: ["feature3Title"],
		feature3Body: ["feature3Body"],
		footnote: ["footnote"],
	});

	const { authClient } = useAppContext();
	const meQuery = useQuery(authClient.queryMe({}));
	const me = meQuery.data;

	return (
		<PageContent className="flex flex-1 flex-col">
			{/* Hero */}
			<section className="relative overflow-hidden">
				{/* warm gradient wash */}
				<div
					aria-hidden
					className="from-secondary/60 via-background to-tertiary/40 pointer-events-none absolute inset-0 -z-10 bg-linear-to-br"
				/>
				{/* subtle grid texture */}
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--foreground)_1px,transparent_1px)] bg-size-[24px_24px] opacity-[0.04]"
				/>

				<div className="mx-auto flex max-w-5xl flex-col items-start gap-8 px-6 py-20 md:py-28">
					<span className="border-border bg-card/80 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm">
						<span className="bg-accent size-1.5 rounded-full" />
						{txt.tagline}
					</span>

					<h1 className="text-5xl leading-[1.05] font-black tracking-tight md:text-7xl">
						<span aria-hidden className="mr-3">
							🍳
						</span>
						{CONFIG.appTitle.toLocaleUpperCase()}
					</h1>

					<p className="text-muted-foreground max-w-xl text-lg md:text-xl">{txt.subtitle}</p>

					{me ? (
						<div className="flex w-full max-w-sm flex-col gap-3">
							<p className="text-muted-foreground text-sm">
								{txt.welcomeBack} <span className="text-foreground font-medium">{me.name}</span>
							</p>
							<Link to={routes.dashboard} className="button lg w-full">
								{txt.explore}
							</Link>
						</div>
					) : (
						<div className="flex flex-wrap gap-3">
							<Link to={routes.register} className="button">
								{txt.register}
							</Link>
							<Link to={routes.login} className="button secondary">
								{txt.login}
							</Link>
						</div>
					)}
				</div>
			</section>

			{/* Feature grid */}
			<section className="mx-auto w-full max-w-5xl px-6 pb-20">
				<div className="grid gap-4 md:grid-cols-3">
					<FeatureCard
						emoji="📓"
						accent="primary"
						title={txt.feature1Title}
						body={txt.feature1Body}
					/>
					<FeatureCard
						emoji="🌿"
						accent="tertiary"
						title={txt.feature2Title}
						body={txt.feature2Body}
					/>
					<FeatureCard
						emoji="🔥"
						accent="accent"
						title={txt.feature3Title}
						body={txt.feature3Body}
					/>
				</div>

				<p className="text-muted-foreground mt-12 text-center text-sm">{txt.footnote}</p>
			</section>
		</PageContent>
	);
}

function FeatureCard({
	emoji,
	title,
	body,
	accent,
}: {
	emoji: string;
	title: string;
	body: string;
	accent: "primary" | "tertiary" | "accent";
}) {
	const accentClass = {
		primary: "bg-primary/10 text-primary",
		tertiary: "bg-tertiary/30 text-tertiary-foreground",
		accent: "bg-accent/15 text-accent",
	}[accent];

	return (
		<div className="group/card border-border bg-card hover:border-primary/30 flex flex-col gap-3 rounded-xl border p-5 transition-colors">
			<div
				className={`inline-flex size-10 items-center justify-center rounded-lg text-xl ${accentClass}`}
			>
				{emoji}
			</div>
			<h3 className="text-card-foreground text-base font-semibold">{title}</h3>
			<p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
		</div>
	);
}
