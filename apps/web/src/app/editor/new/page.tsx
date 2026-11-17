"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { EditorCore } from "@/core";

export default function NewEditorPage() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		const createProject = async () => {
			try {
				const editor = EditorCore.getInstance();
				const title = new URLSearchParams(window.location.search)
					.get("title")
					?.trim();
				const projectId = await editor.project.createNewProject({
					name: title ? title.slice(0, 80) : "未命名项目",
				});
				if (cancelled) return;

				const current = new URLSearchParams(window.location.search);
				const next = new URLSearchParams();
				const embed = current.get("embed");
				if (embed) next.set("embed", embed);
				const query = next.toString();
				router.replace(
					query ? `/editor/${projectId}?${query}` : `/editor/${projectId}`,
				);
			} catch (err) {
				if (cancelled) return;
				setError(err instanceof Error ? err.message : "创建剪辑项目失败");
			}
		};

		void createProject();
		return () => {
			cancelled = true;
		};
	}, [router]);

	return (
		<div className="bg-background flex h-screen w-screen items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				{error ? (
					<p className="text-destructive text-sm">{error}</p>
				) : (
					<>
						<Loader2 className="text-muted-foreground size-8 animate-spin" />
						<p className="text-muted-foreground text-sm">正在创建剪辑项目…</p>
					</>
				)}
			</div>
		</div>
	);
}
