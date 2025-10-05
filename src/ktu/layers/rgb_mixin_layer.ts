import { Container, Graphics, Point, Ticker } from "pixi.js";
import { ContainerLayer, ContainerLayerState } from "./container_layer";
import { registerModulatorsFromState } from "../helpers/modulators";
import { getLayerById } from "../helpers/layers";
import { RgbMixinShader } from "../shaders/rgb_mixin/rgb_mixin_shader";
import EventDispatcher from "../ui/core/event_dispatcher";

export type RgbMixinLayerState = ContainerLayerState & {
  red: number;
  green: number;
  blue: number;
};

export type RgbMixinLayerSetting = {
  field: "red" | "green" | "blue";
  type: "layer";
  onchange: (value: string) => void;
};

export class RgbMixinLayer extends ContainerLayer {
  static LAYER_NAME: string = "rgb_mixin_layer";
  declare state: RgbMixinLayerState;
  graphics: Graphics;
  backgroundSize: Point;
  shader: RgbMixinShader;

  redLayer?: ContainerLayer;
  greenLayer?: ContainerLayer;
  blueLayer?: ContainerLayer;

  settings: RgbMixinLayerSetting[] = [
    {
      field: "red",
      type: "layer",
      onchange: (_value) => {
        if (_value) {
          this.bindRed(parseInt(_value));
        } else {
          this.unbindRed();
        }
      },
    },
    {
      field: "green",
      type: "layer",
      onchange: (_value) => {
        if (_value) {
          this.bindGreen(parseInt(_value));
        } else {
          this.unbindGreen();
        }
      },
    },
    {
      field: "blue",
      type: "layer",
      onchange: (_value) => {
        if (_value) {
          this.bindBlue(parseInt(_value));
        } else {
          this.unbindBlue();
        }
      },
    },
  ];

  bindRed = (value: number) => {
    console.log("Binding red to", value);
    this.state.red = value;
    const layer: ContainerLayer = getLayerById(value)!;

    if (!this.redLayer || this.redLayer.getUniqueId() != layer.getUniqueId()) {
      if (this.redLayer) {
        EventDispatcher.getInstance().removeEventListener(
          this.redLayer.getUniqueId() + "",
          "change",
          this.handleRedChange
        );
      }
      this.redLayer = layer;
      EventDispatcher.getInstance().addEventListener(
        layer.getUniqueId() + "",
        "change",
        this.handleRedChange
      );
      EventDispatcher.getInstance().addEventListener(
        layer.getUniqueId() + "",
        "unbind",
        this.unbindRed
      );
    }
    layer.touch();
  };

  bindGreen = (value: number) => {
    this.state.green = value;
    const layer: ContainerLayer = getLayerById(value)!;

    if (
      !this.greenLayer ||
      this.greenLayer.getUniqueId() != layer.getUniqueId()
    ) {
      if (this.greenLayer) {
        EventDispatcher.getInstance().removeEventListener(
          this.greenLayer.getUniqueId() + "",
          "change",
          this.handleGreenChange
        );
      }
      this.greenLayer = layer;
      EventDispatcher.getInstance().addEventListener(
        layer.getUniqueId() + "",
        "change",
        this.handleGreenChange
      );
      EventDispatcher.getInstance().addEventListener(
        layer.getUniqueId() + "",
        "unbind",
        this.unbindGreen
      );
    }
    layer.touch();
  };

  bindBlue = (value: number) => {
    this.state.blue = value;
    const layer: ContainerLayer = getLayerById(value)!;

    if (
      !this.blueLayer ||
      this.blueLayer.getUniqueId() != layer.getUniqueId()
    ) {
      if (this.blueLayer) {
        EventDispatcher.getInstance().removeEventListener(
          this.blueLayer.getUniqueId() + "",
          "change",
          this.handleBlueChange
        );
      }
      this.blueLayer = layer;
      EventDispatcher.getInstance().addEventListener(
        layer.getUniqueId() + "",
        "change",
        this.handleBlueChange
      );
      EventDispatcher.getInstance().addEventListener(
        layer.getUniqueId() + "",
        "unbind",
        this.unbindBlue
      );
    }
    layer.touch();
  };

  unbindRed = () => {
    if (this.redLayer) {
      EventDispatcher.getInstance().removeEventListener(
        this.redLayer.getUniqueId() + "",
        "change",
        this.handleRedChange
      );
      this.state.red = -1;
      this.redLayer = undefined;
      this.shader.setRedTexture(null);
    }
  };

  unbindGreen = () => {
    if (this.greenLayer) {
      EventDispatcher.getInstance().removeEventListener(
        this.greenLayer.getUniqueId() + "",
        "change",
        this.handleGreenChange
      );
      this.state.green = -1;
      this.greenLayer = undefined;
      this.shader.setGreenTexture(null);
    }
  };

  unbindBlue = () => {
    if (this.blueLayer) {
      EventDispatcher.getInstance().removeEventListener(
        this.blueLayer.getUniqueId() + "",
        "change",
        this.handleBlueChange
      );
      this.state.blue = -1;
      this.blueLayer = undefined;
      this.shader.setBlueTexture(null);
    }
  };

  handleRedChange = () => {
    if (this.redLayer) {
      this.shader.setRedTexture(this.redLayer!.mainSprite);
    }
  };
  handleGreenChange = () => {
    if (this.greenLayer) {
      this.shader.setGreenTexture(this.greenLayer!.mainSprite);
    }
  };
  handleBlueChange = () => {
    if (this.blueLayer) {
      this.shader.setBlueTexture(this.blueLayer!.mainSprite);
    }
  };

  constructor(state?: RgbMixinLayerState, includeModulators: boolean = false) {
    super(state);
    this.graphics = new Graphics();
    this.container.addChild(this.graphics);
    this.backgroundSize = new Point(window.innerWidth, window.innerHeight);

    if (state) {
      this.state = {
        ...this.state,
        red: state.red,
        green: state.green,
        blue: state.blue,
      };
      state.modulators;
      for (var shader of state.shaders) {
        if (shader.name !== RgbMixinShader.SHADER_NAME) {
          this.addShaderFromState(shader.name, shader, includeModulators);
        }
      }

      if (includeModulators) {
        registerModulatorsFromState(this, state.modulators);
      }
    }
    this.shader = new RgbMixinShader();
    this.addShader(this.shader);
    this.repaint();
    this.container.interactive = false;

    EventDispatcher.getInstance().addEventListener(
      "camera",
      "reposition",
      () => {
        this.touch(true);
      }
    );
  }

  layerName(): string {
    return RgbMixinLayer.LAYER_NAME;
  }

  defaultState(): RgbMixinLayerState {
    return {
      ...super.defaultState(),
      red: -1,
      green: -1,
      blue: -1,
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

  onChange(): void {
    super.onChange();
    this.handleRedChange();
    this.handleGreenChange();
    this.handleBlueChange();
  }

  pointerDown(_event: PointerEvent): void {
    this.touch();
  }

  bind(container: Container): void {
    super.bind(container);
    this.repaint();
  }

  repaint() {
    this.graphics.clear();
    this.graphics
      .rect(0, 0, window.innerWidth, window.innerHeight)
      .fill({ color: 0x0000ff });
    this.touch(true);
  }

  unbind(): void {
    super.unbind();
    EventDispatcher.getInstance().removeEventListener(
      "camera",
      "reposition",
      () => {
        this.touch(true);
      }
    );
  }
}
