import { UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./vintage_shader.frag?raw";

export type VintageShaderState = ShaderState & {
  strength: number;
};

export type VintageShaderSetting = {
  field: "strength";
  type: "float";
  onchange: (value: string) => void;
};

export class VintageShader extends ShaderLayer {
  static SHADER_NAME: string = "vintage_shader";
  declare state: VintageShaderState;
  fragment: string = fragment;
  settings: VintageShaderSetting[] = [
    {
      field: "strength",
      type: "float",
      onchange: (value) => {
        this.state.strength = parseFloat(value);
        this.uniforms.uniforms.uStrength = this.state.strength;
      },
    },
  ];
  uniforms: UniformGroup;

  constructor(state?: VintageShaderState) {
    super();

    if (state) {
      this.state = {
        ...this.state,
        strength: state.strength,
      };
    }
    this.uniforms = new UniformGroup({
      uStrength: { value: this.state.strength, type: "f32" },
    });
  }

  shaderName(): string {
    return VintageShader.SHADER_NAME;
  }

  defaultState(): VintageShaderState {
    return { ...super.defaultState(), strength: 1 };
  }
}
