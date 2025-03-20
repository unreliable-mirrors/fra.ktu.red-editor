import { Point, Ticker, UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./montecarlo_sample.frag?raw";

export type MontecarloSampleShaderState = ShaderState & {
  strength: number;
  refreshChance: number;
};

export type MontecarloSampleShaderSetting = {
  field: "strength" | "refreshChance";
  type: "float";
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
      field: "refreshChance",
      type: "float",
      onchange: (value) => {
        this.state.refreshChance = parseFloat(value);
      },
    },
  ];
  uniforms: UniformGroup;

  constructor(state?: MontecarloSampleShaderState) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        strength: state.strength,
        refreshChance: state.refreshChance,
      };
    }
    this.uniforms = new UniformGroup({
      uStrength: { value: this.state.strength, type: "f32" },
      uSize: {
        value: new Point(window.innerWidth, window.innerHeight),
        type: "vec2<f32>",
      },
      uTime: { value: Math.random(), type: "f32" },
    });
  }

  tick(time: Ticker): void {
    if (
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

  shaderName(): string {
    return MontecarloSampleShader.SHADER_NAME;
  }

  defaultState(): MontecarloSampleShaderState {
    return { ...super.defaultState(), strength: 0.1, refreshChance: 1 };
  }
}
