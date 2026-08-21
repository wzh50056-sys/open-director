import { describe, expect, it } from "vitest";
import { mapCreatorProgressToJobProgress } from "./render-progress.js";

describe("mapCreatorProgressToJobProgress", () => {
  it("maps ffcreator render progress into the active job progress range", () => {
    expect(mapCreatorProgressToJobProgress(0)).toBe(40);
    expect(mapCreatorProgressToJobProgress(25)).toBe(53);
    expect(mapCreatorProgressToJobProgress(50)).toBe(65);
    expect(mapCreatorProgressToJobProgress(100)).toBe(90);
  });

  it("clamps invalid progress values", () => {
    expect(mapCreatorProgressToJobProgress(-20)).toBe(40);
    expect(mapCreatorProgressToJobProgress(200)).toBe(90);
    expect(mapCreatorProgressToJobProgress(Number.NaN)).toBe(40);
  });
});
