export function afterUpdateAndContinue(): string {
  // runnerExecutorNode already processes every pending task in one batch.
  // Finish the graph after that batch; failed media tasks remain visible to
  // the user instead of entering an unbounded retry loop.
  return "update_state";
}
