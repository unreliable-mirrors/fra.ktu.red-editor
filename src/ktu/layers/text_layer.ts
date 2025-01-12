import {
  Container,
  FederatedPointerEvent,
  Point,
  Text,
  TextStyleFontStyle,
  TextStyleFontWeight,
} from "pixi.js";
import { ContainerLayer, ContainerLayerState } from "./container_layer";
import DataStore from "../ui/core/data_store";
import { getStartingText } from "../helpers/sparkle";

export type TextLayerState = ContainerLayerState & {
  text: string;
  font: string;
  fontSize: number;
  color: string;
  panX: number;
  panY: number;
  alpha: number;
};

export type TextLayerSetting = {
  field: "font" | "text" | "fontSize" | "color" | "panX" | "panY" | "alpha";
  type: "text" | "integer" | "color" | "float" | "options";
  values?: string[];
  onchange: (value: string) => void;
};

export class TextLayer extends ContainerLayer {
  static LAYER_NAME: string = "text_layer";
  static FONTS: string[] = [
    "Orbitron",
    "Permanent Marker",
    "Montserrat",
    "Noto",
    "Caveat",
    "NewNord",
    "Press Start",
  ];

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
      field: "font",
      type: "options",
      values: TextLayer.FONTS,
      onchange: (value) => {
        this.state.font = value;
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
        font: state.font,
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
      text: getStartingText().toUpperCase(),
      font: TextLayer.FONTS[Math.floor(Math.random() * TextLayer.FONTS.length)],
      fontSize: 32,
      color: "#FFFFFF",
      panX: Math.floor((Math.random() * 0.8 + 0.1) * window.innerWidth),
      panY: Math.floor((Math.random() * 0.8 + 0.1) * window.innerHeight),
      alpha: 1,
    };
  }

  pointerDown(event: FederatedPointerEvent): void {
    this.clicking = true;
    this.panning = true;
    this.panStart = new Point(this.state.panX, this.state.panY);
    this.clickStart = new Point(event.globalX, event.globalY);
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
        ...this.getFontData(),
        fontSize: this.state.fontSize,
        fill: this.state.color,
        align: "center",
      },
    });
    this.text.x = this.state.panX;
    this.text.y = this.state.panY;
    this.text.alpha = this.state.alpha;
    this.text.anchor.set(0.5, 0.5);
    this.container.addChild(this.text);
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
