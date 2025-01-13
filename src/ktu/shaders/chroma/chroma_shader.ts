import { Color, Container, UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./chroma_shader.frag?raw";

export type ChromaShaderState = ShaderState & {
  color: string;
  threshold: number;
};

export type ChromaShaderSetting = {
  field: "color" | "threshold";
  type: "color" | "float";
  onchange: (value: string) => void;
};

export class ChromaShader extends ShaderLayer {
  static SHADER_NAME: string = "chroma_shader";
  declare state: ChromaShaderState;
  fragment: string = fragment;
  container!: Container;
  settings: ChromaShaderSetting[] = [
    {
      field: "color",
      type: "color",
      onchange: (value) => {
        this.state.color = value;

        this.uniforms.uniforms.uR = new Color(this.state.color).red;
        this.uniforms.uniforms.uG = new Color(this.state.color).green;
        this.uniforms.uniforms.uB = new Color(this.state.color).blue;
        console.log(this.uniforms.uniforms.uR);
      },
    },
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

  constructor(state?: ChromaShaderState) {
    super();

    if (state) {
      this.state = {
        ...this.state,
        color: state.color,
        threshold: state.threshold,
      };
    }
    this.uniforms = new UniformGroup({
      uR: { value: new Color(this.state.color).red, type: "f32" },
      uG: { value: new Color(this.state.color).green, type: "f32" },
      uB: { value: new Color(this.state.color).blue, type: "f32" },
      uThreshold: { value: this.state.threshold, type: "f32" },
    });
  }

  shaderName(): string {
    return ChromaShader.SHADER_NAME;
  }

  defaultState(): ChromaShaderState {
    return {
      ...super.defaultState(),
      color: "#000000",
      threshold: 0.1,
    };
  }
}
