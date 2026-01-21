import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull(),
	image: text("image"),
	role: text("role")
		.$type<"admin" | "member" | "viewer">()
		.notNull()
		.default("admin"),
	status: text("status")
		.$type<"active" | "inactive" | "pending" | "deleted">()
		.notNull()
		.default("active"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at"),
	updatedAt: timestamp("updated_at"),
});

// --- Application Tables ---

export const board = pgTable("board", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const boardRelations = relations(board, ({ one, many }) => ({
	owner: one(user, {
		fields: [board.userId],
		references: [user.id],
	}),
	columns: many(boardColumn),
}));

export const boardColumn = pgTable("board_column", {
	id: text("id").primaryKey(),
	boardId: text("board_id")
		.notNull()
		.references(() => board.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	order: integer("order").notNull().default(0),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const boardColumnRelations = relations(boardColumn, ({ one, many }) => ({
	board: one(board, {
		fields: [boardColumn.boardId],
		references: [board.id],
	}),
	tasks: many(task),
}));

export const task = pgTable("task", {
	id: text("id").primaryKey(),
	columnId: text("column_id")
		.notNull()
		.references(() => boardColumn.id, { onDelete: "cascade" }),
	title: text("title").notNull(),
	description: text("description"),
	order: integer("order").notNull().default(0),
	priority: text("priority")
		.$type<"low" | "medium" | "high">()
		.default("medium"),
	label: text("label"), // e.g. "Design", "Bug", "Feature"
	dueDate: timestamp("due_date"),
	assigneeId: text("assignee_id").references(() => user.id),

	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const taskRelations = relations(task, ({ one }) => ({
	column: one(boardColumn, {
		fields: [task.columnId],
		references: [boardColumn.id],
	}),
	assignee: one(user, {
		fields: [task.assigneeId],
		references: [user.id],
	}),
}));
