export class RequestMutex {
  private locked = false;
  private acquireQueue: Array<() => void> = [];
  private unlockWaiters: Array<() => void> = [];

  isLocked(): boolean {
    return this.locked;
  }

  async acquire(): Promise<() => void> {
    if (this.locked) {
      await new Promise<void>((resolve) => {
        this.acquireQueue.push(resolve);
      });
    }

    this.locked = true;

    return () => {
      const next = this.acquireQueue.shift();

      if (next) {
        next();
        return;
      }

      this.locked = false;
      const waiters = this.unlockWaiters.splice(0);
      waiters.forEach((resolve) => resolve());
    };
  }

  async waitForUnlock(): Promise<void> {
    if (!this.locked) return;

    await new Promise<void>((resolve) => {
      this.unlockWaiters.push(resolve);
    });
  }
}
