export interface LifecyclePort {
  initialize(requestId: string): Promise<void>;
}
