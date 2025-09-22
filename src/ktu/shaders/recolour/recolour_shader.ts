import { Color, Container, UniformData } from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./recolour_shader.frag?raw";
import { registerModulatorsFromState } from "../../helpers/modulators";

export type RecolourShaderState = ShaderState & {
  fromColor: string;
  toColor: string;
  threshold: number;
  onlyHue: boolean;
  onlySaturation: boolean;
  onlyLightness: boolean;
};

export type RecolourShaderSetting = {
  field:
    | ShaderSetting["field"]
    | "fromColor"
    | "toColor"
    | "threshold"
    | "onlyHue"
    | "onlySaturation"
    | "onlyLightness";
  type: ShaderSetting["type"] | "color" | "float" | "boolean";
  onchange: (value: string) => void;
};

export class RecolourShader extends ShaderLayer {
  static SHADER_NAME: string = "recolour_shader";
  declare state: RecolourShaderState;
  fragment: string = fragment;
  container!: Container;
  settings: RecolourShaderSetting[] = [
    {
      field: "fromColor",
      type: "color",
      onchange: (value) => {
        this.state.fromColor = value;

        this.uniforms.uniforms.uFromR = new Color(this.state.fromColor).red;
        this.uniforms.uniforms.uFromG = new Color(this.state.fromColor).green;
        this.uniforms.uniforms.uFromB = new Color(this.state.fromColor).blue;
      },
    },
    {
      field: "toColor",
      type: "color",
      onchange: (value) => {
        this.state.toColor = value;

        this.uniforms.uniforms.uToR = new Color(this.state.toColor).red;
        this.uniforms.uniforms.uToG = new Color(this.state.toColor).green;
        this.uniforms.uniforms.uToB = new Color(this.state.toColor).blue;
      },
    },
    {
      field: "threshold",
      type: "float",
      onchange: (value) => {
        this.state.threshold = parseFloat(value);
        this.uniforms.uniforms.uThreshold = this.state.threshold;
      },
    },
    {
      field: "onlyHue",
      type: "boolean",
      onchange: (value) => {
        this.state.onlyHue = "true" === value || parseFloat(value) >= 1;
        this.uniforms.uniforms.uOnlyHue = this.state.onlyHue ? 1 : 0;
      },
    },
    {
      field: "onlySaturation",
      type: "boolean",
      onchange: (value) => {
        this.state.onlySaturation = "true" === value || parseFloat(value) >= 1;
        this.uniforms.uniforms.uOnlySaturation = this.state.onlySaturation
          ? 1
          : 0;
      },
    },
    {
      field: "onlyLightness",
      type: "boolean",
      onchange: (value) => {
        this.state.onlyLightness = "true" === value || parseFloat(value) >= 1;
        this.uniforms.uniforms.uOnlyLightness = this.state.onlyLightness
          ? 1
          : 0;
      },
    },
    ...this.defaultSettings(),
  ];

  constructor(state?: RecolourShaderState, includeModulators: boolean = false) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        fromColor: state.fromColor,
        toColor: state.toColor,
        threshold: state.threshold,
        onlyHue: state.onlyHue,
        onlySaturation: state.onlySaturation,
        onlyLightness: state.onlyLightness,
      };
      if (includeModulators) {
        registerModulatorsFromState(this, state.modulators);
      }
    }
  }

  shaderName(): string {
    return RecolourShader.SHADER_NAME;
  }

  defaultState(): RecolourShaderState {
    return {
      ...super.defaultState(),
      fromColor: "#000000",
      toColor: "#FF0000",
      threshold: 0.1,
      onlyHue: false,
      onlySaturation: false,
      onlyLightness: false,
    };
  }
  setupUniformValues(): { [key: string]: UniformData } {
    return {
      uFromR: { value: new Color(this.state.fromColor).red, type: "f32" },
      uFromG: { value: new Color(this.state.fromColor).green, type: "f32" },
      uFromB: { value: new Color(this.state.fromColor).blue, type: "f32" },
      uToR: { value: new Color(this.state.toColor).red, type: "f32" },
      uToG: { value: new Color(this.state.toColor).green, type: "f32" },
      uToB: { value: new Color(this.state.toColor).blue, type: "f32" },
      uThreshold: { value: this.state.threshold, type: "f32" },
      uOnlyHue: { value: this.state.onlyHue ? 1 : 0, type: "i32" },
      uOnlySaturation: {
        value: this.state.onlySaturation ? 1 : 0,
        type: "i32",
      },
      uOnlyLightness: { value: this.state.onlyLightness ? 1 : 0, type: "i32" },
    };
  }
}
