import path from "node:path";

import { C, X } from "@ozanarslan/corpus";

import { AuthController } from "@/Auth/AuthController";
import { AuthGuard } from "@/Auth/AuthGuard";
import { AuthService } from "@/Auth/AuthService";
import { CookbookController } from "@/Cookbook/CookbookController";
import { CookbookService } from "@/Cookbook/CookbookService";
import { DatabaseClient } from "@/Database/DatabaseClient";
import { ErrorService } from "@/Error/ErrorService";
import { IngredientController } from "@/Ingredient/IngredientController";
import { IngredientService } from "@/Ingredient/IngredientService";
import { LocaleMiddleware } from "@/Locale/LocaleMiddleware";
import { LocaleService } from "@/Locale/LocaleService";
import { LoggerMiddleware } from "@/Logger/LoggerMiddleware";
import { MailService } from "@/Mail/MailService";
import { MaterialController } from "@/Material/MaterialController";
import { MaterialService } from "@/Material/MaterialService";
import { MeasurementController } from "@/Measurement/MeasurementController";
import { MeasurementService } from "@/Measurement/MeasurementService";
import { RecipeController } from "@/Recipe/RecipeController";
import { RecipeService } from "@/Recipe/RecipeService";
import { seed } from "@/seed";
import { StepController } from "@/Step/StepController";
import { StepService } from "@/Step/StepService";

const server = new C.Server();
server.setGlobalPrefix("/api");

const db = new DatabaseClient();

const localeService = new LocaleService();
const errorService = new ErrorService(localeService);
const mailService = new MailService(localeService);
const authService = new AuthService(db, mailService);
const ingredientService = new IngredientService(db);
const materialService = new MaterialService(db);
const measurementService = new MeasurementService(db);
const recipeService = new RecipeService(db);
const stepService = new StepService(db);
const cookBookEntryService = new CookbookService(db);

const dist = path.resolve(process.cwd(), "../frontend/dist");
new C.BundleRoute("/*", dist);
new C.Route("/health", () => "ok");
new C.Route<never, never, { password: string }>("/seed/:password", (c) =>
	seed(db, c.params.password),
);

new AuthController(authService);
const ingredientClient = new IngredientController(ingredientService);
const materialClient = new MaterialController(materialService);
const measurementClient = new MeasurementController(measurementService);
const recipeClient = new RecipeController(recipeService);
const stepClient = new StepController(stepService);
const cookBookEntryController = new CookbookController(cookBookEntryService);

new X.RateLimiter();
new X.Cors({
	allowedOrigins: [X.Config.get("CLIENT_URL")],
	allowedMethods: ["GET", "POST", "PUT", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization", localeService.localeHeader],
	credentials: true,
});
new LoggerMiddleware();
new LocaleMiddleware(localeService);
new AuthGuard(authService, [
	ingredientClient,
	materialClient,
	measurementClient,
	recipeClient,
	stepClient,
	cookBookEntryController,
]);

server.setOnError((err, c) => errorService.onError(c.data.locale, err));
server.setOnBeforeListen(async () => {
	const routesTable = server.routes.map((r) => ({
		Method: r.method,
		Endpoint: r.endpoint,
	}));

	console.log("Global Prefix: /api");
	console.table(routesTable);

	await db.connect();
});

server.setOnBeforeClose(async () => db.disconnect());
void server.listen(X.Config.get("PORT", { parser: parseInt, fallback: 3000 }));
