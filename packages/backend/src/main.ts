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
import { JwtMiddleware } from "@/Jwt/JwtMiddleware";
import { JwtService } from "@/Jwt/JwtService";
import { LocaleMiddleware } from "@/Locale/LocaleMiddleware";
import { LocaleService } from "@/Locale/LocaleService";
import { LoggerMiddleware } from "@/Logger/LoggerMiddleware";
import { MailService } from "@/Mail/MailService";
import { MaterialController } from "@/Material/MaterialController";
import { MaterialService } from "@/Material/MaterialService";
import { MeasurementController } from "@/Measurement/MeasurementController";
import { MeasurementService } from "@/Measurement/MeasurementService";
import { ProfileController } from "@/Profile/ProfileController";
import { ProfileService } from "@/Profile/ProfileService";
import { RecipeController } from "@/Recipe/RecipeController";
import { RecipeService } from "@/Recipe/RecipeService";
import { seed } from "@/seed";
import { StepController } from "@/Step/StepController";
import { StepService } from "@/Step/StepService";

const db = new DatabaseClient();

const localeService = new LocaleService();
const errorService = new ErrorService(localeService);
const mailService = new MailService(localeService);
const jwtService = new JwtService(db);
const authService = new AuthService(db, mailService, jwtService);
const profileService = new ProfileService(db);
const ingredientService = new IngredientService(db);
const materialService = new MaterialService(db);
const measurementService = new MeasurementService(db);
const recipeService = new RecipeService(db);
const stepService = new StepService(db);
const cookBookEntryService = new CookbookService(db);

const server = new C.Server();
server.setGlobalPrefix("/api");
server.setOnError((err, c) => errorService.onError(c.data.locale, err));
server.setOnBeforeListen(async () => {
	await db.$connect();
	jwtService.startCleanupSchedule();
});
server.setOnBeforeClose(async () => {
	await db.$disconnect();
	jwtService.stopCleanupSchedule();
});

const dist = path.resolve(process.cwd(), "../frontend/dist");
new C.BundleRoute("/*", dist);
new C.Route("/health", () => "ok");
new C.Route<never, never, { password: string }>("/seed/:password", (c) =>
	seed(db, c.params.password),
);

new AuthController(authService);
const profileController = new ProfileController(profileService);
const ingredientController = new IngredientController(ingredientService);
const materialController = new MaterialController(materialService);
const measurementController = new MeasurementController(measurementService);
const recipeController = new RecipeController(recipeService);
const stepController = new StepController(stepService);
const cookbookController = new CookbookController(cookBookEntryService);

new LoggerMiddleware();
new LocaleMiddleware(localeService);
new JwtMiddleware(jwtService);
new AuthGuard(profileService, [
	profileController.get,
	ingredientController,
	materialController,
	measurementController,
	recipeController,
	stepController,
	cookbookController,
]);

new X.RateLimiter();
new X.Cors({
	allowedOrigins: [X.Config.get("CLIENT_URL")],
	allowedMethods: ["GET", "POST", "PUT", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization", localeService.localeHeader],
	credentials: true,
});

console.table(
	server.routes.map((r) => ({
		Method: r.method,
		Endpoint: r.endpoint,
	})),
);

void server.listen(X.Config.get("PORT", { parser: Number, fallback: 3000 }));
