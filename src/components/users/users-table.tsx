"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	ChevronLeft,
	ChevronRight,
	Edit2,
	Search,
	Trash2,
	UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { User } from "@/db/schema";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useConfirm } from "../hooks/use-confirm";
import { type InviteUserInput, inviteUserSchema } from "../schemas/user.schema";
import { EmptyState } from "../shared/empty-state";
import { useUserStore } from "../store/user-store";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";

type ClientSideUser = Omit<User, "createdAt" | "updatedAt"> & {
	createdAt: string;
	updatedAt: string;
};

export function UsersTable() {
	const utils = trpc.useUtils();
	const { data: usersData, isLoading } = trpc.getUsers.useQuery();
	const { data: currentUser } = trpc.getProfile.useQuery();
	const users = usersData || [];

	const [searchQuery, setSearchQuery] = useState("");
	const [selectedUser, setSelectedUser] = useState<ClientSideUser | null>(null);
	const { isInviteUserOpen, setInviteUserOpen } = useUserStore();

	const filteredUsers = users.filter(
		(user) =>
			user.id !== currentUser?.id &&
			(user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				user.email.toLowerCase().includes(searchQuery.toLowerCase())),
	);

	const form = useForm<InviteUserInput>({
		resolver: zodResolver(inviteUserSchema),
		defaultValues: {
			name: "",
			email: "",
			role: "member",
		},
	});

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		watch,
		formState: { errors },
	} = form;

	const inviteMutation = trpc.inviteUser.useMutation({
		onSuccess: () => {
			toast.success("User invited successfully");
			utils.getUsers.invalidate();
			setInviteUserOpen(false);
			reset();
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const updateMutation = trpc.updateUser.useMutation({
		onSuccess: () => {
			toast.success("User updated successfully");
			utils.getUsers.invalidate();
			setInviteUserOpen(false);
			setSelectedUser(null);
			reset();
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const deleteMutation = trpc.deleteUser.useMutation({
		onSuccess: () => {
			toast.success("User removed successfully");
			utils.getUsers.invalidate();
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleInvite = async (data: InviteUserInput) => {
		if (selectedUser) {
			await updateMutation.mutateAsync({
				id: selectedUser.id,
				...data,
			});
		} else {
			await inviteMutation.mutateAsync(data);
		}
	};

	const handleEdit = (user: ClientSideUser) => {
		setSelectedUser(user);
		reset({
			name: user.name,
			email: user.email,
			role: user.role,
		});
		setInviteUserOpen(true);
	};

	const confirm = useConfirm();

	const handleDelete = async (id: string) => {
		if (
			await confirm({
				title: "Delete User",
				description:
					"Are you sure you want to remove this user? This action cannot be undone.",
				confirmText: "Delete",
				variant: "destructive",
			})
		) {
			await deleteMutation.mutateAsync({ id });
		}
	};

	const getStatusBadge = (status?: string) => {
		switch (status) {
			case "active":
				return (
					<Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-[10px] font-bold border-none px-3 py-1">
						Active
					</Badge>
				);
			case "pending":
				return (
					<Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-[10px] font-bold border-none px-3 py-1">
						Pending
					</Badge>
				);
			case "inactive":
				return (
					<Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-[10px] font-bold border-none px-3 py-1">
						Inactive
					</Badge>
				);
			default:
				return (
					<Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 rounded-full text-[10px] font-bold border-none px-3 py-1">
						Active
					</Badge>
				);
		}
	};

	const getRoleColor = (role?: string) => {
		switch (role) {
			case "admin":
				return "bg-purple-500";
			case "member":
				return "bg-blue-500";
			default:
				return "bg-gray-400";
		}
	};

	return (
		<div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
			<section className="mt-4">
				<h1 className="font-display font-bold text-4xl text-foreground leading-tight">
					Manage your Users
				</h1>
				<p className="text-muted-foreground mt-2 opacity-80">
					Oversee team access, roles, and account statuses.
				</p>
			</section>

			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
				<div className="flex items-center gap-4 w-full lg:w-auto flex-1 max-w-2xl">
					<div className="flex-1">
						<Input
							startIcon={<Search className="h-5 w-5" />}
							className="w-full bg-card border-none rounded-2xl py-6 focus-visible:ring-2 focus-visible:ring-primary/20 placeholder:text-muted-foreground/40 text-sm transition-all shadow-sm"
							placeholder="Search users..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<Button
						onClick={() => setInviteUserOpen(true)}
						className="bg-primary text-primary-foreground h-12 px-4 xs:px-6 rounded-2xl gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:scale-95 whitespace-nowrap font-bold"
					>
						<UserPlus className="h-5 w-5" />
						<span className="hidden xs:inline">Invite New User</span>
						<span className="xs:hidden">Invite</span>
					</Button>
				</div>
			</div>

			{!isLoading && filteredUsers.length === 0 ? (
				<EmptyState
					icon={UserPlus}
					title="No Users Found"
					description="It looks like there are no users matching your criteria. Try adjusting your search or invite new users to get started."
					actionButton={{
						label: "Invite New User",
						onClick: () => setInviteUserOpen(true),
					}}
				/>
			) : (
				<div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow className="border-border hover:bg-transparent">
									<TableHead className="py-5 px-6 font-display font-semibold text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">
										User Name
									</TableHead>
									<TableHead className="py-5 px-6 font-display font-semibold text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">
										Status
									</TableHead>
									<TableHead className="py-5 px-6 font-display font-semibold text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">
										Role
									</TableHead>
									<TableHead className="py-5 px-6 font-display font-semibold text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">
										Joined
									</TableHead>
									<TableHead className="py-5 px-6 font-display font-semibold text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 text-right">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isLoading
									? [1, 2, 3].map((i) => (
											<TableRow key={i} className="animate-pulse">
												<TableCell colSpan={5} className="h-20 bg-muted/20" />
											</TableRow>
										))
									: filteredUsers.map((user) => (
											<TableRow
												key={user.id}
												className="group hover:bg-muted/30 transition-colors border-border"
											>
												<TableCell className="py-5 px-6">
													<div className="flex items-center gap-3">
														<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
															{user.name.substring(0, 2)}
														</div>
														<div>
															<p className="font-bold text-foreground text-sm">
																{user.name}
															</p>
															<p className="text-xs text-muted-foreground opacity-60 font-medium">
																{user.email}
															</p>
														</div>
													</div>
												</TableCell>
												<TableCell className="py-5 px-6">
													{getStatusBadge(user.status)}
												</TableCell>
												<TableCell className="py-5 px-6">
													<div className="flex items-center gap-2">
														<span
															className={cn(
																"w-2 h-2 rounded-full",
																getRoleColor(user.role),
															)}
														/>
														<span className="text-sm font-medium text-foreground capitalize">
															{user.role || "Member"}
														</span>
													</div>
												</TableCell>
												<TableCell className="py-5 px-6">
													<span className="text-sm font-medium text-muted-foreground">
														{new Date(user.createdAt).toLocaleDateString()}
													</span>
												</TableCell>
												<TableCell className="py-5 px-6 text-right">
													<div className="flex items-center justify-end gap-2">
														<Button
															variant="ghost"
															size="icon"
															onClick={() => handleEdit(user)}
															className="h-9 w-9 text-muted-foreground hover:text-primary"
														>
															<Edit2 className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="icon"
															onClick={() => handleDelete(user.id)}
															className="h-9 w-9 text-destructive hover:bg-destructive/10"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))}
							</TableBody>
						</Table>
					</div>

					<div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/10">
						<p className="text-xs text-muted-foreground opacity-60 font-medium">
							Showing {filteredUsers.length} users
						</p>
						<div className="flex gap-2">
							{" "}
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8 rounded-lg border-border"
								disabled
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8 rounded-lg border-border"
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			)}

			<Dialog
				open={isInviteUserOpen}
				onOpenChange={(open) => {
					setInviteUserOpen(open);
					if (!open) {
						setSelectedUser(null);
						reset({ name: "", email: "", role: "member" });
					}
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{selectedUser ? "Edit User" : "Invite New User"}
						</DialogTitle>
						<DialogDescription>
							{selectedUser
								? "Update user details and permissions."
								: "Send an invitation to join your team and boost productivity."}
						</DialogDescription>
					</DialogHeader>
					<form
						onSubmit={handleSubmit(handleInvite)}
						className="space-y-4 py-4"
					>
						<div className="space-y-2">
							<label htmlFor="name" className="text-sm font-medium">
								Full Name
							</label>
							<Input
								id="name"
								placeholder="Jessica Smith"
								{...register("name")}
							/>
							{errors.name && (
								<p className="text-sm text-destructive">
									{errors.name.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<label htmlFor="email" className="text-sm font-medium">
								Email Address
							</label>
							<Input
								id="email"
								type="email"
								placeholder="jessica@example.com"
								{...register("email")}
							/>
							{errors.email && (
								<p className="text-sm text-destructive">
									{errors.email.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<label htmlFor="role" className="text-sm font-medium">
								Role
							</label>
							<Select
								value={watch("role")}
								onValueChange={(val) =>
									setValue("role", val as "admin" | "member" | "viewer")
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="admin">Admin</SelectItem>
									<SelectItem value="member">Member</SelectItem>
									<SelectItem value="viewer">Viewer</SelectItem>
								</SelectContent>
							</Select>
							{errors.role && (
								<p className="text-sm text-destructive">
									{errors.role.message}
								</p>
							)}
						</div>
						<DialogFooter className="mt-6 gap-2">
							<Button
								variant="ghost"
								onClick={() => {
									setInviteUserOpen(false);
									setSelectedUser(null);
									reset({ name: "", email: "", role: "member" });
								}}
								className="flex-1 sm:flex-none h-12 rounded-xl"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								className="bg-primary flex-1 sm:flex-none h-12 rounded-xl"
								disabled={inviteMutation.isPending || updateMutation.isPending}
							>
								{selectedUser
									? updateMutation.isPending
										? "Updating..."
										: "Save Changes"
									: inviteMutation.isPending
										? "Sending..."
										: "Send Invitation"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
