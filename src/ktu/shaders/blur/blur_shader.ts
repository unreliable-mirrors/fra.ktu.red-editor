import { UniformData } from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./blur_shader.frag?raw";

export type BlurShaderState = ShaderState & {
  redRadius: number;
  greenRadius: number;
  blueRadius: number;
  ignoreAlpha: boolean;
};

export type BlurShaderSetting = {
  field:
    | ShaderSetting["field"]
    | "redRadius"
    | "greenRadius"
    | "blueRadius"
    | "ignoreAlpha";
  type: ShaderSetting["type"] | "integer" | "boolean";
  onchange: (value: string) => void;
};

export class BlurShader extends ShaderLayer {
  static SHADER_NAME: string = "blur_shader";
  declare state: BlurShaderState;
  fragment: string = fragment;

  settings: BlurShaderSetting[] = [
    {
      field: "redRadius",
      type: "integer",
      onchange: (value) => {
        this.state.redRadius = parseInt(value);
        this.uniforms.uniforms.uRedRadius = this.state.redRadius;
      },
    },
    {
      field: "greenRadius",
      type: "integer",
      onchange: (value) => {
        this.state.greenRadius = parseInt(value);
        this.uniforms.uniforms.uGreenRadius = this.state.greenRadius;
      },
    },
    {
      field: "blueRadius",
      type: "integer",
      onchange: (value) => {
        this.state.blueRadius = parseInt(value);
        this.uniforms.uniforms.uBlueRadius = this.state.blueRadius;
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

  constructor(state?: BlurShaderState) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        redRadius: state.redRadius,
        greenRadius: state.greenRadius,
        blueRadius: state.blueRadius,
        ignoreAlpha: state.ignoreAlpha,
      };
    }
  }

  shaderName(): string {
    return BlurShader.SHADER_NAME;
  }

  defaultState(): BlurShaderState {
    return {
      ...super.defaultState(),
      redRadius: 10,
      greenRadius: 10,
      blueRadius: 10,
      ignoreAlpha: false,
    };
  }

  setupUniformValues(): { [key: string]: UniformData } {
    return {
      uRedRadius: { value: this.state.redRadius, type: "f32" },
      uGreenRadius: { value: this.state.greenRadius, type: "f32" },
      uBlueRadius: { value: this.state.blueRadius, type: "f32" },
      uIgnoreAlpha: { value: this.state.ignoreAlpha ? 1 : 0, type: "i32" },
    };
  }
}
