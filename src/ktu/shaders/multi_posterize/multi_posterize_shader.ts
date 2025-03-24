import { UniformData } from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./multi_posterize_shader.frag?raw";

export type MultiPosterizeShaderState = ShaderState & {
  levels: number;
};

export type MultiPosterizeShaderSetting = {
  field: ShaderSetting["field"] | "levels";
  type: ShaderSetting["type"] | "integer";
  onchange: (value: string) => void;
};

export class MultiPosterizeShader extends ShaderLayer {
  static SHADER_NAME: string = "multi_posterize_shader";
  declare state: MultiPosterizeShaderState;
  fragment: string = fragment;

  settings: MultiPosterizeShaderSetting[] = [
    {
      field: "levels",
      type: "integer",
      onchange: (value) => {
        this.state.levels = parseInt(value);
        this.uniforms.uniforms.uLevels = this.state.levels;
      },
    },
    ...this.defaultSettings(),
  ];

  constructor(state?: MultiPosterizeShaderState) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        levels: state.levels,
      };
    }
  }

  shaderName(): string {
    return MultiPosterizeShader.SHADER_NAME;
  }

  defaultState(): MultiPosterizeShaderState {
    return { ...super.defaultState(), levels: 3 };
  }
  setupUniformValues(): { [key: string]: UniformData } {
    return {
      uLevels: { value: this.state.levels, type: "f32" },
    };
  }
}
