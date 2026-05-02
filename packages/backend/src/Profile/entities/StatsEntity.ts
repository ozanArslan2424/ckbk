import { C } from "@ozanarslan/corpus";
import { type } from "arktype";

export class StatsEntity extends C.Entity({
	name: "Stats",
	schema: type({
		name: "string",
		image: "string | null",
		joined: "Date",
		contributionCount: "number",
		lastContribution: "Date | null",
		likeCount: "number",
		lastActive: "Date",
	}),
}) {}
