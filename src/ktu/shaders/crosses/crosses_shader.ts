import { UniformData } from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./crosses_shader.frag?raw";
import { registerModulatorsFromState } from "../../helpers/modulators";

export type CrossesShaderState = ShaderState & {
  gridSize: number;
  crossSize: number;
  lineThickness: number;
  variableCrossSize: boolean;
};

export type CrossesShaderSetting = {
  field:
    | ShaderSetting["field"]
    | "gridSize"
    | "crossSize"
    | "lineThickness"
    | "variableCrossSize";
  type: ShaderSetting["type"] | "integer" | "boolean";
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
    {
      field: "lineThickness",
      type: "integer",
      onchange: (value) => {
        this.state.lineThickness = parseInt(value);
        this.uniforms.uniforms.uLineThickness = this.state.lineThickness;
      },
    },
    {
      field: "variableCrossSize",
      type: "boolean",
      onchange: (value) => {
        this.state.variableCrossSize = "true" === value;
        this.uniforms.uniforms.uVariableCrossSize = this.state.variableCrossSize
          ? 1
          : 0;
      },
    },
    ...this.defaultSettings(),
  ];

  constructor(state?: CrossesShaderState, includeModulators: boolean = false) {
    super(state);
    console.log("CONSTRUCTOR", state, this.state);
    if (state) {
      this.state = {
        ...this.state,
        gridSize: state.gridSize,
        crossSize: state.crossSize,
        lineThickness: state.lineThickness,
        variableCrossSize: state.variableCrossSize,
      };
      if (includeModulators) {
        registerModulatorsFromState(this, state.modulators);
      }
    }
  }

  shaderName(): string {
    return CrossesShader.SHADER_NAME;
  }

  defaultState(): CrossesShaderState {
    return {
      ...super.defaultState(),
      gridSize: 15,
      crossSize: 9,
      lineThickness: 1,
      variableCrossSize: true,
    };
  }
  setupUniformValues(): { [key: string]: UniformData } {
    return {
      uGridSize: { value: this.state.gridSize, type: "f32" },
      uCrossSize: { value: this.state.crossSize / 2, type: "f32" },
      uLineThickness: { value: this.state.lineThickness, type: "f32" },
      uVariableCrossSize: {
        value: this.state.variableCrossSize ? 1 : 0,
        type: "f32",
      },
    };
  }
}
