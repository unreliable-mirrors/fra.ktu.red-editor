import { Ticker, UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./hnoise_lines_shader.frag?raw";

export type HNoiseLinesShaderState = ShaderState & {
  noiseSize: number;
  strength: number;
  lineThickness: number;
  negative: boolean;
};

export type HNoiseLinesShaderSetting = {
  field: "strength" | "noiseSize" | "lineThickness" | "negative";
  type: "integer" | "float" | "boolean";
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
        this.state.negative = "true" == value;
        this.uniforms.uniforms.uNegative = this.state.negative ? 1 : 0;
      },
    },
  ];
  uniforms: UniformGroup;

  constructor(state?: HNoiseLinesShaderState) {
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
    }
    this.uniforms = new UniformGroup({
      uNoiseSize: { value: this.state.noiseSize, type: "f32" },
      uLineThickness: { value: this.state.lineThickness, type: "f32" },
      uStrength: { value: this.state.strength, type: "f32" },
      uNegative: { value: this.state.negative ? 1 : 0, type: "i32" },
      uTime: { value: Math.random(), type: "f32" },
    });
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

  tick(time: Ticker): void {
    if (
      true ||
      this.state.refreshChance === 1 ||
      Math.random() < this.state.refreshChance
    ) {
      if ((this.uniforms.uniforms.uTime as number) > 60) {
        (this.uniforms.uniforms.uTime as number) = 0;
      }
      this.uniforms.uniforms.uTime =
        (this.uniforms.uniforms.uTime as number) + time.elapsedMS / 1000;
    }
  }
}
