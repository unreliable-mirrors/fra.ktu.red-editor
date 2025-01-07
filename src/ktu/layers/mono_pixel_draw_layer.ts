import { FederatedPointerEvent, Graphics } from "pixi.js";

import { ContainerLayer } from "./container_layer";

export type MonoPixelDrawLayerState = {
  name: string;
  layerId: string;
  points: Record<string, boolean>;
};

export class MonoPixelDrawLayer extends ContainerLayer {
  graphics: Graphics;
  pixelSize: number;
  clicking: boolean = false;
  stroke: Record<string, boolean>;
  state: MonoPixelDrawLayerState;

  constructor(state?: MonoPixelDrawLayerState) {
    super();
    this.graphics = new Graphics();
    this.pixelSize = 15;
    this.container.addChild(this.graphics);
    this.stroke = {};

    console.log("MONOSTATE", state);
    if (state) {
      this.state = { name: state.name, layerId: state.layerId, points: {} };
      for (var key in state.points) {
        const x = parseInt(key.split("X")[0]);
        const y = parseInt(key.split("X")[1]);
        this.paint(x, y);
      }
    } else {
      this.state = {
        name: "mono_pixel_draw_layer",
        layerId: this.layerId,
        points: {},
      };
    }
  }

  pointerDown(event: FederatedPointerEvent): void {
    this.clicking = true;
    this.stroke = {};
    this.metapaint(event);
  }
  pointerUp(): void {
    this.clicking = false;
  }
  pointerMove(event: FederatedPointerEvent): void {
    this.metapaint(event);
  }

  metapaint(event: FederatedPointerEvent) {
    if (this.clicking) {
      const x = Math.floor(event.clientX / this.pixelSize) * this.pixelSize;
      const y = Math.floor(event.clientY / this.pixelSize) * this.pixelSize;
      if (!this.stroke[`${x}X${y}`]) {
        this.stroke[`${x}X${y}`] = true;
        this.paint(x, y);
      }
    }
  }

  paint(x: number, y: number) {
    if (!this.state.points[`${x}X${y}`]) {
      this.graphics.rect(x, y, this.pixelSize, this.pixelSize).fill(0xffffff);
      this.state.points[`${x}X${y}`] = true;
    } else {
      this.graphics.rect(x, y, this.pixelSize, this.pixelSize).fill(0x000000);
      delete this.state.points[`${x}X${y}`];
    }
  }
}
