import { describe, expect, test } from "bun:test";
import { isActionWithOptionalArgs } from "../definitions";

describe("isActionWithOptionalArgs", () => {
	test("accepts actions that can be bound to shortcuts", () => {
		expect(isActionWithOptionalArgs("toggle-play")).toBe(true);
		expect(isActionWithOptionalArgs("split")).toBe(true);
		expect(isActionWithOptionalArgs("paste-copied")).toBe(true);
		expect(isActionWithOptionalArgs("cancel-interaction")).toBe(true);
		expect(isActionWithOptionalArgs("seek-forward")).toBe(true);
	});

	test("rejects unknown actions and actions that require arguments", () => {
		expect(isActionWithOptionalArgs("")).toBe(false);
		expect(isActionWithOptionalArgs("not-an-action")).toBe(false);
		expect(isActionWithOptionalArgs("remove-media-asset")).toBe(false);
		expect(isActionWithOptionalArgs("remove-media-assets")).toBe(false);
	});
});
