import {
  Application,
  Container,
  Graphics,
  Point,
  Sprite,
  Ticker,
} from "pixi.js";
import { ContainerLayer, ContainerLayerState } from "./container_layer";
import { getFunColor } from "../helpers/sparkle";
import { registerModulatorsFromState } from "../helpers/modulators";
import DataStore from "../ui/core/data_store";

export type BackgroundLayerState = ContainerLayerState & {
  color: string;
};

export type BackgroundLayerSetting = {
  field: "color";
  type: "color" | "float";
  onchange: (value: string) => void;
  currentValue: () => any;
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
      currentValue: () => {
        return this.state.color;
      },
    },
  ];

  constructor(
    state?: BackgroundLayerState,
    includeModulators: boolean = false
  ) {
    super(state);
    this.graphics = new Graphics();
    this.container.addChild(this.graphics);
    this.backgroundSize = new Point(window.innerWidth, window.innerHeight);

    if (state) {
      this.state = { ...this.state, color: state.color };
      state.modulators;
      for (var shader of state.shaders) {
        this.addShaderFromState(shader.name, shader, includeModulators);
      }

      if (includeModulators) {
        registerModulatorsFromState(this, state.modulators);
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

  tick(time: Ticker, loop: boolean): void {
    super.tick(time, loop);
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

    this.retexture();
  }

  retexture() {
    console.log("RETEXURE BACKGROUND");
    if (!this.mainSprite) {
      this.mainSprite = new Sprite();
      this.container.addChild(this.mainSprite);
    }

    const texture = (
      DataStore.getInstance().getStore("app") as Application
    ).renderer.generateTexture(this.graphics);
    this.mainSprite.texture = texture;
    this.mainSprite.visible = false;

    this.touch();
  }
}
