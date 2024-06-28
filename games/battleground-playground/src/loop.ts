export class Loop {
  private isRunning: boolean = false;

  constructor(private tickCallback: Function) {}

  jumpToTick(tick: number) {
    for (let i = 0; i < tick; i++) {
      this.tickCallback();
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
    if (!this.tickCallback) return;

    this.tickCallback();
  }

  private loop = () => {
    if (!this.isRunning) return;

    this.tick();

    requestAnimationFrame(this.loop);
  };
}
