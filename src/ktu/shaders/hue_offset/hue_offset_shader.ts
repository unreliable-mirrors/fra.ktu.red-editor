import { UniformData } from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./hue_offset_shader.frag?raw";

export type HueOffsetShaderState = ShaderState & {
  offset: number;
};

export type HueOffsetShaderSetting = {
  field: ShaderSetting["field"] | "offset";
  type: ShaderSetting["type"] | "integer";
  onchange: (value: string) => void;
};

export class HueOffsetShader extends ShaderLayer {
  static SHADER_NAME: string = "hue_offset_shader";
  declare state: HueOffsetShaderState;
  fragment: string = fragment;

  settings: HueOffsetShaderSetting[] = [
    {
      field: "offset",
      type: "integer",
      onchange: (value) => {
        this.state.offset = parseInt(value);
        this.uniforms.uniforms.uOffset = this.state.offset;
      },
    },
    ...this.defaultSettings(),
  ];

  constructor(state?: HueOffsetShaderState) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        offset: state.offset,
      };
    }
  }

  shaderName(): string {
    return HueOffsetShader.SHADER_NAME;
  }

  defaultState(): HueOffsetShaderState {
    return {
      ...super.defaultState(),
      offset: 180,
    };
  }

  setupUniformValues(): { [key: string]: UniformData } {
    return {
      uOffset: { value: this.state.offset, type: "f32" },
    };
  }
}
