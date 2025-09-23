import { Container, Graphics, Point } from "pixi.js";
import { ContainerLayer, ContainerLayerState } from "./container_layer";
import DataStore from "../ui/core/data_store";
import { registerModulatorsFromState } from "../helpers/modulators";

export type ShapeLayerState = ContainerLayerState & {
  shape: string;
  size: number;
  color: string;
  panX: number;
  panY: number;
  rotation: number;
};

export type ShapeLayerSetting = {
  field: "shape" | "size" | "color" | "panX" | "panY" | "rotation";
  type: "options" | "integer" | "color" | "float";
  values?: string[];
  onchange: (value: string) => void;
};

export class ShapeLayer extends ContainerLayer {
  static LAYER_NAME: string = "shape_layer";
  static SHAPES: string[] = ["square", "circle", "star"];
  graphics: Graphics;
  declare state: ShapeLayerState;
  clicking: boolean = false;
  panning: boolean = false;
  panStart?: Point | null;
  clickStart?: Point | null;
  settings: ShapeLayerSetting[] = [
    {
      field: "shape",
      type: "options",
      values: ShapeLayer.SHAPES,
      onchange: (value) => {
        this.state.shape = value;
        this.repaint();
        DataStore.getInstance().touch("layers");
      },
    },
    {
      field: "size",
      type: "integer",
      onchange: (value) => {
        this.state.size = parseInt(value);
        this.repaint();
      },
    },
    {
      field: "color",
      type: "color",
      onchange: (value) => {
        this.state.color = value;
        this.repaint();
      },
    },
    {
      field: "panX",
      type: "integer",
      onchange: (value) => {
        this.state.panX = parseInt(value);
        this.repaint();
      },
    },
    {
      field: "panY",
      type: "integer",
      onchange: (value) => {
        this.state.panY = parseInt(value);
        this.repaint();
      },
    },
    {
      field: "rotation",
      type: "integer",
      onchange: (value) => {
        this.state.rotation = parseInt(value);
        this.repaint();
      },
    },
  ];

  constructor(state?: ShapeLayerState, includeModulators: boolean = false) {
    super(state);
    this.graphics = new Graphics();
    this.container.addChild(this.graphics);
    if (state) {
      this.state = {
        ...this.state,
        shape: state.shape,
        size: state.size,
        color: state.color,
        panX: state.panX,
        panY: state.panY,
        rotation: state.rotation,
      };
      for (var shader of state.shaders) {
        this.addShaderFromState(shader.name, shader, includeModulators);
      }
      if (includeModulators) {
        registerModulatorsFromState(this, state.modulators);
      }
    }
  }

  layerName(): string {
    return ShapeLayer.LAYER_NAME;
  }

  defaultState(): ShapeLayerState {
    return {
      ...super.defaultState(),
      shape:
        ShapeLayer.SHAPES[Math.floor(Math.random() * ShapeLayer.SHAPES.length)],
      size: 320,
      color: "#FFFFFF",
      panX: Math.floor((Math.random() * 0.8 + 0.1) * window.innerWidth),
      panY: Math.floor((Math.random() * 0.8 + 0.1) * window.innerHeight),
      rotation: 0,
    };
  }

  pointerDown(event: PointerEvent): void {
    this.clicking = true;
    this.panning = true;
    this.panStart = new Point(this.state.panX, this.state.panY);
    this.clickStart = this.container.toLocal<Point>({
      x: event.clientX,
      y: event.clientY,
    });
  }
  pointerUp(): void {
    this.clicking = false;
    this.panning = false;
    this.panStart = null;
  }
  pointerMove(event: PointerEvent): void {
    if (this.panning) {
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

  bind(container: Container): void {
    super.bind(container);
    this.repaint();
  }

  repaint() {
    this.graphics.clear();
    if (this.state.shape === "square") {
      console.log("SQUARE");
      this.graphics
        .rect(
          -this.state.size / 2,
          -this.state.size / 2,
          this.state.size,
          this.state.size
        )
        .stroke({ width: 2, color: this.state.color });
    } else if (this.state.shape === "circle") {
      console.log("CIRCLE");
      this.graphics
        .ellipse(0, 0, this.state.size / 2, this.state.size / 2)
        .stroke({ width: 2, color: this.state.color });
    }
    if (this.state.shape === "star") {
      console.log("STAR");
      this.graphics
        .star(0, 0, 5, this.state.size / 2)

        .stroke({ width: 2, color: this.state.color });
    }
    this.graphics.x = this.state.panX;
    this.graphics.y = this.state.panY;
    this.graphics.angle = this.state.rotation;
    console.log("WHAT SHAPE", this.state);
  }
}
