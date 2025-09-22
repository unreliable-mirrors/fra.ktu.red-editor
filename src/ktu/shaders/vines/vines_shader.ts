import { UniformData } from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./vines_shader.frag?raw";
import { registerModulatorsFromState } from "../../helpers/modulators";

export type VLinesShaderState = ShaderState & {
  size: number;
  lineThickness: number;
};

export type VLinesShaderSetting = {
  field: ShaderSetting["field"] | "size" | "lineThickness";
  type: ShaderSetting["type"] | "integer";
  onchange: (value: string) => void;
};

export class VLinesShader extends ShaderLayer {
  static SHADER_NAME: string = "vlines_shader";
  declare state: VLinesShaderState;
  fragment: string = fragment;
  settings: VLinesShaderSetting[] = [
    {
      field: "size",
      type: "integer",
      onchange: (value) => {
        this.state.size = parseInt(value);
        this.uniforms.uniforms.uGridSize = this.state.size;
      },
    },
    {
      field: "lineThickness",
      type: "integer",
      onchange: (value) => {
        this.state.lineThickness = parseInt(value);
        this.uniforms.uniforms.uLineThickness = this.state.lineThickness;
      },
    },
    ...this.defaultSettings(),
  ];

  constructor(state?: VLinesShaderState, includeModulators: boolean = false) {
    super(state);
    console.log("CONSTRUCTOR", state, this.state);
    if (state) {
      this.state = {
        ...this.state,
        size: state.size,
        lineThickness: state.lineThickness,
      };
      if (includeModulators) {
        registerModulatorsFromState(this, state.modulators);
      }
    }
  }

  shaderName(): string {
    return VLinesShader.SHADER_NAME;
  }

  defaultState(): VLinesShaderState {
    return {
      ...super.defaultState(),
      size: 15,
      lineThickness: 1,
    };
  }
  setupUniformValues(): { [key: string]: UniformData } {
    return {
      uGridSize: { value: this.state.size, type: "f32" },
      uLineThickness: { value: this.state.lineThickness, type: "f32" },
    };
  }
}
