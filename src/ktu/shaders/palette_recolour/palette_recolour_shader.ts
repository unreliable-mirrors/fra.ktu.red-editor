import { Color, UniformData } from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./palette_recolour_shader.frag?raw";
import { registerModulatorsFromState } from "../../helpers/modulators";

export type PaletteRecolourShaderState = ShaderState & {
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  color5: string;
  onlyHue: boolean;
  onlySaturation: boolean;
  onlyLightness: boolean;
};

export type PaletteRecolourShaderSetting = {
  field:
    | ShaderSetting["field"]
    | "color1"
    | "color2"
    | "color3"
    | "color4"
    | "color5"
    | "onlyHue"
    | "onlySaturation"
    | "onlyLightness";
  type: ShaderSetting["type"] | "color" | "boolean";
  onchange: (value: string) => void;
};

export class PaletteRecolourShader extends ShaderLayer {
  static SHADER_NAME: string = "palette_recolour_shader";
  declare state: PaletteRecolourShaderState;
  fragment: string = fragment;
  settings: PaletteRecolourShaderSetting[] = [
    {
      field: "color1",
      type: "color",
      onchange: (value) => {
        this.state.color1 = value;

        this.uniforms.uniforms.uColor1R = new Color(this.state.color1).red;
        this.uniforms.uniforms.uColor1G = new Color(this.state.color1).green;
        this.uniforms.uniforms.uColor1B = new Color(this.state.color1).blue;
      },
    },
    {
      field: "color2",
      type: "color",
      onchange: (value) => {
        this.state.color2 = value;

        this.uniforms.uniforms.uColor2R = new Color(this.state.color2).red;
        this.uniforms.uniforms.uColor2G = new Color(this.state.color2).green;
        this.uniforms.uniforms.uColor2B = new Color(this.state.color2).blue;
      },
    },
    {
      field: "color3",
      type: "color",
      onchange: (value) => {
        this.state.color3 = value;

        this.uniforms.uniforms.uColor3R = new Color(this.state.color3).red;
        this.uniforms.uniforms.uColor3G = new Color(this.state.color3).green;
        this.uniforms.uniforms.uColor3B = new Color(this.state.color3).blue;
      },
    },
    {
      field: "color4",
      type: "color",
      onchange: (value) => {
        this.state.color4 = value;

        this.uniforms.uniforms.uColor4R = new Color(this.state.color4).red;
        this.uniforms.uniforms.uColor4G = new Color(this.state.color4).green;
        this.uniforms.uniforms.uColor4B = new Color(this.state.color4).blue;
      },
    },
    {
      field: "color5",
      type: "color",
      onchange: (value) => {
        this.state.color5 = value;

        this.uniforms.uniforms.uColor5R = new Color(this.state.color5).red;
        this.uniforms.uniforms.uColor5G = new Color(this.state.color5).green;
        this.uniforms.uniforms.uColor5B = new Color(this.state.color5).blue;
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

  constructor(
    state?: PaletteRecolourShaderState,
    includeModulators: boolean = false
  ) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        color1: state.color1,
        color2: state.color2,
        color3: state.color3,
        color4: state.color4,
        color5: state.color5,
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
    return PaletteRecolourShader.SHADER_NAME;
  }

  defaultState(): PaletteRecolourShaderState {
    return {
      ...super.defaultState(),
      color1: "#000000",
      color2: "#000000",
      color3: "#000000",
      color4: "#000000",
      color5: "#000000",
      onlyHue: false,
      onlySaturation: false,
      onlyLightness: false,
    };
  }
  setupUniformValues(): { [key: string]: UniformData } {
    return {
      uColor1R: { value: new Color(this.state.color1).red, type: "f32" },
      uColor1G: { value: new Color(this.state.color1).green, type: "f32" },
      uColor1B: { value: new Color(this.state.color1).blue, type: "f32" },
      uColor2R: { value: new Color(this.state.color2).red, type: "f32" },
      uColor2G: { value: new Color(this.state.color2).green, type: "f32" },
      uColor2B: { value: new Color(this.state.color2).blue, type: "f32" },
      uColor3R: { value: new Color(this.state.color3).red, type: "f32" },
      uColor3G: { value: new Color(this.state.color3).green, type: "f32" },
      uColor3B: { value: new Color(this.state.color3).blue, type: "f32" },
      uColor4R: { value: new Color(this.state.color4).red, type: "f32" },
      uColor4G: { value: new Color(this.state.color4).green, type: "f32" },
      uColor4B: { value: new Color(this.state.color4).blue, type: "f32" },
      uColor5R: { value: new Color(this.state.color5).red, type: "f32" },
      uColor5G: { value: new Color(this.state.color5).green, type: "f32" },
      uColor5B: { value: new Color(this.state.color5).blue, type: "f32" },
      uOnlyHue: { value: this.state.onlyHue ? 1 : 0, type: "i32" },
      uOnlySaturation: {
        value: this.state.onlySaturation ? 1 : 0,
        type: "i32",
      },
      uOnlyLightness: { value: this.state.onlyLightness ? 1 : 0, type: "i32" },
    };
  }
}
