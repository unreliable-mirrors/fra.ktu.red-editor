import { UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./anaglyph_shader.frag?raw";

export type AnaglyphShaderState = ShaderState & {
  strength: number;
};

export type AnaglyphShaderSetting = {
  field: "strength";
  type: "integer";
  onchange: (value: string) => void;
};

export class AnaglyphShader extends ShaderLayer {
  static SHADER_NAME: string = "anaglyph_shader";
  declare state: AnaglyphShaderState;
  fragment: string = fragment;

  settings: AnaglyphShaderSetting[] = [
    {
      field: "strength",
      type: "integer",
      onchange: (value) => {
        this.state.strength = parseInt(value);
        this.uniforms.uniforms.uStrength = this.state.strength;
      },
    },
  ];
  uniforms: UniformGroup;

  constructor(state?: AnaglyphShaderState) {
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
    return AnaglyphShader.SHADER_NAME;
  }

  defaultState(): AnaglyphShaderState {
    return { ...super.defaultState(), strength: 1 };
  }
}
