import { type InferSelectModel, relations } from "drizzle-orm";
import {
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

// --- Enums ---
export const roleEnum = pgEnum("role", ["admin", "member", "viewer"]);
export const userStatusEnum = pgEnum("user_status", [
	"active",
	"inactive",
	"pending",
	"deleted",
]);
export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	image: text("image"),
	role: roleEnum("role").notNull().default("member"),
	status: userStatusEnum("status").notNull().default("active"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export type User = InferSelectModel<typeof user>;

export const session = pgTable(
	"session",
	{
		id: text("id").primaryKey(),
		expiresAt: timestamp("expires_at").notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => ({
		userIdIdx: index("session_user_id_idx").on(table.userId),
	}),
);

export const account = pgTable(
	"account",
	{
		id: text("id").primaryKey(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => ({
		userIdIdx: index("account_user_id_idx").on(table.userId),
	}),
);

export const board = pgTable(
	"board",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		description: text("description"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => ({
		userIdUniqueIdx: uniqueIndex("board_user_id_unique_idx").on(table.userId),
	}),
);

export const boardRelations = relations(board, ({ one, many }) => ({
	owner: one(user, {
		fields: [board.userId],
		references: [user.id],
	}),
	columns: many(boardColumn),
}));

export const boardColumn = pgTable(
	"board_column",
	{
		id: text("id").primaryKey(),
		boardId: text("board_id")
			.notNull()
			.references(() => board.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		order: integer("order").notNull().default(0),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => ({
		boardIdIdx: index("column_board_id_idx").on(table.boardId),
		orderIdx: index("column_order_idx").on(table.order),
	}),
);

export const boardColumnRelations = relations(boardColumn, ({ one, many }) => ({
	board: one(board, {
		fields: [boardColumn.boardId],
		references: [board.id],
	}),
	tasks: many(task),
}));

export const task = pgTable(
	"task",
	{
		id: text("id").primaryKey(),
		columnId: text("column_id")
			.notNull()
			.references(() => boardColumn.id, { onDelete: "cascade" }),
		title: text("title").notNull(),
		description: text("description"),
		order: integer("order").notNull().default(0),
		priority: priorityEnum("priority").default("medium"),
		label: text("label"),
		authorId: text("author_id").references(() => user.id),
		assigneeId: text("assignee_id").references(() => user.id, {
			onDelete: "set null",
		}),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => ({
		columnIdIdx: index("task_column_id_idx").on(table.columnId),
		assigneeIdIdx: index("task_assignee_id_idx").on(table.assigneeId),
		orderIdx: index("task_order_idx").on(table.order),
	}),
);

export const taskRelations = relations(task, ({ one }) => ({
	column: one(boardColumn, {
		fields: [task.columnId],
		references: [boardColumn.id],
	}),
	author: one(user, {
		fields: [task.authorId],
		references: [user.id],
		relationName: "taskAuthor",
	}),
	assignee: one(user, {
		fields: [task.assigneeId],
		references: [user.id],
		relationName: "taskAssignee",
	}),
}));
