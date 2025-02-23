import { Color, Container, UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./recolour_shader.frag?raw";

export type RecolourShaderState = ShaderState & {
  fromColor: string;
  toColor: string;
  threshold: number;
};

export type RecolourShaderSetting = {
  field: "fromColor" | "toColor" | "threshold";
  type: "color" | "float";
  onchange: (value: string) => void;
};

export class RecolourShader extends ShaderLayer {
  static SHADER_NAME: string = "recolour_shader";
  declare state: RecolourShaderState;
  fragment: string = fragment;
  container!: Container;
  settings: RecolourShaderSetting[] = [
    {
      field: "fromColor",
      type: "color",
      onchange: (value) => {
        this.state.fromColor = value;

        this.uniforms.uniforms.uFromR = new Color(this.state.fromColor).red;
        this.uniforms.uniforms.uFromG = new Color(this.state.fromColor).green;
        this.uniforms.uniforms.uFromB = new Color(this.state.fromColor).blue;
      },
    },
    {
      field: "toColor",
      type: "color",
      onchange: (value) => {
        this.state.toColor = value;

        this.uniforms.uniforms.uToR = new Color(this.state.toColor).red;
        this.uniforms.uniforms.uToG = new Color(this.state.toColor).green;
        this.uniforms.uniforms.uToB = new Color(this.state.toColor).blue;
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

  constructor(state?: RecolourShaderState) {
    super();

    if (state) {
      this.state = {
        ...this.state,
        fromColor: state.fromColor,
        toColor: state.toColor,
        threshold: state.threshold,
      };
    }
    this.uniforms = new UniformGroup({
      uFromR: { value: new Color(this.state.fromColor).red, type: "f32" },
      uFromG: { value: new Color(this.state.fromColor).green, type: "f32" },
      uFromB: { value: new Color(this.state.fromColor).blue, type: "f32" },
      uToR: { value: new Color(this.state.toColor).red, type: "f32" },
      uToG: { value: new Color(this.state.toColor).green, type: "f32" },
      uToB: { value: new Color(this.state.toColor).blue, type: "f32" },
      uThreshold: { value: this.state.threshold, type: "f32" },
    });
  }

  shaderName(): string {
    return RecolourShader.SHADER_NAME;
  }

  defaultState(): RecolourShaderState {
    return {
      ...super.defaultState(),
      fromColor: "#000000",
      toColor: "#FF0000",
      threshold: 0.1,
    };
  }
}
