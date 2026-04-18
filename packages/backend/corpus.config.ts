import { defineConfig } from "@ozanarslan/corpus-callosum/config";

export default defineConfig({
	main: "./src/main.ts",
	pkgPath: "@ozanarslan/corpus",
	validationLibrary: "arktype",
	packageManager: "pnpm",
	casing: "pascal",
	silent: false,
	output: "../frontend/src/Api/CorpusApi.ts",
	exportClientAs: "CorpusApi",
	ignoreGlobalPrefix: true,
	// Default targets arktype. The `fallback: ctx => ctx.base` strategy silently
	// drops any unsupported constraint and keeps the rest of the schema intact,
	// which is the least-surprising behaviour for codegen purposes.
	jsonSchemaOptions: {
		target: "draft-07",
		fallback: {
			// ✅ the "default" key is a fallback for any non-explicitly handled code
			// ✅ ctx includes "base" (represents the schema being generated) and other code-specific props
			// ✅ returning `ctx.base` will effectively ignore the incompatible constraint
			default: (ctx: any) => ctx.base,
			// handle specific incompatibilities granularly
			date: (ctx: any) => ({
				...ctx.base,
				type: "string",
				format: "date-time",
			}),
		},
	},
});
