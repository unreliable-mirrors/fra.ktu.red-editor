import { Container, Graphics } from "pixi.js";
import { ContainerLayer, ContainerLayerState } from "./container_layer";

export type BackgroundLayerState = ContainerLayerState & {
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
        shaders: [],
        color: state.color,
        alpha: state.alpha,
      };
      for (var shader of state.shaders) {
        this.addShaderFromState(shader.name, shader);
      }
    } else {
      this.state = {
        name: "background_layer",
        layerId: this.layerId,
        shaders: [],
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
      .rect(0, 0, this.container.parent.width, this.container.parent.height)
      .fill({ color: this.state.color, alpha: this.state.alpha });
  }
}
