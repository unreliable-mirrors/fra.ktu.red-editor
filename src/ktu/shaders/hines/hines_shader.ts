import { UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./hines_shader.frag?raw";

export type HLinesShaderState = ShaderState & {
  size: number;
};

export type HLinesShaderSetting = {
  field: "size";
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
  ];
  uniforms: UniformGroup;

  constructor(state?: HLinesShaderState) {
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
    });
  }

  shaderName(): string {
    return HLinesShader.SHADER_NAME;
  }

  defaultState(): HLinesShaderState {
    return {
      ...super.defaultState(),
      size: 15,
    };
  }
}
