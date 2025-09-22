import { UniformData } from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./hue_posterize_shader.frag?raw";

export type HuePosterizeShaderState = ShaderState & {
  levels: number;
  offset: number;
};

export type HuePosterizeShaderSetting = {
  field: ShaderSetting["field"] | "levels" | "offset";
  type: ShaderSetting["type"] | "integer" | "float";
  onchange: (value: string) => void;
};

export class HuePosterizeShader extends ShaderLayer {
  static SHADER_NAME: string = "hue_posterize_shader";
  declare state: HuePosterizeShaderState;
  fragment: string = fragment;

  settings: HuePosterizeShaderSetting[] = [
    {
      field: "levels",
      type: "integer",
      onchange: (value) => {
        this.state.levels = parseInt(value);
        this.uniforms.uniforms.uLevels = this.state.levels;
      },
    },
    {
      field: "offset",
      type: "float",
      onchange: (value) => {
        this.state.offset = parseFloat(value);
        this.uniforms.uniforms.uOffset = this.state.offset;
      },
    },
    ...this.defaultSettings(),
  ];

  constructor(state?: HuePosterizeShaderState) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        levels: state.levels,
      };
    }
  }

  shaderName(): string {
    return HuePosterizeShader.SHADER_NAME;
  }

  defaultState(): HuePosterizeShaderState {
    return { ...super.defaultState(), levels: 2, offset: 0 };
  }
  setupUniformValues(): { [key: string]: UniformData } {
    return {
      uLevels: { value: this.state.levels, type: "f32" },
      uOffset: { value: this.state.offset, type: "f32" },
    };
  }
}
