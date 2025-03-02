import { UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./light_split_shader.frag?raw";

export type LightSplitShaderState = ShaderState & {
  lightThreshold: number;
  power: number;
  darken: boolean;
  lighten: boolean;
  inverse: boolean;
};

export type LightSplitShaderSetting = {
  field: "lightThreshold" | "power" | "darken" | "lighten" | "inverse";
  type: "float" | "integer" | "boolean";
  onchange: (value: string) => void;
};

export class LightSplitShader extends ShaderLayer {
  static SHADER_NAME: string = "light_split_shader";
  declare state: LightSplitShaderState;
  fragment: string = fragment;
  settings: LightSplitShaderSetting[] = [
    {
      field: "lightThreshold",
      type: "float",
      onchange: (value) => {
        this.state.lightThreshold = parseFloat(value);
        this.uniforms.uniforms.uLightThreshold = this.state.lightThreshold;
      },
    },
    {
      field: "power",
      type: "integer",
      onchange: (value) => {
        this.state.power = parseInt(value);
        this.uniforms.uniforms.uPower = this.state.power;
      },
    },
    {
      field: "darken",
      type: "boolean",
      onchange: (value) => {
        this.state.darken = "true" === value;
        this.uniforms.uniforms.uDarken = this.state.darken ? 1 : 0;
      },
    },
    {
      field: "lighten",
      type: "boolean",
      onchange: (value) => {
        this.state.lighten = "true" === value;
        this.uniforms.uniforms.uLighten = this.state.lighten ? 1 : 0;
      },
    },
    {
      field: "inverse",
      type: "boolean",
      onchange: (value) => {
        this.state.inverse = "true" === value;
        this.uniforms.uniforms.uInverse = this.state.inverse ? 1 : 0;
      },
    },
  ];
  uniforms: UniformGroup;

  constructor(state?: LightSplitShaderState) {
    super();
    console.log("CONSTRUCTOR", state, this.state);
    if (state) {
      this.state = {
        ...this.state,
        lightThreshold: state.lightThreshold,
        power: state.power,
        darken: state.darken,
        lighten: state.lighten,
        inverse: state.inverse,
      };
    }
    this.uniforms = new UniformGroup({
      uLightThreshold: { value: this.state.lightThreshold, type: "f32" },
      uPower: { value: this.state.power, type: "f32" },
      uDarken: {
        value: this.state.darken ? 1 : 0,
        type: "f32",
      },
      uLighten: {
        value: this.state.lighten ? 1 : 0,
        type: "f32",
      },
      uInverse: {
        value: this.state.inverse ? 1 : 0,
        type: "f32",
      },
    });
  }

  shaderName(): string {
    return LightSplitShader.SHADER_NAME;
  }

  defaultState(): LightSplitShaderState {
    return {
      ...super.defaultState(),
      lightThreshold: 0.5,
      power: 2,
      darken: true,
      lighten: true,
      inverse: false,
    };
  }
}
