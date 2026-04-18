import { DatabaseClient } from "@/Database/DatabaseClient";
import { Encrypt } from "@/lib/encrypt.namespace";

const db = new DatabaseClient();

const password = await Encrypt.hashPassword("123456789");

async function main() {
	console.log("Starting seed...");

	// 1. Materials
	const flour = await db.material.create({
		data: { title: "All-purpose Flour", description: "Standard white flour" },
	});
	const egg = await db.material.create({
		data: { title: "Large Egg", description: "Farm fresh" },
	});
	const rice = await db.material.create({
		data: { title: "Arborio Rice", description: "Short-grain rice for risotto" },
	});
	const chicken = await db.material.create({
		data: { title: "Whole Chicken", description: "Organic pasture-raised" },
	});
	const tomato = await db.material.create({
		data: { title: "Roma Tomato", description: "Fresh garden tomatoes" },
	});
	const pasta = await db.material.create({
		data: { title: "Spaghetti", description: "Durum wheat pasta" },
	});

	// 2. Measurements
	const grams = await db.measurement.create({
		data: { title: "grams", description: "Metric weight" },
	});
	const pieces = await db.measurement.create({
		data: { title: "pieces", description: "Individual units" },
	});
	await db.measurement.create({
		data: { title: "ml", description: "Milliliters" },
	});

	// 3. Users
	const user1 = await db.user.create({
		data: {
			email: "ozan@cookbook.app",
			password,
			profile: {
				create: {
					name: "Ozan",
					email: "ozan@cookbook.app",
				},
			},
			lastActive: new Date(),
		},
		include: { profile: true },
	});

	const user2 = await db.user.create({
		data: {
			email: "elena@cookbook.app",
			password,
			profile: {
				create: {
					name: "Elena",
					email: "elena@cookbook.app",
				},
			},
			lastActive: new Date(),
		},
		include: { profile: true },
	});

	// 4. Recipes for User1
	const recipesUser1 = [
		{
			title: "Simple Crepes",
			description: "Thin and delicious French-style pancakes.",
			ingredients: [
				{ quantity: 125, materialId: flour.id, measurementId: grams.id },
				{ quantity: 2, materialId: egg.id, measurementId: pieces.id },
			],
			steps: [
				{ order: 1, body: "Whisk eggs and flour in a large bowl." },
				{ order: 2, body: "Gradually add milk and water while stirring." },
			],
		},
		{
			title: "Wild Mushroom Risotto",
			description: "A creamy, earthy Italian classic.",
			ingredients: [{ quantity: 300, materialId: rice.id, measurementId: grams.id }],
			steps: [{ order: 1, body: "Sauté mushrooms and rice, then add broth slowly." }],
		},
		{
			title: "Sage & Lemon Roast Chicken",
			description: "Crispy skin with a fragrant herb infusion.",
			ingredients: [{ quantity: 1, materialId: chicken.id, measurementId: pieces.id }],
			steps: [{ order: 1, body: "Rub chicken with sage butter and roast at 200°C." }],
		},
		{
			title: "Garden Salad",
			description: "Fresh greens with a light vinaigrette.",
			ingredients: [{ quantity: 3, materialId: tomato.id, measurementId: pieces.id }],
			steps: [{ order: 1, body: "Chop vegetables and toss with dressing." }],
		},
	];

	if (!user1.profile || !user2.profile) {
		throw new Error("PROFILES MISSING");
	}

	for (const [i, r] of recipesUser1.entries()) {
		const recipe = await db.recipe.create({
			data: {
				title: r.title,
				description: r.description,
				isPublic: true,
				profileId: user1.profile.id,
				image: `https://picsum.photos/200/300?random=${i}`,
				steps: {
					create: r.steps,
				},
				ingredients: {
					create: r.ingredients.map((i) => ({
						quantity: i.quantity,
						material: { connect: { id: i.materialId } },
						measurement: { connect: { id: i.measurementId } },
					})),
				},
			},
		});

		await db.like.create({
			data: {
				profileId: user2.profile.id,
				recipeId: recipe.id,
			},
		});
	}

	// 5. Recipes for User2
	const recipesUser2 = [
		{
			title: "Classic Tomato Soup",
			description: "Warm and comforting roasted tomato blend.",
			ingredients: [{ quantity: 500, materialId: tomato.id, measurementId: grams.id }],
			steps: [{ order: 1, body: "Roast tomatoes and blend until smooth." }],
		},
		{
			title: "Perfect Scrambled Eggs",
			description: "Soft and buttery breakfast staple.",
			ingredients: [{ quantity: 3, materialId: egg.id, measurementId: pieces.id }],
			steps: [{ order: 1, body: "Whisk eggs and cook on low heat with butter." }],
		},
		{
			title: "Pasta Carbonara",
			description: "Authentic Roman pasta with egg and cheese.",
			ingredients: [
				{ quantity: 200, materialId: pasta.id, measurementId: grams.id },
				{ quantity: 2, materialId: egg.id, measurementId: pieces.id },
			],
			steps: [{ order: 1, body: "Mix hot pasta with egg and cheese mixture off-heat." }],
		},
	];

	for (const [i, r] of recipesUser2.entries()) {
		const recipe = await db.recipe.create({
			data: {
				title: r.title,
				description: r.description,
				isPublic: true,
				image: `https://picsum.photos/200/300?random=${i}`,
				profileId: user2.profile.id,
				steps: {
					create: r.steps,
				},
				ingredients: {
					create: r.ingredients.map((i) => ({
						quantity: i.quantity,
						material: { connect: { id: i.materialId } },
						measurement: { connect: { id: i.measurementId } },
					})),
				},
			},
		});

		await db.like.create({
			data: {
				profileId: user2.profile.id,
				recipeId: recipe.id,
			},
		});
	}

	console.log("Seed finished successfully.");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await db.disconnect();
	});
