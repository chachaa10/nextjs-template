import { describe, expect, test } from "vitest";
import { cn } from "@/lib/utils.ts";

describe("cn", () => {
  test("merges class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  test("handles conflicting Tailwind classes by keeping the last one", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  test("filters out falsy values", () => {
    expect(cn("px-2", false, undefined, null, "py-1")).toBe("px-2 py-1");
  });

  test("accepts clsx object syntax", () => {
    expect(cn({ "px-2": true, "py-1": false })).toBe("px-2");
  });

  test("returns empty string for no inputs", () => {
    expect(cn()).toBe("");
  });
});
