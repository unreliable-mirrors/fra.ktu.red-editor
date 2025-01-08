import { Container, Graphics } from "pixi.js";
import { ContainerLayer } from "./container_layer";

export type BackgroundLayerState = {
  name: string;
  layerId: number;
  color: string;
  alpha: number;
};

export type BackgroundLayerSetting = {
  field: "color" | "alpha";
  type: "color" | "float";
  onchange: (value: string) => void;
};

export class BackgroundLayer extends ContainerLayer {
  graphics: Graphics;
  state: BackgroundLayerState;
  settings: BackgroundLayerSetting[] = [
    {
      field: "color",
      type: "color",
      onchange: (value) => {
        this.state.color = value;
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

  constructor(state?: BackgroundLayerState) {
    super();
    this.graphics = new Graphics();
    this.container.addChild(this.graphics);

    if (state) {
      this.state = {
        name: state.name,
        layerId: state.layerId,
        color: state.color,
        alpha: state.alpha,
      };
    } else {
      this.state = {
        name: "background_layer",
        layerId: this.layerId,
        color: "#000000",
        alpha: 1,
      };
    }
  }

  bind(container: Container): void {
    super.bind(container);
    this.repaint();
  }

  repaint() {
    this.graphics.clear();
    this.graphics
      .rect(0, 0, this.parent!.width, this.parent!.height)
      .fill({ color: this.state.color, alpha: this.state.alpha });
  }
}
