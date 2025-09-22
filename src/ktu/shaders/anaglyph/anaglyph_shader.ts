import { UniformData } from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./anaglyph_shader.frag?raw";
import { registerModulatorsFromState } from "../../helpers/modulators";

export type AnaglyphShaderState = ShaderState & {
  strength: number;
};

export type AnaglyphShaderSetting = {
  field: ShaderSetting["field"] | "strength";
  type: ShaderSetting["type"] | "integer";
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
    ...this.defaultSettings(),
  ];

  constructor(state?: AnaglyphShaderState, includeModulators: boolean = false) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        strength: state.strength,
      };
      if (includeModulators) {
        registerModulatorsFromState(this, state.modulators);
      }
    }
  }

  shaderName(): string {
    return AnaglyphShader.SHADER_NAME;
  }

  defaultState(): AnaglyphShaderState {
    return { ...super.defaultState(), strength: 1 };
  }

  setupUniformValues(): { [key: string]: UniformData } {
    return {
      uStrength: { value: this.state.strength, type: "f32" },
    };
  }
}
