export interface LifecycleTransitionPort {
  markMatching(requestId: string): Promise<void>;
}
