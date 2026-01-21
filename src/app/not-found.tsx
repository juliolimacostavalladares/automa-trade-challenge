import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<main className="min-h-screen flex flex-col items-center justify-end overflow-hidden relative pb-20 md:pb-32 font-sans bg-white">
			<div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
				<div className="relative">
					<Image
						src="/mascote-nobg.svg"
						alt="Mascot 404"
						width={600}
						height={600}
						className="relative w-125 h-125 object-contain z-10 animate-in fade-in zoom-in duration-700"
						priority
					/>
				</div>
			</div>

			{/* Background Giant 404 (Extremely Subtle Orange) */}

			<div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-0">
				<h1 className="flex text-[25rem] md:text-[45rem] font-display font-black text-primary leading-none">
					4<span className="invisible">0</span>4
				</h1>
			</div>

			<div className="relative z-30 text-center px-6 max-w-4xl w-full mt-32">
				<div className="space-y-4">
					<h2 className="text-4xl md:text-6xl font-display font-bold text-muted-foregroun tracking-tight drop-shadow-md">
						Opps, I think we’re lost
					</h2>
					<p className="text-lg md:text-xl font-medium text-muted-foregroun opacity-100 italic drop-shadow-sm">
						Let’s get you back somewhere familiar...
					</p>
				</div>

				<div className="mt-8 flex justify-center">
					<Button
						asChild
						size="lg"
						className="group h-auto gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-all duration-300"
					>
						<Link href="/">
							<ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
							Back to home
						</Link>
					</Button>
				</div>
			</div>
		</main>
	);
}
