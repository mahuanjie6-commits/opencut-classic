import { describe, expect, test } from "bun:test";
import { isKey, isShortcutKey } from "../keybinding";

describe("isShortcutKey", () => {
	test("accepts single keys from the known key set", () => {
		expect(isShortcutKey("a")).toBe(true);
		expect(isShortcutKey("space")).toBe(true);
		expect(isShortcutKey("escape")).toBe(true);
		expect(isShortcutKey("esc")).toBe(true);
		expect(isShortcutKey("/")).toBe(true);
		expect(isKey("space")).toBe(true);
	});

	test("accepts modifier plus a known key", () => {
		expect(isShortcutKey("ctrl+v")).toBe(true);
		expect(isShortcutKey("alt+shift+/")).toBe(true);
		expect(isShortcutKey("ctrl+alt+shift+a")).toBe(true);
		expect(isShortcutKey("shift+enter")).toBe(true);
	});

	test("rejects empty, unknown, or malformed shortcuts", () => {
		expect(isShortcutKey("")).toBe(false);
		expect(isShortcutKey("bogus")).toBe(false);
		expect(isShortcutKey("shift+bogus")).toBe(false);
		expect(isShortcutKey("meta+a")).toBe(false);
		expect(isShortcutKey("shift+ctrl+a")).toBe(false);
		expect(isShortcutKey("ctrl")).toBe(false);
		expect(isShortcutKey("ctrl+shift")).toBe(false);
		expect(isShortcutKey("CTRL+v")).toBe(false);
		expect(isShortcutKey("+a")).toBe(false);
		expect(isShortcutKey("ctrl+")).toBe(false);
	});
});
