import { Container, Graphics } from "pixi.js";
import { ContainerLayer, ContainerLayerState } from "./container_layer";
import { getFunColor } from "../helpers/sparkle";

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
  static LAYER_NAME: string = "background_layer";
  declare state: BackgroundLayerState;
  graphics: Graphics;
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
      this.state = { ...this.state, color: state.color, alpha: state.alpha };
      for (var shader of state.shaders) {
        this.addShaderFromState(shader.name, shader);
      }
    }

    console.log(
      "CONSTRUCT",
      state,
      this.state.shaders.length,
      this.state.shaders
    );
  }

  layerName(): string {
    return BackgroundLayer.LAYER_NAME;
  }

  defaultState(): BackgroundLayerState {
    return {
      ...super.defaultState(),
      color: getFunColor(),
      alpha: 1,
    };
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
