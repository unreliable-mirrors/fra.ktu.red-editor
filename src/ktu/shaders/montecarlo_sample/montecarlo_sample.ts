import { Point, Ticker, UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./montecarlo_sample.frag?raw";

export type MontecarloSampleShaderState = ShaderState & {
  strength: number;
};

export type MontecarloSampleShaderSetting = {
  field: "strength";
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
  ];
  uniforms: UniformGroup;

  constructor(state?: MontecarloSampleShaderState) {
    super();

    if (state) {
      this.state = {
        ...this.state,
        strength: state.strength,
      };
    }
    this.uniforms = new UniformGroup({
      uStrength: { value: this.state.strength, type: "f32" },
      uSize: {
        value: new Point(window.innerWidth, window.innerHeight),
        type: "vec2<f32>",
      },
      uTime: { value: 1, type: "f32" },
    });
  }

  tick(time: Ticker): void {
    this.uniforms.uniforms.uTime =
      (this.uniforms.uniforms.uTime as number) + time.elapsedMS / 1000;
  }

  shaderName(): string {
    return MontecarloSampleShader.SHADER_NAME;
  }

  defaultState(): MontecarloSampleShaderState {
    return { ...super.defaultState(), strength: 1 };
  }
}
