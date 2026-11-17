"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { isCanvasEmbedSearch, postToCanvas } from "./protocol";

export function CanvasEmbedCloseButton() {
	const [isEmbed, setIsEmbed] = useState(false);

	useEffect(() => {
		setIsEmbed(isCanvasEmbedSearch());
	}, []);

	if (!isEmbed) return null;

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={() => postToCanvas({ message: { type: "close" } })}
		>
			返回画布
		</Button>
	);
}
