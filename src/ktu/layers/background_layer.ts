import { Container, Graphics, Point, Ticker } from "pixi.js";
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
  backgroundSize: Point;

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
    super(state);
    this.graphics = new Graphics();
    this.container.addChild(this.graphics);
    this.backgroundSize = new Point(window.innerWidth, window.innerHeight);

    if (state) {
      console.log("VISIBLE", JSON.stringify(state.visible));
      console.log("THIS STATEA", JSON.stringify(this.state));
      this.state = { ...this.state, color: state.color, alpha: state.alpha };
      console.log("THIS STATEB", JSON.stringify(this.state));
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

  tick(time: Ticker): void {
    super.tick(time);
    if (
      this.backgroundSize.x != window.innerWidth ||
      this.backgroundSize.y != window.innerHeight
    ) {
      this.backgroundSize = new Point(window.innerWidth, window.innerHeight);
      this.repaint();
    }
  }

  bind(container: Container): void {
    super.bind(container);
    this.repaint();
  }

  repaint() {
    this.graphics.clear();
    this.graphics
      .rect(0, 0, window.innerWidth, window.innerHeight)
      .fill({ color: this.state.color, alpha: this.state.alpha });
  }
}
