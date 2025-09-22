import { Point, UniformData } from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./montecarlo_sample.frag?raw";
import { registerModulatorsFromState } from "../../helpers/modulators";

export type MontecarloSampleShaderState = ShaderState & {
  strength: number;
};

export type MontecarloSampleShaderSetting = {
  field: ShaderSetting["field"] | "strength" | "refresh";
  type: ShaderSetting["type"] | "float" | "modulator_only";
  onchange: (value: string) => void;
};

export class MontecarloSampleShader extends ShaderLayer {
  static SHADER_NAME: string = "montecarlo_sample_shader";
  declare state: MontecarloSampleShaderState;
  fragment: string = fragment;

  settings: MontecarloSampleShaderSetting[] = [
    {
      field: "strength",
      type: "float",
      onchange: (value) => {
        this.state.strength = parseFloat(value);
        this.uniforms.uniforms.uStrength = this.state.strength;
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

  constructor(
    state?: MontecarloSampleShaderState,
    includeModulators: boolean = false
  ) {
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
    return MontecarloSampleShader.SHADER_NAME;
  }

  defaultState(): MontecarloSampleShaderState {
    return { ...super.defaultState(), strength: 0.1 };
  }
  setupUniformValues(): { [key: string]: UniformData } {
    return {
      uStrength: { value: this.state.strength, type: "f32" },
      uSize: {
        value: new Point(window.innerWidth, window.innerHeight),
        type: "vec2<f32>",
      },
      uTime: { value: Math.random(), type: "f32" },
    };
  }
}
