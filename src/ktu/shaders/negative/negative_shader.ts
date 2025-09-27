import { UniformData } from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./negative_shader.frag?raw";
import { registerModulatorsFromState } from "../../helpers/modulators";

export type NegativeShaderState = ShaderState & {
  strength: number;
};

export class NegativeShader extends ShaderLayer {
  static SHADER_NAME: string = "negative_shader";
  declare state: NegativeShaderState;
  fragment: string = fragment;
  settings: ShaderSetting[] = this.defaultSettings();

  constructor(state?: NegativeShaderState, includeModulators: boolean = false) {
    super(state);
    if (state) {
      if (includeModulators) {
        registerModulatorsFromState(this, state.modulators);
      }
    }
  }

  shaderName(): string {
    return NegativeShader.SHADER_NAME;
  }

  setupUniformValues(): { [key: string]: UniformData } {
    return {
      uStrength: { value: this.state.strength, type: "f32" },
    };
  }
}
