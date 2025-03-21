import { UniformData } from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./hines_shader.frag?raw";

export type HLinesShaderState = ShaderState & {
  size: number;
  lineThickness: number;
};

export type HLinesShaderSetting = {
  field: ShaderSetting["field"] | "size" | "lineThickness";
  type: ShaderSetting["type"] | "integer";
  onchange: (value: string) => void;
};

export class HLinesShader extends ShaderLayer {
  static SHADER_NAME: string = "hlines_shader";
  declare state: HLinesShaderState;
  fragment: string = fragment;
  settings: HLinesShaderSetting[] = [
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

  constructor(state?: HLinesShaderState) {
    super(state);
    console.log("CONSTRUCTOR", state, this.state);
    if (state) {
      this.state = {
        ...this.state,
        size: state.size,
        lineThickness: state.lineThickness,
      };
    }
  }

  shaderName(): string {
    return HLinesShader.SHADER_NAME;
  }

  defaultState(): HLinesShaderState {
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
