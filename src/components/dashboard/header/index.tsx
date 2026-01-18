"use client";

import { trpc } from "@/trpc/client";
import { HeaderView } from "./header.view";

export function Header() {
	const { data: user } = trpc.getProfile.useQuery();

	return <HeaderView user={user} />;
}
