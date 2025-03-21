import { UniformData } from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./bnw_shader.frag?raw";

export type BnwShaderState = ShaderState & {
  strength: number;
};

export class BnwShader extends ShaderLayer {
  static SHADER_NAME: string = "bnw_shader";
  declare state: BnwShaderState;
  fragment: string = fragment;

  settings: ShaderSetting[] = this.defaultSettings();

  constructor(state?: BnwShaderState) {
    super(state);
  }

  shaderName(): string {
    return BnwShader.SHADER_NAME;
  }

  setupUniformValues(): { [key: string]: UniformData } {
    return {};
  }
}
