import { UniformData } from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./scramble_shader.frag?raw";
import { registerModulatorsFromState } from "../../helpers/modulators";

export type ScrambleShaderState = ShaderState & {
  range: number;
};

export type ScrambleShaderSetting = {
  field: ShaderSetting["field"] | "range" | "refresh";
  type: ShaderSetting["type"] | "integer" | "modulator_only";
  onchange: (value: string) => void;
};

export class ScrambleShader extends ShaderLayer {
  static SHADER_NAME: string = "scramble_shader";
  declare state: ScrambleShaderState;
  fragment: string = fragment;
  settings: ScrambleShaderSetting[] = [
    {
      field: "range",
      type: "integer",
      onchange: (value) => {
        this.state.range = parseFloat(value);
        this.uniforms.uniforms.uRange = this.state.range;
      },
    },
    {
      field: "refresh",
      type: "modulator_only",
      onchange: (value) => {
        if (parseFloat(value) >= 1) {
          this.uniforms.uniforms.uTime = Math.random() * 60;
        }
      },
    },
    ...this.defaultSettings(),
  ];

  constructor(state?: ScrambleShaderState, includeModulators: boolean = false) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        range: state.range,
      };
      if (includeModulators) {
        registerModulatorsFromState(this, state.modulators);
      }
    }
  }

  shaderName(): string {
    return ScrambleShader.SHADER_NAME;
  }

  defaultState(): ScrambleShaderState {
    return {
      ...super.defaultState(),
      range: 10,
    };
  }

  setupUniformValues(): { [key: string]: UniformData } {
    return {
      uRange: { value: this.state.range, type: "f32" },
      uTime: { value: Math.random(), type: "f32" },
    };
  }
}
