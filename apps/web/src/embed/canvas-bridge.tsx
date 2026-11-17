"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useEditor } from "@/editor/use-editor";
import { processMediaAssets } from "@/media/processing";
import { buildElementFromMedia } from "@/timeline/element-utils";
import { toElementDurationTicks } from "@/timeline/creation";
import { mediaTimeFromSeconds } from "@/wasm";
import {
	CANVAS_EMBED_SOURCE,
	isCanvasEmbedSearch,
	markCanvasEmbedActive,
	postToCanvas,
} from "./protocol";

type LoadVideoMessage = {
	source?: string;
	type?: string;
	name?: string;
	mimeType?: string;
	title?: string;
	buffer?: ArrayBuffer;
};

export function CanvasBridge() {
	const editor = useEditor();
	const projectId = useEditor(
		(state) => state.project.getActiveOrNull()?.metadata.id ?? null,
	);
	const runIdRef = useRef(0);

	useEffect(() => {
		if (!projectId || !isCanvasEmbedSearch()) return;
		if (window.parent === window) return;
		markCanvasEmbedActive();

		const runId = ++runIdRef.current;
		let accepted = false;
		const isCurrent = () => runIdRef.current === runId;

		const importVideo = async ({ message }: { message: LoadVideoMessage }) => {
			if (!isCurrent() || accepted) return;
			if (!message.buffer || message.buffer.byteLength === 0) {
				postToCanvas({ message: { type: "error", message: "没有收到视频数据" } });
				return;
			}

			accepted = true;
			try {
				const active = editor.project.getActiveOrNull();
				if (!active) {
					throw new Error("剪辑工程还没准备好");
				}

				const mimeType = message.mimeType || "video/mp4";
				const filename = message.name || "canvas-video.mp4";
				const file = new File([message.buffer], filename, { type: mimeType });
				const title = (message.title || filename.replace(/\.[^.]+$/, "")).slice(
					0,
					80,
				);

				if (title && title !== active.metadata.name) {
					await editor.project.renameProject({
						id: active.metadata.id,
						name: title,
					});
				}
				if (!isCurrent()) return;

				const processed = await processMediaAssets({ files: [file] });
				if (!isCurrent()) return;
				if (processed.length === 0) {
					throw new Error("OpenCut 无法解析这段视频");
				}

				const created = await editor.media.addMediaAsset({
					projectId: active.metadata.id,
					asset: processed[0],
				});
				if (!isCurrent()) return;
				if (!created) {
					throw new Error("视频没有写入剪辑工程");
				}

				const scene = editor.scenes.getActiveSceneOrNull();
				if (!scene) {
					throw new Error("时间线还没准备好");
				}

				editor.timeline.insertElement({
					placement: { mode: "explicit", trackId: scene.tracks.main.id },
					element: buildElementFromMedia({
						mediaId: created.id,
						mediaType: created.type,
						name: created.name,
						duration: toElementDurationTicks({ seconds: created.duration }),
						startTime: mediaTimeFromSeconds({ seconds: 0 }),
					}),
				});

				postToCanvas({ message: { type: "loaded" } });
				toast.success("视频已放入时间线，可以开始剪辑");
			} catch (error) {
				if (isCurrent()) accepted = false;
				const messageText =
					error instanceof Error ? error.message : "载入视频失败";
				postToCanvas({ message: { type: "error", message: messageText } });
				toast.error(messageText);
			}
		};

		const onMessage = (event: MessageEvent) => {
			const data = event.data as LoadVideoMessage | null;
			if (!data || data.source !== CANVAS_EMBED_SOURCE) return;
			if (data.type !== "load-video") return;
			void importVideo({ message: data });
		};

		window.addEventListener("message", onMessage);
		const announceReady = () => {
			if (!isCurrent() || accepted) return;
			postToCanvas({ message: { type: "ready", projectId } });
		};
		announceReady();
		const readyTimer = window.setInterval(announceReady, 400);

		return () => {
			runIdRef.current += 1;
			window.clearInterval(readyTimer);
			window.removeEventListener("message", onMessage);
		};
	}, [editor, projectId]);

	return null;
}
