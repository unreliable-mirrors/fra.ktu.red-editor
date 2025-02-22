import { Container, Point, UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./pixelate_shader.frag?raw";
import { ILayer } from "../../../engine/ilayer";

export type PixelateShaderState = ShaderState & {
  pixelSize: number;
};

export type PixelateShaderSetting = {
  field: "pixelSize";
  type: "integer";
  onchange: (value: string) => void;
};

export class PixelateShader extends ShaderLayer {
  static SHADER_NAME: string = "pixelate_shader";
  declare state: PixelateShaderState;
  fragment: string = fragment;
  container!: Container;
  settings: PixelateShaderSetting[] = [
    {
      field: "pixelSize",
      type: "integer",
      onchange: (value) => {
        this.state.pixelSize = parseInt(value);
        this.uniforms.uniforms.uPixelSize = this.state.pixelSize;
        this.refreshSize();
      },
    },
  ];
  uniforms: UniformGroup;

  constructor(state?: PixelateShaderState) {
    super();
    console.log("CONSTRUCTOR", state, this.state);
    if (state) {
      this.state = {
        ...this.state,
        pixelSize: state.pixelSize,
        missProbability: state.missProbability,
        seed: state.seed,
      };
    }
    this.uniforms = new UniformGroup({
      uPixelSize: { value: this.state.pixelSize, type: "f32" },
      uSize: {
        value: new Point(window.innerWidth, window.innerHeight),
        type: "vec2<f32>",
      },
    });
  }

  shaderName(): string {
    return PixelateShader.SHADER_NAME;
  }

  defaultState(): PixelateShaderState {
    return {
      ...super.defaultState(),
      pixelSize: 15,
    };
  }

  bind(container: Container, layer?: ILayer): void {
    super.bind(container, layer);
    this.container = container;
    this.refreshSize();
  }

  resize() {
    this.refreshSize();
  }

  refreshSize() {
    console.log("RESIZE");
    if (this.container.width > 0) {
      let width, height;
      if (this.bindedLayer) {
        width = this.container.width;
        height = this.container.height;
      } else {
        width =
          this.container.width > window.innerWidth
            ? this.container.width
            : window.innerWidth;
        height =
          this.container.height > window.innerHeight
            ? this.container.height
            : window.innerHeight;
        height = width;
      }
      console.log("RESIZE TRUE", width, height);
      this.uniforms.uniforms.uSize = new Point(width, height);
    }
  }
}
