import { UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./hines_shader.frag?raw";

export type HLinesShaderState = ShaderState & {
  size: number;
  lineThickness: number;
};

export type HLinesShaderSetting = {
  field: "size" | "lineThickness";
  type: "integer";
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
  ];
  uniforms: UniformGroup;

  constructor(state?: HLinesShaderState) {
    super();
    console.log("CONSTRUCTOR", state, this.state);
    if (state) {
      this.state = {
        ...this.state,
        size: state.size,
        lineThickness: state.lineThickness,
      };
    }
    this.uniforms = new UniformGroup({
      uGridSize: { value: this.state.size, type: "f32" },
      uLineThickness: { value: this.state.lineThickness, type: "f32" },
    });
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
}
