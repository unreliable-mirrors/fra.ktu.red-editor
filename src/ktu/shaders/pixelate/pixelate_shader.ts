import { UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./pixelate_shader.frag?raw";

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
  settings: PixelateShaderSetting[] = [
    {
      field: "pixelSize",
      type: "integer",
      onchange: (value) => {
        this.state.pixelSize = parseInt(value);
        this.uniforms.uniforms.uPixelSize = this.state.pixelSize;
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
      };
    }
    this.uniforms = new UniformGroup({
      uPixelSize: { value: this.state.pixelSize, type: "f32" },
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
}
