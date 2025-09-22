import { UniformData } from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./vintage_shader.frag?raw";
import { registerModulatorsFromState } from "../../helpers/modulators";

export type VintageShaderState = ShaderState & {
  strength: number;
};

export class VintageShader extends ShaderLayer {
  static SHADER_NAME: string = "vintage_shader";
  declare state: VintageShaderState;
  fragment: string = fragment;
  settings: ShaderSetting[] = this.defaultSettings();

  constructor(state?: VintageShaderState, includeModulators: boolean = false) {
    super(state);
    if (state) {
      if (includeModulators) {
        registerModulatorsFromState(this, state.modulators);
      }
    }
  }

  shaderName(): string {
    return VintageShader.SHADER_NAME;
  }

  setupUniformValues(): { [key: string]: UniformData } {
    return {};
  }
}
