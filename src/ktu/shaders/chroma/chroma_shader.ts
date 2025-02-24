import { Color, Container, UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./chroma_shader.frag?raw";

export type ChromaShaderState = ShaderState & {
  color: string;
  threshold: number;
  not: boolean;
};

export type ChromaShaderSetting = {
  field: "color" | "threshold" | "not";
  type: "color" | "float" | "boolean";
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
    {
      field: "not",
      type: "boolean",
      onchange: (value) => {
        console.log("VALUE", value);
        this.state.not = "true" === value;
        this.uniforms.uniforms.uNot = this.state.not ? 1 : 0;
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
        not: state.not,
      };
    }
    this.uniforms = new UniformGroup({
      uR: { value: new Color(this.state.color).red, type: "f32" },
      uG: { value: new Color(this.state.color).green, type: "f32" },
      uB: { value: new Color(this.state.color).blue, type: "f32" },
      uThreshold: { value: this.state.threshold, type: "f32" },
      uNot: { value: this.state.not ? 1 : 0, type: "i32" },
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
      not: false,
    };
  }
}
