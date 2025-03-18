import { Ticker, UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./pixelate_shader.frag?raw";

export type PixelateShaderState = ShaderState & {
  pixelSize: number;
  strength: number;
  onlyPixels: boolean;
};

export type PixelateShaderSetting = {
  field: "pixelSize" | "strength" | "onlyPixels";
  type: "integer" | "float" | "boolean";
  onchange: (value: string) => void;
};

export class PixelateShader extends ShaderLayer {
  static SHADER_NAME: string = "pixelate_shader";
  declare state: PixelateShaderState;
  fragment: string = fragment;
  settings: PixelateShaderSetting[] = [
    {
      field: "pixelSize",
      type: "integer",
      onchange: (value) => {
        this.state.pixelSize = parseInt(value);
        this.uniforms.uniforms.uPixelSize = this.state.pixelSize;
      },
    },
    {
      field: "strength",
      type: "float",
      onchange: (value) => {
        this.state.strength = parseFloat(value);
        this.uniforms.uniforms.uStrength = this.state.strength;
      },
    },
    {
      field: "onlyPixels",
      type: "boolean",
      onchange: (value) => {
        this.state.onlyPixels = "true" == value;
        this.uniforms.uniforms.uOnlyPixels = this.state.onlyPixels ? 1 : 0;
      },
    },
  ];
  uniforms: UniformGroup;

  constructor(state?: PixelateShaderState) {
    super();
    console.log("CONSTRUCTOR", state, this.state);
    if (state) {
      this.state = {
        ...this.state,
        pixelSize: state.pixelSize,
        strength: state.strength,
        onlyPixels: state.onlyPixels,
      };
    }
    this.uniforms = new UniformGroup({
      uPixelSize: { value: this.state.pixelSize, type: "f32" },
      uStrength: { value: this.state.strength, type: "f32" },
      uOnlyPixels: { value: this.state.onlyPixels ? 1 : 0, type: "i32" },
      uTime: { value: Math.random(), type: "f32" },
    });
  }

  shaderName(): string {
    return PixelateShader.SHADER_NAME;
  }

  defaultState(): PixelateShaderState {
    return {
      ...super.defaultState(),
      pixelSize: 15,
      strength: 1,
      onlyPixels: false,
    };
  }

  tick(time: Ticker): void {
    if (
      true ||
      this.state.refreshChance === 1 ||
      Math.random() < this.state.refreshChance
    ) {
      if ((this.uniforms.uniforms.uTime as number) > 60) {
        (this.uniforms.uniforms.uTime as number) = 0;
      }
      this.uniforms.uniforms.uTime =
        (this.uniforms.uniforms.uTime as number) + time.elapsedMS / 1000;
    }
  }
}
