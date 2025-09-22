import { UniformData } from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./posterize_shader.frag?raw";
import { registerModulatorsFromState } from "../../helpers/modulators";

export type PosterizeShaderState = ShaderState & {
  threshold: number;
};

export type PosterizeShaderSetting = {
  field: ShaderSetting["field"] | "threshold";
  type: ShaderSetting["type"] | "float";
  onchange: (value: string) => void;
};

export class PosterizeShader extends ShaderLayer {
  static SHADER_NAME: string = "posterize_shader";
  declare state: PosterizeShaderState;
  fragment: string = fragment;

  settings: PosterizeShaderSetting[] = [
    {
      field: "threshold",
      type: "float",
      onchange: (value) => {
        this.state.threshold = parseFloat(value);
        this.uniforms.uniforms.uThreshold = this.state.threshold;
      },
    },
    ...this.defaultSettings(),
  ];

  constructor(
    state?: PosterizeShaderState,
    includeModulators: boolean = false
  ) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        threshold: state.threshold,
      };
      if (includeModulators) {
        registerModulatorsFromState(this, state.modulators);
      }
    }
  }

  shaderName(): string {
    return PosterizeShader.SHADER_NAME;
  }

  defaultState(): PosterizeShaderState {
    return { ...super.defaultState(), threshold: 0.3 };
  }
  setupUniformValues(): { [key: string]: UniformData } {
    return {
      uThreshold: { value: this.state.threshold, type: "f32" },
    };
  }
}
