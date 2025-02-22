import { UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./crosses_shader.frag?raw";

export type CrossesShaderState = ShaderState & {
  gridSize: number;
  crossSize: number;
};

export type CrossesShaderSetting = {
  field: "gridSize" | "crossSize";
  type: "integer";
  onchange: (value: string) => void;
};

export class CrossesShader extends ShaderLayer {
  static SHADER_NAME: string = "crosses_shader";
  declare state: CrossesShaderState;
  fragment: string = fragment;
  settings: CrossesShaderSetting[] = [
    {
      field: "gridSize",
      type: "integer",
      onchange: (value) => {
        this.state.gridSize = parseInt(value);
        this.uniforms.uniforms.uGridSize = this.state.gridSize;
      },
    },
    {
      field: "crossSize",
      type: "integer",
      onchange: (value) => {
        this.state.crossSize = parseInt(value);
        this.uniforms.uniforms.uCrossSize = this.state.crossSize / 2;
      },
    },
  ];
  uniforms: UniformGroup;

  constructor(state?: CrossesShaderState) {
    super();
    console.log("CONSTRUCTOR", state, this.state);
    if (state) {
      this.state = {
        ...this.state,
        gridSize: state.gridSize,
        missProbability: state.missProbability,
        seed: state.seed,
      };
    }
    this.uniforms = new UniformGroup({
      uGridSize: { value: this.state.gridSize, type: "f32" },
      uCrossSize: { value: this.state.crossSize / 2, type: "f32" },
    });
  }

  shaderName(): string {
    return CrossesShader.SHADER_NAME;
  }

  defaultState(): CrossesShaderState {
    return {
      ...super.defaultState(),
      gridSize: 15,
      crossSize: 9,
    };
  }
}
