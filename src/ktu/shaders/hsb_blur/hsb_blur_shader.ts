import { UniformData } from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./hsb_blur_shader.frag?raw";
import { registerModulatorsFromState } from "../../helpers/modulators";

export type HsbBlurShaderState = ShaderState & {
  hueRadius: number;
  saturationRadius: number;
  lightnessRadius: number;
  ignoreAlpha: boolean;
};

export type HsbBlurShaderSetting = {
  field:
    | ShaderSetting["field"]
    | "hueRadius"
    | "saturationRadius"
    | "lightnessRadius"
    | "ignoreAlpha";
  type: ShaderSetting["type"] | "integer" | "boolean";
  onchange: (value: string) => void;
};

export class HsbBlurShader extends ShaderLayer {
  static SHADER_NAME: string = "hsb_blur_shader";
  declare state: HsbBlurShaderState;
  fragment: string = fragment;

  settings: HsbBlurShaderSetting[] = [
    {
      field: "hueRadius",
      type: "integer",
      onchange: (value) => {
        this.state.hueRadius = parseInt(value);
        this.uniforms.uniforms.uHueRadius = this.state.hueRadius;
      },
    },
    {
      field: "saturationRadius",
      type: "integer",
      onchange: (value) => {
        this.state.saturationRadius = parseInt(value);
        this.uniforms.uniforms.uSaturationRadius = this.state.saturationRadius;
      },
    },
    {
      field: "lightnessRadius",
      type: "integer",
      onchange: (value) => {
        this.state.lightnessRadius = parseInt(value);
        this.uniforms.uniforms.uLightnessRadius = this.state.lightnessRadius;
      },
    },
    {
      field: "ignoreAlpha",
      type: "boolean",
      onchange: (value) => {
        this.state.ignoreAlpha = value === "true";
        this.uniforms.uniforms.uIgnoreAlpha = this.state.ignoreAlpha ? 1 : 0;
      },
    },
    ...this.defaultSettings(),
  ];

  constructor(state?: HsbBlurShaderState, includeModulators: boolean = false) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        hueRadius: state.hueRadius,
        saturationRadius: state.saturationRadius,
        lightnessRadius: state.lightnessRadius,
        ignoreAlpha: state.ignoreAlpha,
      };
      if (includeModulators) {
        registerModulatorsFromState(this, state.modulators);
      }
    }
  }

  shaderName(): string {
    return HsbBlurShader.SHADER_NAME;
  }

  defaultState(): HsbBlurShaderState {
    return {
      ...super.defaultState(),
      hueRadius: 10,
      saturationRadius: 10,
      lightnessRadius: 10,
      ignoreAlpha: false,
    };
  }

  setupUniformValues(): { [key: string]: UniformData } {
    return {
      uHueRadius: { value: this.state.hueRadius, type: "f32" },
      uSaturationRadius: { value: this.state.saturationRadius, type: "f32" },
      uLightnessRadius: { value: this.state.lightnessRadius, type: "f32" },
      uIgnoreAlpha: { value: this.state.ignoreAlpha ? 1 : 0, type: "i32" },
    };
  }
}
