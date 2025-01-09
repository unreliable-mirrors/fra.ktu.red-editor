import { Container, FederatedPointerEvent, Point, Text } from "pixi.js";
import { ContainerLayer, ContainerLayerState } from "./container_layer";
import DataStore from "../ui/core/data_store";

export type TextLayerState = ContainerLayerState & {
  text: string;
  fontSize: number;
  color: string;
  panX: number;
  panY: number;
  alpha: number;
};

export type TextLayerSetting = {
  field: "text" | "fontSize" | "color" | "panX" | "panY" | "alpha";
  type: "text" | "integer" | "color" | "float";
  onchange: (value: string) => void;
};

export class TextLayer extends ContainerLayer {
  static LAYER_NAME: string = "text_layer";
  declare state: TextLayerState;
  text: Text;
  clicking: boolean = false;
  panning: boolean = false;
  panStart?: Point | null;
  clickStart?: Point | null;
  settings: TextLayerSetting[] = [
    {
      field: "text",
      type: "text",
      onchange: (value) => {
        this.state.text = value;
        this.repaint();
      },
    },
    {
      field: "fontSize",
      type: "integer",
      onchange: (value) => {
        this.state.fontSize = parseInt(value);
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
      field: "alpha",
      type: "float",
      onchange: (value) => {
        this.state.alpha = parseFloat(value);
        this.repaint();
      },
    },
  ];

  constructor(state?: TextLayerState) {
    super();
    this.text = new Text();
    this.container.addChild(this.text);

    if (state) {
      this.state = {
        ...this.state,
        text: state.text,
        fontSize: state.fontSize,
        color: state.color,
        panX: state.panX,
        panY: state.panY,
        alpha: state.alpha,
      };
      for (var shader of state.shaders) {
        this.addShaderFromState(shader.name, shader);
      }
    }
  }

  layerName(): string {
    return TextLayer.LAYER_NAME;
  }

  defaultState(): TextLayerState {
    return {
      ...super.defaultState(),
      text: "TEXT GOES HERE",
      fontSize: 64,
      color: "#FFFFFF",
      panX: 0,
      panY: 0,
      alpha: 1,
    };
  }

  pointerDown(event: FederatedPointerEvent): void {
    this.clicking = true;
    if (event.ctrlKey) {
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
    this.container.removeChildren();
    this.text.destroy();
    this.text = new Text({
      text: this.state.text,
      style: {
        fontFamily: "Arial",
        fontSize: this.state.fontSize,
        fill: this.state.color,
      },
    });
    this.text.x = this.state.panX;
    this.text.y = this.state.panY;
    this.text.alpha = this.state.alpha;
    this.container.addChild(this.text);
  }
}
