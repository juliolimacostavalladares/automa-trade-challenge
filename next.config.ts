import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	transpilePackages: [
		"@trpc/server",
		"@trpc/client",
		"@trpc/react-query",
		"@trpc/next",
	],
};

export default nextConfig;
