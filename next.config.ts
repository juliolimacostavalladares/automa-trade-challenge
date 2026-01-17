import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
		],
	},
	transpilePackages: [
		"@trpc/server",
		"@trpc/client",
		"@trpc/react-query",
		"@trpc/next",
	],
};

export default nextConfig;
