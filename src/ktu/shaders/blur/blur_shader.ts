import { UniformData } from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./blur_shader.frag?raw";

export type BlurShaderState = ShaderState & {
  redSize: number;
  greenSize: number;
  blueSize: number;
};

export type BlurShaderSetting = {
  field: ShaderSetting["field"] | "redSize" | "greenSize" | "blueSize";
  type: ShaderSetting["type"] | "integer";
  onchange: (value: string) => void;
};

export class BlurShader extends ShaderLayer {
  static SHADER_NAME: string = "blur_shader";
  declare state: BlurShaderState;
  fragment: string = fragment;

  settings: BlurShaderSetting[] = [
    {
      field: "redSize",
      type: "integer",
      onchange: (value) => {
        this.state.redSize = parseInt(value);
        this.uniforms.uniforms.uRedSize = this.state.redSize;
      },
    },
    {
      field: "greenSize",
      type: "integer",
      onchange: (value) => {
        this.state.greenSize = parseInt(value);
        this.uniforms.uniforms.uGreenSize = this.state.greenSize;
      },
    },
    {
      field: "blueSize",
      type: "integer",
      onchange: (value) => {
        this.state.blueSize = parseInt(value);
        this.uniforms.uniforms.uBlueSize = this.state.blueSize;
      },
    },
    ...this.defaultSettings(),
  ];

  constructor(state?: BlurShaderState) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        redSize: state.redSize,
        greenSize: state.greenSize,
        blueSize: state.blueSize,
      };
    }
  }

  shaderName(): string {
    return BlurShader.SHADER_NAME;
  }

  defaultState(): BlurShaderState {
    return {
      ...super.defaultState(),
      redSize: 10,
      greenSize: 10,
      blueSize: 10,
    };
  }

  setupUniformValues(): { [key: string]: UniformData } {
    return {
      uRedSize: { value: this.state.redSize, type: "f32" },
      uGreenSize: { value: this.state.greenSize, type: "f32" },
      uBlueSize: { value: this.state.blueSize, type: "f32" },
    };
  }
}
