import { Container, Point, UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./hlines_shader.frag?raw";

export type HLinesShaderState = ShaderState & {
  pixelSize: number;
};

export type HLinesShaderSetting = {
  field: "size";
  type: "integer";
  onchange: (value: string) => void;
};

export class HLinesShader extends ShaderLayer {
  static SHADER_NAME: string = "hlines_shader";
  declare state: HLinesShaderState;
  fragment: string = fragment;
  container!: Container;
  settings: HLinesShaderSetting[] = [
    {
      field: "size",
      type: "integer",
      onchange: (value) => {
        this.state.pixelSize = parseInt(value);
        this.uniforms.uniforms.uPixelSize = this.state.pixelSize;
        this.refreshSize();
      },
    },
  ];
  uniforms: UniformGroup;

  constructor(state?: HLinesShaderState) {
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
    return HLinesShader.SHADER_NAME;
  }

  defaultState(): HLinesShaderState {
    return {
      ...super.defaultState(),
      pixelSize: 15,
    };
  }

  bind(container: Container): void {
    super.bind(container);
    this.container = container;
    this.refreshSize();
  }

  resize() {
    this.refreshSize();
  }

  refreshSize() {
    if (this.container.width > 0) {
      this.uniforms.uniforms.uSize = new Point(
        this.container.width,
        this.container.height
      );
    }
  }
}
