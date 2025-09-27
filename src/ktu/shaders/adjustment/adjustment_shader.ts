import { UniformData } from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./adjustment_shader.frag?raw";
import { registerModulatorsFromState } from "../../helpers/modulators";

export type AdjustmentShaderState = ShaderState & {
  gamma: number;
  saturation: number;
  contrast: number;
  brightness: number;
  red: number;
  green: number;
  blue: number;
  alpha: number;
};

export type AdjustmentShaderSetting = {
  field:
    | ShaderSetting["field"]
    | "gamma"
    | "saturation"
    | "contrast"
    | "brightness"
    | "red"
    | "green"
    | "blue"
    | "alpha";
  type: ShaderSetting["type"] | "bigfloat" | "float";
  onchange: (value: string) => void;
};

export class AdjustmentShader extends ShaderLayer {
  static SHADER_NAME: string = "adjustment_shader";
  declare state: AdjustmentShaderState;
  fragment: string = fragment;

  settings: AdjustmentShaderSetting[] = [
    {
      field: "gamma",
      type: "bigfloat",
      onchange: (value) => {
        this.state.gamma = parseFloat(value);
        this.uniforms.uniforms.uGamma = this.state.gamma;
      },
    },
    {
      field: "saturation",
      type: "bigfloat",
      onchange: (value) => {
        this.state.saturation = parseFloat(value);
        this.uniforms.uniforms.uSaturation = this.state.saturation;
      },
    },
    {
      field: "contrast",
      type: "bigfloat",
      onchange: (value) => {
        this.state.contrast = parseFloat(value);
        this.uniforms.uniforms.uContrast = this.state.contrast;
      },
    },
    {
      field: "brightness",
      type: "bigfloat",
      onchange: (value) => {
        this.state.brightness = parseFloat(value);
        this.uniforms.uniforms.uBrightness = this.state.brightness;
      },
    },
    {
      field: "red",
      type: "bigfloat",
      onchange: (value) => {
        this.state.red = parseFloat(value);
        this.uniforms.uniforms.uColor = [
          this.state.red,
          this.state.green,
          this.state.blue,
          this.state.alpha,
        ];
      },
    },
    {
      field: "green",
      type: "bigfloat",
      onchange: (value) => {
        this.state.green = parseFloat(value);
        this.uniforms.uniforms.uColor = [
          this.state.red,
          this.state.green,
          this.state.blue,
          this.state.alpha,
        ];
      },
    },
    {
      field: "blue",
      type: "bigfloat",
      onchange: (value) => {
        this.state.blue = parseFloat(value);
        this.uniforms.uniforms.uColor = [
          this.state.red,
          this.state.green,
          this.state.blue,
          this.state.alpha,
        ];
      },
    },
    {
      field: "alpha",
      type: "float",
      onchange: (value) => {
        this.state.alpha = parseFloat(value);
        this.uniforms.uniforms.uColor = [
          this.state.red,
          this.state.green,
          this.state.blue,
          this.state.alpha,
        ];
      },
    },
    ...this.defaultSettings(),
  ];

  constructor(
    state?: AdjustmentShaderState,
    includeModulators: boolean = false
  ) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        gamma: state.gamma,
        saturation: state.saturation,
        contrast: state.contrast,
        brightness: state.brightness,
        red: state.red,
        green: state.green,
        blue: state.blue,
        alpha: state.alpha,
      };
      if (includeModulators) {
        registerModulatorsFromState(this, state.modulators);
      }
    }
  }

  shaderName(): string {
    return AdjustmentShader.SHADER_NAME;
  }

  defaultState(): AdjustmentShaderState {
    return {
      ...super.defaultState(),
      gamma: 1,
      saturation: 1,
      contrast: 1,
      brightness: 1,
      red: 1,
      green: 1,
      blue: 1,
      alpha: 1,
    };
  }

  setupUniformValues(): { [key: string]: UniformData } {
    return {
      uGamma: { value: this.state.gamma, type: "f32" },
      uSaturation: { value: this.state.saturation, type: "f32" },
      uContrast: { value: this.state.contrast, type: "f32" },
      uBrightness: { value: this.state.brightness, type: "f32" },
      uColor: {
        value: [
          this.state.red,
          this.state.green,
          this.state.blue,
          this.state.alpha,
        ],
        type: "vec4<f32>",
      },
    };
  }
}
