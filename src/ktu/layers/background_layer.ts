import { Container, Graphics, Point, Ticker } from "pixi.js";
import { ContainerLayer, ContainerLayerState } from "./container_layer";
import { getFunColor } from "../helpers/sparkle";

export type BackgroundLayerState = ContainerLayerState & {
  color: string;
};

export type BackgroundLayerSetting = {
  field: "color";
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
  ];

  constructor(state?: BackgroundLayerState) {
    super(state);
    this.graphics = new Graphics();
    this.container.addChild(this.graphics);
    this.backgroundSize = new Point(window.innerWidth, window.innerHeight);

    if (state) {
      console.log("VISIBLE", JSON.stringify(state.visible));
      console.log("THIS STATEA", JSON.stringify(this.state));
      this.state = { ...this.state, color: state.color };
      console.log("THIS STATEB", JSON.stringify(this.state));
      for (var shader of state.shaders) {
        this.addShaderFromState(shader.name, shader);
      }
    }
  }

  layerName(): string {
    return BackgroundLayer.LAYER_NAME;
  }

  defaultState(): BackgroundLayerState {
    return {
      ...super.defaultState(),
      color: getFunColor(),
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
      .fill({ color: this.state.color });
  }
}
