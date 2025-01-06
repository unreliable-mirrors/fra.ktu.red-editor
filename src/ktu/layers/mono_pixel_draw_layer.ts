import { FederatedPointerEvent, Graphics } from "pixi.js";

import { ContainerLayer } from "./container_layer";

export class MonoPixelDrawLayer extends ContainerLayer {
  graphics: Graphics;
  pixelSize: number;
  clicking: boolean = false;
  points: Record<string, boolean>;
  stroke: Record<string, boolean>;
  constructor() {
    super();
    this.graphics = new Graphics();
    this.pixelSize = 15;
    this.container.addChild(this.graphics);
    this.points = {};
    this.stroke = {};
  }

  pointerDown(event: FederatedPointerEvent): void {
    this.clicking = true;
    this.stroke = {};
    this.paint(event);
  }
  pointerUp(event: FederatedPointerEvent): void {
    this.clicking = false;
  }
  pointerMove(event: FederatedPointerEvent): void {
    this.paint(event);
  }

  paint(event: FederatedPointerEvent) {
    if (this.clicking) {
      const x = Math.floor(event.clientX / this.pixelSize) * this.pixelSize;
      const y = Math.floor(event.clientY / this.pixelSize) * this.pixelSize;
      if (!this.stroke[`${x}-${y}`]) {
        this.stroke[`${x}-${y}`] = true;
        if (!this.points[`${x}-${y}`]) {
          this.graphics
            .rect(x, y, this.pixelSize, this.pixelSize)
            .fill(0xffffff);
          this.points[`${x}-${y}`] = true;
        } else {
          this.graphics
            .rect(x, y, this.pixelSize, this.pixelSize)
            .fill(0x000000);
          delete this.points[`${x}-${y}`];
        }
      }
    }
  }
}
