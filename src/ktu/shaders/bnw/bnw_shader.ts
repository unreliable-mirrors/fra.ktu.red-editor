import { UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./bnw_shader.frag?raw";

export type BnwShaderState = ShaderState & {
  strength: number;
};

export type BnwShaderSetting = {
  field: "strength";
  type: "float";
  onchange: (value: string) => void;
};

export class BnwShader extends ShaderLayer {
  static SHADER_NAME: string = "bnw_shader";
  declare state: BnwShaderState;
  fragment: string = fragment;

  settings: BnwShaderSetting[] = [
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

  constructor(state?: BnwShaderState) {
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
    return BnwShader.SHADER_NAME;
  }

  defaultState(): BnwShaderState {
    return { ...super.defaultState(), strength: 1 };
  }
}
