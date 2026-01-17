import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema/auth";

export const UserService = {
	getUserByEmail: async (email: string) => {
		const [foundUser] = await db
			.select()
			.from(user)
			.where(eq(user.email, email));
		return foundUser;
	},

	getUserById: async (id: string) => {
		const [foundUser] = await db.select().from(user).where(eq(user.id, id));
		return foundUser;
	},
};
