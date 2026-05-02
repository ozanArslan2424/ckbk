import { X } from "@ozanarslan/corpus";

import { DatabaseClient } from "@/Database/DatabaseClient";

export async function seed(db: DatabaseClient, pwd: string) {
	console.log("Starting seed...");
	const seedPassword = X.Config.get("SEED_PWD");
	if (pwd !== seedPassword) {
		console.error("SEED_PWD WRONG");
		return;
	}
	const password = await Bun.password.hash("123456789");
	const now = Date.now();
	const user = await db.user.create({
		data: {
			email: "some@mail.com",
			lastActive: new Date(),
			password,
			refreshTokens: {
				createMany: {
					data: [
						// Already expired - should be deleted by cleanup
						{
							expiresAt: new Date(now - 24 * 60 * 60 * 1000), // 1 day ago
							isValid: true,
						},
						// Expired further back
						{
							expiresAt: new Date(now - 7 * 24 * 60 * 60 * 1000), // 7 days ago
							isValid: true,
						},
						// Invalidated but not yet expired - should also be deleted
						{
							expiresAt: new Date(now + 7 * 24 * 60 * 60 * 1000),
							isValid: false,
						},
						// Valid and not expired - should survive cleanup
						{
							expiresAt: new Date(now + 7 * 24 * 60 * 60 * 1000),
							isValid: true,
						},
					],
				},
			},
		},
		include: { refreshTokens: true },
	});
	console.log(`Seeded user ${user.id} with ${user.refreshTokens.length} refresh tokens`);
	console.log(
		`Expected after cleanup: 1 token remaining (3 should be deleted: 2 expired, 1 invalidated)`,
	);
	console.log("Seed finished successfully.");
}
