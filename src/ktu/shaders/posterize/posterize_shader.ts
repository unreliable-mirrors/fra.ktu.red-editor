import { UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./posterize_shader.frag?raw";

export type PosterizeShaderState = ShaderState & {
  threshold: number;
};

export type PosterizeShaderSetting = {
  field: "threshold";
  type: "float";
  onchange: (value: string) => void;
};

export class PosterizeShader extends ShaderLayer {
  static SHADER_NAME: string = "posterize_shader";
  declare state: PosterizeShaderState;
  fragment: string = fragment;

  settings: PosterizeShaderSetting[] = [
    {
      field: "threshold",
      type: "float",
      onchange: (value) => {
        this.state.threshold = parseFloat(value);
        this.uniforms.uniforms.uThreshold = this.state.threshold;
      },
    },
  ];
  uniforms: UniformGroup;

  constructor(state?: PosterizeShaderState) {
    super();

    if (state) {
      this.state = {
        ...this.state,
        threshold: state.threshold,
      };
    }
    this.uniforms = new UniformGroup({
      uThreshold: { value: this.state.threshold, type: "f32" },
    });
  }

  shaderName(): string {
    return PosterizeShader.SHADER_NAME;
  }

  defaultState(): PosterizeShaderState {
    return { ...super.defaultState(), threshold: 0.3 };
  }
}
