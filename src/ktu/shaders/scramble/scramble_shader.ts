import { Container, Ticker, UniformData } from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./scramble_shader.frag?raw";
import { registerModulatorsFromState } from "../../helpers/modulators";

export type ScrambleShaderState = ShaderState & {
  range: number;
  refreshChance: number;
};

export type ScrambleShaderSetting = {
  field: ShaderSetting["field"] | "range" | "refreshChance";
  type: ShaderSetting["type"] | "integer" | "float";
  onchange: (value: string) => void;
};

export class ScrambleShader extends ShaderLayer {
  static SHADER_NAME: string = "scramble_shader";
  declare state: ScrambleShaderState;
  fragment: string = fragment;
  container!: Container;
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
      field: "refreshChance",
      type: "float",
      onchange: (value) => {
        this.state.refreshChance = parseFloat(value);
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
        refreshChance: state.refreshChance,
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
      refreshChance: 1,
    };
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
  setupUniformValues(): { [key: string]: UniformData } {
    return {
      uRange: { value: this.state.range, type: "f32" },
      uTime: { value: Math.random(), type: "f32" },
    };
  }
}
