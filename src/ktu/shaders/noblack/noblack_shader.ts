import { Color, Container, Point, UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./noblack_shader.frag?raw";
import { ILayer } from "../../../engine/ilayer";

export type NoBlackShaderState = ShaderState & {
  color: string;
  threshold: number;
};

export type NoBlackShaderSetting = {
  field: "color" | "threshold";
  type: "color" | "float";
  onchange: (value: string) => void;
};

export class NoBlackShader extends ShaderLayer {
  static SHADER_NAME: string = "noblack_shader";
  declare state: NoBlackShaderState;
  fragment: string = fragment;
  container!: Container;
  settings: NoBlackShaderSetting[] = [
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

  constructor(state?: NoBlackShaderState) {
    super();

    if (state) {
      this.state = {
        ...this.state,
        pixelSize: state.pixelSize,
        missProbability: state.missProbability,
        seed: state.seed,
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
    return NoBlackShader.SHADER_NAME;
  }

  defaultState(): NoBlackShaderState {
    return {
      ...super.defaultState(),
      color: "#000000",
      threshold: 0.1,
    };
  }
}
