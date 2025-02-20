export type TickCallback = (tick: number, fps: number) => void;

export class Loop {
  private isRunning: boolean = false;

  private tickIndex: number = 0;

  private lastCalledTime: number = 0;
  private tickCallback: Function = () => {};

  setCallback(tickCallback: TickCallback) {
    this.tickCallback = tickCallback;
  }

  jumpToTick(tick: number) {
    this.tickIndex = tick;
    for (let i = 0; i < tick; i++) {
      this.tick();
    }
  }

  stop() {
    this.isRunning = false;
  }

  start() {
    this.isRunning = true;
    this.loop();
  }

  tick() {
    this.tickIndex += 1;

    this.tickCallback(this.tickIndex, this.calculateFPS());
  }

  private loop = () => {
    if (!this.isRunning) return;

    this.tick();

    requestAnimationFrame(this.loop);
  };

  private calculateFPS(): number {
    if (!this.lastCalledTime) {
      this.lastCalledTime = performance.now();
      return 0;
    }

    const delta = (performance.now() - this.lastCalledTime) / 1000;
    this.lastCalledTime = performance.now();
    return Math.floor(1 / delta);
  }
}
