import { UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./vines_shader.frag?raw";

export type VLinesShaderState = ShaderState & {
  size: number;
  lineThickness: number;
};

export type VLinesShaderSetting = {
  field: "size" | "lineThickness";
  type: "integer";
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
  ];
  uniforms: UniformGroup;

  constructor(state?: VLinesShaderState) {
    super();
    console.log("CONSTRUCTOR", state, this.state);
    if (state) {
      this.state = {
        ...this.state,
        size: state.size,
        missProbability: state.missProbability,
        seed: state.seed,
      };
    }
    this.uniforms = new UniformGroup({
      uGridSize: { value: this.state.size, type: "f32" },
      uLineThickness: { value: this.state.lineThickness, type: "f32" },
    });
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
}
