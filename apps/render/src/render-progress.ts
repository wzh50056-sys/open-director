const RENDER_START_PROGRESS = 40;
const RENDER_END_PROGRESS = 90;

export function mapCreatorProgressToJobProgress(progress: number) {
  const clampedCreatorProgress =
    Number.isFinite(progress) ? Math.max(0, Math.min(100, progress)) : 0;
  const range = RENDER_END_PROGRESS - RENDER_START_PROGRESS;
  return Math.round(RENDER_START_PROGRESS + (clampedCreatorProgress / 100) * range);
}
