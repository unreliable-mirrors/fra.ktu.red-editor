import { Container, UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./negative_shader.frag?raw";

export type NegativeShaderState = ShaderState & {
  strength: number;
};

export type NegativeShaderSetting = {
  field: "strength";
  type: "float";
  onchange: (value: string) => void;
};

export class NegativeShader extends ShaderLayer {
  static SHADER_NAME: string = "negative_shader";
  declare state: NegativeShaderState;
  fragment: string = fragment;
  container!: Container;
  settings: NegativeShaderSetting[] = [
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

  constructor(state?: NegativeShaderState) {
    super(state);

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
    return NegativeShader.SHADER_NAME;
  }

  defaultState(): NegativeShaderState {
    return {
      ...super.defaultState(),
      strength: 1,
    };
  }
}
