import { FederatedPointerEvent, Graphics } from "pixi.js";

import { ContainerLayer, ContainerLayerState } from "./container_layer";

export type MonoPixelDrawLayerState = ContainerLayerState & {
  points: Record<string, boolean>;
  color: string;
  alpha: number;
  pixelSize: number;
  panX: number;
  panY: number;
};

export type MonoPixelDrawLayerSetting = {
  field: "color" | "pixelSize" | "panX" | "panY" | "alpha";
  type: "color" | "integer" | "float";
  onchange: (value: string) => void;
};

export class MonoPixelDrawLayer extends ContainerLayer {
  graphics: Graphics;
  clicking: boolean = false;
  erasing: boolean = false;
  hardPainting: boolean = false;
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
      field: "alpha",
      type: "float",
      onchange: (value: string) => {
        this.state.alpha = parseFloat(value);
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
        shaders: [],
        points: {},
        color: state.color,
        alpha: state.alpha,
        pixelSize: state.pixelSize,
        panX: state.panX,
        panY: state.panY,
      };
      for (var shader of state.shaders) {
        this.addShaderFromState(shader.name, shader);
      }
      for (var key in state.points) {
        const x = parseInt(key.split("X")[0]);
        const y = parseInt(key.split("X")[1]);
        this.paint(x, y);
      }
    } else {
      this.state = {
        name: "mono_pixel_draw_layer",
        layerId: this.layerId,
        shaders: [],
        points: {},
        color: "#FFFFFF",
        alpha: 1,
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
    } else if (event.ctrlKey) {
      this.hardPainting = true;
    }
    this.stroke = {};
    this.metapaint(event);
  }
  pointerUp(): void {
    this.clicking = false;
    this.erasing = false;
    this.hardPainting = false;
  }
  pointerMove(event: FederatedPointerEvent): void {
    this.metapaint(event);
  }

  metapaint(event: FederatedPointerEvent) {
    if (this.clicking) {
      const x = Math.floor(
        (event.globalX - this.state.panX) / this.state.pixelSize
      );
      const y = Math.floor(
        (event.globalY - this.state.panY) / this.state.pixelSize
      );
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
        .fill({ color: this.state.color, alpha: this.state.alpha });
    }
  }

  paint(x: number, y: number) {
    if (!this.state.points[`${x}X${y}`]) {
      this.graphics
        .rect(
          x * this.state.pixelSize + this.state.panX,
          y * this.state.pixelSize + this.state.panY,
          this.state.pixelSize,
          this.state.pixelSize
        )
        .fill({ color: this.state.color, alpha: this.state.alpha });
      this.state.points[`${x}X${y}`] = true;
    } else if (!this.hardPainting) {
      this.erase(x, y);
    }
  }
  erase(x: number, y: number) {
    delete this.state.points[`${x}X${y}`];
    this.repaint();
  }
}
