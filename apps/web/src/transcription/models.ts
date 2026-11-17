import type {
	TranscriptionModel,
	TranscriptionModelId,
} from "./types";

export const TRANSCRIPTION_MODELS: TranscriptionModel[] = [
	{
		id: "whisper-tiny",
		name: "极小",
		huggingFaceId: "onnx-community/whisper-tiny",
		description: "最快，准确度较低",
	},
	{
		id: "whisper-small",
		name: "小",
		huggingFaceId: "onnx-community/whisper-small",
		description: "速度和准确度比较均衡",
	},
	{
		id: "whisper-medium",
		name: "中",
		huggingFaceId: "onnx-community/whisper-medium",
		description: "准确度更高，速度较慢",
	},
	{
		id: "whisper-large-v3-turbo",
		name: "大 · v3 Turbo",
		huggingFaceId: "onnx-community/whisper-large-v3-turbo",
		description: "准确度最高，流畅运行需要 WebGPU",
	},
];

export const DEFAULT_TRANSCRIPTION_MODEL: TranscriptionModelId =
	"whisper-small";
