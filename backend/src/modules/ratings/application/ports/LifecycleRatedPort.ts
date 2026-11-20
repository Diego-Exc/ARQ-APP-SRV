export interface LifecycleRatedPort {
  markRated(requestId: string): Promise<void>;
}
