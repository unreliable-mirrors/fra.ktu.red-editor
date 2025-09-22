import { UniformData } from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./hnoise_lines_shader.frag?raw";
import { registerModulatorsFromState } from "../../helpers/modulators";

export type HNoiseLinesShaderState = ShaderState & {
  noiseSize: number;
  strength: number;
  lineThickness: number;
  negative: boolean;
};

export type HNoiseLinesShaderSetting = {
  field:
    | ShaderSetting["field"]
    | "strength"
    | "noiseSize"
    | "lineThickness"
    | "negative"
    | "refresh";
  type:
    | ShaderSetting["type"]
    | "integer"
    | "float"
    | "boolean"
    | "modulator_only";
  onchange: (value: string) => void;
};

export class HNoiseLinesShader extends ShaderLayer {
  static SHADER_NAME: string = "hnoise_lines_shader";
  declare state: HNoiseLinesShaderState;
  fragment: string = fragment;
  settings: HNoiseLinesShaderSetting[] = [
    {
      field: "noiseSize",
      type: "integer",
      onchange: (value) => {
        this.state.noiseSize = parseInt(value);
        this.uniforms.uniforms.uNoiseSize = this.state.noiseSize;
      },
    },
    {
      field: "lineThickness",
      type: "integer",
      onchange: (value) => {
        this.state.lineThickness = parseInt(value);
        this.uniforms.uniforms.uLineThickness = this.state.lineThickness;
      },
    },
    {
      field: "strength",
      type: "float",
      onchange: (value) => {
        this.state.strength = parseFloat(value);
        this.uniforms.uniforms.uStrength = this.state.strength;
      },
    },
    {
      field: "negative",
      type: "boolean",
      onchange: (value) => {
        this.state.negative = "true" === value || parseFloat(value) >= 1;
        this.uniforms.uniforms.uNegative = this.state.negative ? 1 : 0;
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
    state?: HNoiseLinesShaderState,
    includeModulators: boolean = false
  ) {
    super(state);
    console.log("CONSTRUCTOR", state, this.state);
    if (state) {
      this.state = {
        ...this.state,
        noiseSize: state.noiseSize,
        strength: state.strength,
        negative: state.negative,
        lineThickness: state.lineThickness,
      };
      if (includeModulators) {
        registerModulatorsFromState(this, state.modulators);
      }
    }
  }

  shaderName(): string {
    return HNoiseLinesShader.SHADER_NAME;
  }

  defaultState(): HNoiseLinesShaderState {
    return {
      ...super.defaultState(),
      noiseSize: 50,
      strength: 0.1,
      lineThickness: 1,
      negative: false,
    };
  }

  setupUniformValues(): { [key: string]: UniformData } {
    return {
      uNoiseSize: { value: this.state.noiseSize, type: "f32" },
      uLineThickness: { value: this.state.lineThickness, type: "f32" },
      uStrength: { value: this.state.strength, type: "f32" },
      uNegative: { value: this.state.negative ? 1 : 0, type: "i32" },
      uTime: { value: Math.random(), type: "f32" },
    };
  }
}
