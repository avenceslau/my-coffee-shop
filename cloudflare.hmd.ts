// Health-mediated deployment: the ci-cd-worker gradually shifts traffic to the
// new version and auto-reverts if health checks regress. Swap the exported class
// (DefaultRollout / FastRollout / HotfixRollout) to change cadence.
export { HotfixRollout as HMD } from "@repo/hmd";
