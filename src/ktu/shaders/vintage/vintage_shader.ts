import { UniformData } from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./vintage_shader.frag?raw";

export type VintageShaderState = ShaderState & {
  strength: number;
};

export class VintageShader extends ShaderLayer {
  static SHADER_NAME: string = "vintage_shader";
  declare state: VintageShaderState;
  fragment: string = fragment;
  settings: ShaderSetting[] = this.defaultSettings();

  constructor(state?: VintageShaderState) {
    super(state);
  }

  shaderName(): string {
    return VintageShader.SHADER_NAME;
  }

  setupUniformValues(): { [key: string]: UniformData } {
    return {};
  }
}
