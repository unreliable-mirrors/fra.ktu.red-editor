import { Graphics, Point } from "pixi.js";

import { ContainerLayer, ContainerLayerState } from "./container_layer";
import DataStore from "../ui/core/data_store";

export type DrawLayerState = ContainerLayerState & {
  points: Record<string, boolean>;
  brush: string;
  brushSize: number;
  gridSize: number;
  color: string;
  alpha: number;
  panX: number;
  panY: number;
};

export type DrawLayerSetting = {
  field:
    | "brush"
    | "brushSize"
    | "gridSize"
    | "color"
    | "alpha"
    | "panX"
    | "panY";
  type: "options" | "color" | "integer" | "float";
  values?: string[];
  onchange: (value: string) => void;
};

export class DrawLayer extends ContainerLayer {
  static LAYER_NAME: string = "draw_layer";
  graphics: Graphics;
  clicking: boolean = false;
  erasing: boolean = false;
  hardPainting: boolean = false;
  bucketPainting: boolean = false;
  panning: boolean = false;
  panStart?: Point | null;
  clickStart?: Point | null;
  stroke: Record<string, boolean>;
  declare state: DrawLayerState;
  absorbingLayer: boolean = true;

  settings: DrawLayerSetting[] = [
    {
      field: "brush",
      type: "options",
      values: ["rect", "ellipse", "cross"],
      onchange: (value: string) => {
        this.state.brush = value;
        console.log(this.state.brush);
        this.repaint();
      },
    },
    {
      field: "brushSize",
      type: "integer",
      onchange: (value: string) => {
        this.state.brushSize = parseInt(value);
        this.repaint();
      },
    },
    {
      field: "gridSize",
      type: "integer",
      onchange: (value: string) => {
        this.state.gridSize = parseInt(value);
        this.repaint();
      },
    },
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

  constructor(state?: DrawLayerState) {
    super(state);
    this.graphics = new Graphics();
    this.container.addChild(this.graphics);
    this.stroke = {};

    if (state) {
      this.state = {
        ...this.state,
        points: {},
        brush: state.brush,
        brushSize: state.brushSize,
        gridSize: state.gridSize,
        color: state.color,
        alpha: state.alpha,
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
    }
  }

  layerName(): string {
    return DrawLayer.LAYER_NAME;
  }

  defaultState(): DrawLayerState {
    return {
      ...super.defaultState(),
      points: {},
      brush: "rect",
      brushSize: 15,
      gridSize: 15,
      color: "#FFFFFF",
      alpha: 1,
      panX: 0,
      panY: 0,
    };
  }

  pointerDown(event: PointerEvent): void {
    console.log("NUMBER", event, this.state);
    this.clicking = true;
    if (event.button === 2) {
      this.erasing = true;
    } else if (event.ctrlKey || event.metaKey) {
      this.panning = true;
      this.panStart = new Point(this.state.panX, this.state.panY);
      this.clickStart = this.container.toLocal<Point>({
        x: event.clientX,
        y: event.clientY,
      });
    } else if (event.altKey) {
      this.bucketPainting = true;
    }
    if (event.shiftKey) {
      this.hardPainting = true;
    }
    if (!this.panning) {
      this.stroke = {};
      this.metapaint(event);
    }
  }
  pointerUp(): void {
    this.clicking = false;
    this.erasing = false;
    this.hardPainting = false;
    this.panning = false;
    this.bucketPainting = false;
    this.panStart = null;
  }
  pointerMove(event: PointerEvent): void {
    if (!this.panning) {
      this.metapaint(event);
    } else {
      const localPoint: Point = this.container.toLocal({
        x: event.clientX,
        y: event.clientY,
      });
      this.state.panX = this.panStart!.x + (localPoint.x - this.clickStart!.x);
      this.state.panY = this.panStart!.y + (localPoint.y - this.clickStart!.y);
      this.repaint();
      DataStore.getInstance().touch("layers");
    }
  }

  metapaint(event: PointerEvent) {
    if (this.clicking) {
      const localPoint: Point = this.container.toLocal({
        x: event.clientX,
        y: event.clientY,
      });
      const x = Math.floor(
        (localPoint.x + this.state.gridSize / 2 - this.state.panX) /
          this.state.gridSize
      );
      const y = Math.floor(
        (localPoint.y + this.state.gridSize / 2 - this.state.panY) /
          this.state.gridSize
      );
      if (!this.stroke[`${x}X${y}`]) {
        this.stroke[`${x}X${y}`] = true;
        if (this.bucketPainting) {
          let newX = x;
          while (
            newX >= 0 &&
            (!this.state.points[`${newX}X${y}`] || !this.hardPainting)
          ) {
            this.paint(newX, y);
            newX--;
          }
          newX = x + 1;
          while (
            newX <= window.innerWidth / this.state.gridSize &&
            (!this.state.points[`${newX}X${y}`] || !this.hardPainting)
          ) {
            this.paint(newX, y);
            newX++;
          }
        } else if (!this.erasing) {
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
      this.drawPoint(x, y);
    }
  }

  paint(x: number, y: number) {
    if (!this.state.points[`${x}X${y}`]) {
      this.drawPoint(x, y);
      this.state.points[`${x}X${y}`] = true;
    } else if (!this.hardPainting) {
      this.erase(x, y);
    }
  }

  drawPoint(x: number, y: number) {
    if (this.state.brush === "rect") {
      this.graphics
        .rect(
          x * this.state.gridSize + this.state.panX - this.state.gridSize / 2,
          y * this.state.gridSize + this.state.panY - this.state.gridSize / 2,
          this.state.brushSize,
          this.state.brushSize
        )
        .fill({ color: this.state.color, alpha: this.state.alpha });
    } else if (this.state.brush === "ellipse") {
      this.graphics
        .ellipse(
          x * this.state.gridSize + this.state.panX,
          y * this.state.gridSize + this.state.panY,
          this.state.brushSize / 2,
          this.state.brushSize / 2
        )
        .fill({ color: this.state.color, alpha: this.state.alpha });
    } else if (this.state.brush === "cross") {
      this.graphics
        .moveTo(
          x * this.state.gridSize + this.state.panX,
          y * this.state.gridSize + this.state.panY - this.state.brushSize / 2
        )
        .lineTo(
          x * this.state.gridSize + this.state.panX,
          y * this.state.gridSize + this.state.panY + this.state.brushSize / 2
        )
        .stroke({ width: 2, color: this.state.color });
      this.graphics
        .moveTo(
          x * this.state.gridSize + this.state.panX - this.state.brushSize / 2,
          y * this.state.gridSize + this.state.panY
        )
        .lineTo(
          x * this.state.gridSize + this.state.panX + this.state.brushSize / 2,
          y * this.state.gridSize + this.state.panY
        )
        .stroke({ width: 2, color: this.state.color });
    }
  }
  erase(x: number, y: number) {
    delete this.state.points[`${x}X${y}`];
    this.repaint();
  }
}
