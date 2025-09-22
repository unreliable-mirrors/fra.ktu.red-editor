import { UniformData } from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./pixelate_shader.frag?raw";
import { registerModulatorsFromState } from "../../helpers/modulators";

export type PixelateShaderState = ShaderState & {
  pixelSize: number;
  strength: number;
  onlyPixels: boolean;
};

export type PixelateShaderSetting = {
  field:
    | ShaderSetting["field"]
    | "pixelSize"
    | "strength"
    | "onlyPixels"
    | "refresh";
  type:
    | ShaderSetting["type"]
    | "integer"
    | "float"
    | "boolean"
    | "modulator_only";
  onchange: (value: string) => void;
};

export class PixelateShader extends ShaderLayer {
  static SHADER_NAME: string = "pixelate_shader";
  declare state: PixelateShaderState;
  fragment: string = fragment;
  settings: PixelateShaderSetting[] = [
    {
      field: "pixelSize",
      type: "integer",
      onchange: (value) => {
        this.state.pixelSize = parseInt(value);
        this.uniforms.uniforms.uPixelSize = this.state.pixelSize;
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
      field: "onlyPixels",
      type: "boolean",
      onchange: (value) => {
        this.state.onlyPixels = "true" === value || parseFloat(value) >= 1;
        this.uniforms.uniforms.uOnlyPixels = this.state.onlyPixels ? 1 : 0;
      },
    },
    {
      field: "refresh",
      type: "modulator_only",
      onchange: (value) => {
        if (parseFloat(value) >= 1) {
          this.uniforms.uniforms.uTime = Math.random() * 60;
        }
      },
    },
    ...this.defaultSettings(),
  ];

  constructor(state?: PixelateShaderState, includeModulators: boolean = false) {
    super(state);
    if (state) {
      this.state = {
        ...this.state,
        pixelSize: state.pixelSize,
        strength: state.strength,
        onlyPixels: state.onlyPixels,
      };
      if (includeModulators) {
        registerModulatorsFromState(this, state.modulators);
      }
    }
  }

  shaderName(): string {
    return PixelateShader.SHADER_NAME;
  }

  defaultState(): PixelateShaderState {
    return {
      ...super.defaultState(),
      pixelSize: 15,
      strength: 1,
      onlyPixels: false,
    };
  }

  setupUniformValues(): { [key: string]: UniformData } {
    return {
      uPixelSize: { value: this.state.pixelSize, type: "f32" },
      uStrength: { value: this.state.strength, type: "f32" },
      uOnlyPixels: { value: this.state.onlyPixels ? 1 : 0, type: "i32" },
      uTime: { value: Math.random(), type: "f32" },
    };
  }
}
