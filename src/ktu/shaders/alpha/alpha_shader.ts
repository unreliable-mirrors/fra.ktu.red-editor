import { UniformData } from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./alpha_shader.frag?raw";

export type AlphaShaderState = ShaderState & {
  alpha: number;
};

export type AlphaShaderSetting = {
  field: ShaderSetting["field"] | "alpha";
  type: ShaderSetting["type"] | "integer";
  onchange: (value: string) => void;
};

export class AlphaShader extends ShaderLayer {
  static SHADER_NAME: string = "alpha_shader";
  declare state: AlphaShaderState;
  fragment: string = fragment;

  settings: AlphaShaderSetting[] = [
    {
      field: "alpha",
      type: "float",
      onchange: (value) => {
        this.state.alpha = parseFloat(value);
        this.uniforms.uniforms.uAlpha = this.state.alpha;
      },
    },
    ...this.defaultSettings(),
  ];

  constructor(state?: AlphaShaderState) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        alpha: state.alpha,
      };
    }
  }

  shaderName(): string {
    return AlphaShader.SHADER_NAME;
  }

  defaultState(): AlphaShaderState {
    return { ...super.defaultState(), alpha: 1 };
  }

  setupUniformValues(): { [key: string]: UniformData } {
    return {
      uAlpha: { value: this.state.alpha, type: "f32" },
    };
  }
}
