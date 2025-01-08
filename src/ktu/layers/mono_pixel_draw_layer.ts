import { FederatedPointerEvent, Graphics } from "pixi.js";

import { ContainerLayer } from "./container_layer";

export type MonoPixelDrawLayerState = {
  name: string;
  layerId: string;
  points: Record<string, boolean>;
  color: string;
  pixelSize: number;
  panX: number;
  panY: number;
};

export type MonoPixelDrawLayerSetting = {
  field: "color" | "pixelSize" | "panX" | "panY";
  type: "color" | "integer";
  onchange: (value: string) => void;
};

export class MonoPixelDrawLayer extends ContainerLayer {
  graphics: Graphics;
  clicking: boolean = false;
  erasing: boolean = false;
  stroke: Record<string, boolean>;
  state: MonoPixelDrawLayerState;
  settings: MonoPixelDrawLayerSetting[] = [
    {
      field: "color",
      type: "color",
      onchange: (value: string) => {
        this.state.color = value;
        this.repaint();
      },
    },
    {
      field: "pixelSize",
      type: "integer",
      onchange: (value: string) => {
        this.state.pixelSize = parseInt(value);
        this.repaint();
      },
    },
    {
      field: "panX",
      type: "integer",
      onchange: (value: string) => {
        this.state.panX = parseInt(value);
        this.repaint();
      },
    },
    {
      field: "panY",
      type: "integer",
      onchange: (value: string) => {
        this.state.panY = parseInt(value);
        this.repaint();
      },
    },
  ];

  constructor(state?: MonoPixelDrawLayerState) {
    super();
    this.graphics = new Graphics();
    this.container.addChild(this.graphics);
    this.stroke = {};

    if (state) {
      this.state = {
        name: state.name,
        layerId: state.layerId,
        points: {},
        color: state.color,
        pixelSize: state.pixelSize,
        panX: state.panX,
        panY: state.panY,
      };
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
        color: "#FFFFFF",
        pixelSize: 15,
        panX: 0,
        panY: 0,
      };
    }
  }

  pointerDown(event: FederatedPointerEvent): void {
    console.log("NUMBER", event.button);
    this.clicking = true;
    if (event.button === 2) {
      this.erasing = true;
    }
    this.stroke = {};
    this.metapaint(event);
  }
  pointerUp(): void {
    this.clicking = false;
    this.erasing = false;
  }
  pointerMove(event: FederatedPointerEvent): void {
    this.metapaint(event);
  }

  metapaint(event: FederatedPointerEvent) {
    if (this.clicking) {
      const x = Math.floor(event.clientX / this.state.pixelSize);
      const y = Math.floor(event.clientY / this.state.pixelSize);
      if (!this.stroke[`${x}X${y}`]) {
        this.stroke[`${x}X${y}`] = true;
        if (!this.erasing) {
          this.paint(x, y);
        } else {
          this.erase(x, y);
        }
      }
    }
  }

  repaint() {
    this.graphics.clear();
    for (var key in this.state.points) {
      const x = parseInt(key.split("X")[0]);
      const y = parseInt(key.split("X")[1]);
      this.graphics
        .rect(
          x * this.state.pixelSize + this.state.panX,
          y * this.state.pixelSize + this.state.panY,
          this.state.pixelSize,
          this.state.pixelSize
        )
        .fill(this.state.color);
    }
  }

  paint(x: number, y: number) {
    //TODO: CHANGE  X and Y to UNSCALED INDEX POSITIONS
    if (!this.state.points[`${x}X${y}`]) {
      this.graphics
        .rect(
          x * this.state.pixelSize + this.state.panX,
          y * this.state.pixelSize + this.state.panY,
          this.state.pixelSize,
          this.state.pixelSize
        )
        .fill(this.state.color);
      this.state.points[`${x}X${y}`] = true;
    } else {
      this.erase(x, y);
    }
  }
  erase(x: number, y: number) {
    delete this.state.points[`${x}X${y}`];
    this.repaint();
  }
}
