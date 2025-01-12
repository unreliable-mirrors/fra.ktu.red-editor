import {
  Container,
  FederatedPointerEvent,
  Graphics,
  Point,
  TextStyleFontStyle,
  TextStyleFontWeight,
} from "pixi.js";
import { ContainerLayer, ContainerLayerState } from "./container_layer";
import DataStore from "../ui/core/data_store";

export type ShapeLayerState = ContainerLayerState & {
  shape: string;
  size: number;
  color: string;
  panX: number;
  panY: number;
  rotation: number;
  alpha: number;
};

export type ShapeLayerSetting = {
  field: "shape" | "size" | "color" | "panX" | "panY" | "rotation" | "alpha";
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
    {
      field: "alpha",
      type: "float",
      onchange: (value) => {
        this.state.alpha = parseFloat(value);
        this.repaint();
      },
    },
  ];

  constructor(state?: ShapeLayerState) {
    super();
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
        alpha: state.alpha,
      };
      for (var shader of state.shaders) {
        this.addShaderFromState(shader.name, shader);
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
      alpha: 1,
    };
  }

  pointerDown(event: FederatedPointerEvent): void {
    this.clicking = true;
    if (event.ctrlKey || event.metaKey) {
      this.panning = true;
      this.panStart = new Point(this.state.panX, this.state.panY);
      this.clickStart = new Point(event.globalX, event.globalY);
    }
  }
  pointerUp(): void {
    this.clicking = false;
    this.panning = false;
    this.panStart = null;
  }
  pointerMove(event: FederatedPointerEvent): void {
    if (this.panning) {
      this.state.panX = this.panStart!.x + (event.globalX - this.clickStart!.x);
      this.state.panY = this.panStart!.y + (event.globalY - this.clickStart!.y);
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
    this.graphics.alpha = this.state.alpha;
    console.log("WHAT SHAPE", this.state);
  }

  getFontData(): {
    fontFamily: string;
    fontWeight: TextStyleFontWeight;
    fontStyle: TextStyleFontStyle;
  } {
    console.log("FONT", this.state.font);
    if (this.state.font === "Orbitron") {
      return { fontFamily: "Orbitron", fontWeight: "400", fontStyle: "normal" };
    } else if (this.state.font === "Permanent Marker") {
      return {
        fontFamily: "Permanent Marker",
        fontWeight: "400",
        fontStyle: "normal",
      };
    } else if (this.state.font === "Montserrat") {
      return {
        fontFamily: "Montserrat",
        fontWeight: "100",
        fontStyle: "normal",
      };
    } else if (this.state.font === "Noto") {
      return {
        fontFamily: "Noto Sans JP",
        fontWeight: "400",
        fontStyle: "normal",
      };
    } else if (this.state.font === "Caveat") {
      return {
        fontFamily: "Caveat",
        fontWeight: "400",
        fontStyle: "normal",
      };
    } else if (this.state.font === "NewNord") {
      return {
        fontFamily: "newnord",
        fontWeight: "700",
        fontStyle: "italic",
      };
    } else if (this.state.font === "Press Start") {
      return {
        fontFamily: "Press Start 2P",
        fontWeight: "400",
        fontStyle: "normal",
      };
    }
    console.log("ARIALING");
    return { fontFamily: "Arial", fontWeight: "400", fontStyle: "normal" };
  }
}
