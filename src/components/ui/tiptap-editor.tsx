"use client";

import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	Bold,
	Code,
	Heading1,
	Heading2,
	Highlighter,
	Italic,
	List,
	ListOrdered,
	Quote,
	Sparkles,
	Strikethrough,
} from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

interface TiptapEditorProps {
	content: string;
	onChange: (content: string) => void;
	onAIRequest?: () => void;
	isAILoading?: boolean;
}

export function TiptapEditor({
	content,
	onChange,
	onAIRequest,
	isAILoading,
}: TiptapEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3],
				},
			}),
			Placeholder.configure({
				placeholder: "Type '/' for commands or start writing...",
			}),
			TaskList,
			TaskItem.configure({
				nested: true,
			}),
			Highlight,
			Link.configure({
				openOnClick: false,
			}),
		],
		content: content,
		immediatelyRender: false,
		editorProps: {
			attributes: {
				class:
					"prose prose-sm dark:prose-invert focus:outline-none max-w-full min-h-[200px] cursor-text px-4 py-3",
			},
		},
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	useEffect(() => {
		if (editor && content !== editor.getHTML()) {
			editor.commands.setContent(content);
		}
	}, [content, editor]);

	if (!editor) return null;

	return (
		<div className="w-full border rounded-xl bg-background/50 overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all border-border/60 shadow-sm">
			{/* Main Toolbar (Always visible but subtle like Notion) */}
			<div className="flex items-center flex-wrap gap-1 p-1 border-b border-border/40 bg-muted/20">
				<Toggle
					size="sm"
					pressed={editor.isActive("bold")}
					onPressedChange={() => editor.chain().focus().toggleBold().run()}
				>
					<Bold className="h-4 w-4" />
				</Toggle>
				<Toggle
					size="sm"
					pressed={editor.isActive("italic")}
					onPressedChange={() => editor.chain().focus().toggleItalic().run()}
				>
					<Italic className="h-4 w-4" />
				</Toggle>
				<Toggle
					size="sm"
					pressed={editor.isActive("strike")}
					onPressedChange={() => editor.chain().focus().toggleStrike().run()}
				>
					<Strikethrough className="h-4 w-4" />
				</Toggle>
				<Separator orientation="vertical" className="h-4 mx-1" />
				<Toggle
					size="sm"
					pressed={editor.isActive("heading", { level: 1 })}
					onPressedChange={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
				>
					<Heading1 className="h-4 w-4" />
				</Toggle>
				<Toggle
					size="sm"
					pressed={editor.isActive("heading", { level: 2 })}
					onPressedChange={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
				>
					<Heading2 className="h-4 w-4" />
				</Toggle>
				<Separator orientation="vertical" className="h-4 mx-1" />
				<Toggle
					size="sm"
					pressed={editor.isActive("bulletList")}
					onPressedChange={() =>
						editor.chain().focus().toggleBulletList().run()
					}
				>
					<List className="h-4 w-4" />
				</Toggle>
				<Toggle
					size="sm"
					pressed={editor.isActive("orderedList")}
					onPressedChange={() =>
						editor.chain().focus().toggleOrderedList().run()
					}
				>
					<ListOrdered className="h-4 w-4" />
				</Toggle>
				<Toggle
					size="sm"
					pressed={editor.isActive("blockquote")}
					onPressedChange={() =>
						editor.chain().focus().toggleBlockquote().run()
					}
				>
					<Quote className="h-4 w-4" />
				</Toggle>
				<Toggle
					size="sm"
					pressed={editor.isActive("taskList")}
					onPressedChange={() => editor.chain().focus().toggleTaskList().run()}
				>
					<List className="h-4 w-4 text-primary" />
				</Toggle>
				<Separator orientation="vertical" className="h-4 mx-1" />
				<Toggle
					size="sm"
					pressed={editor.isActive("highlight")}
					onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
				>
					<Highlighter className="h-4 w-4" />
				</Toggle>
				<Toggle
					size="sm"
					pressed={editor.isActive("code")}
					onPressedChange={() => editor.chain().focus().toggleCode().run()}
				>
					<Code className="h-4 w-4" />
				</Toggle>
				{onAIRequest && (
					<>
						<Separator orientation="vertical" className="h-4 mx-1" />
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={onAIRequest}
							disabled={isAILoading}
							className="h-8 px-2 gap-1.5 text-primary hover:text-primary hover:bg-primary/10"
						>
							<Sparkles
								className={cn("h-4 w-4", isAILoading && "animate-pulse")}
							/>
							<span className="text-xs font-bold">
								{isAILoading ? "Generating..." : "AI Help"}
							</span>
						</Button>
					</>
				)}
			</div>

			<EditorContent editor={editor} />
		</div>
	);
}
