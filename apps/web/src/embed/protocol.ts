export const CANVAS_EMBED_SOURCE = "opencut-canvas";

let canvasEmbedActive = false;
let flushRename: (() => void) | null = null;

export function registerCanvasRenameFlush({
	flush,
}: {
	flush: () => void;
}): () => void {
	flushRename = flush;
	return () => {
		if (flushRename === flush) flushRename = null;
	};
}

export function flushCanvasRename(): void {
	flushRename?.();
}

export function markCanvasEmbedActive(): void {
	canvasEmbedActive = true;
}

export function isCanvasEmbedSearch(): boolean {
	if (canvasEmbedActive) return true;
	if (typeof window === "undefined") return false;
	return new URLSearchParams(window.location.search).get("embed") === "canvas";
}

export function postToCanvas({
	message,
	transfer,
}: {
	message: Record<string, unknown>;
	transfer?: Transferable[];
}): void {
	if (typeof window === "undefined") return;
	if (window.parent === window) return;
	window.parent.postMessage(
		{ source: CANVAS_EMBED_SOURCE, ...message },
		"*",
		transfer ?? [],
	);
}
