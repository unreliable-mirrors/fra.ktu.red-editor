import { Container, UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./pixelate_shader.frag?raw";

export type PixelateShaderState = ShaderState & {
  pixelSize: number;
  missProbability: number;
  seed: number;
};

export type PixelateShaderSetting = {
  field: "pixelSize" | "missProbability" | "seed";
  type: "integer" | "float";
  onchange: (value: string) => void;
};

export class PixelateShader extends ShaderLayer {
  static SHADER_NAME: string = "pixelate_shader";
  declare state: PixelateShaderState;
  fragment: string = fragment;
  width: number = 1920;
  height: number = 1080;
  container!: Container;
  settings: PixelateShaderSetting[] = [
    {
      field: "pixelSize",
      type: "integer",
      onchange: (value) => {
        this.state.pixelSize = parseInt(value);
        this.uniforms.uniforms.uPixelSize = this.state.pixelSize;
        this.refreshSize();
      },
    },
    {
      field: "missProbability",
      type: "float",
      onchange: (value) => {
        this.state.missProbability = parseFloat(value);
        this.uniforms.uniforms.uMissProbability = this.state.missProbability;
        this.refreshSize();
      },
    },
    {
      field: "seed",
      type: "integer",
      onchange: (value) => {
        this.state.seed = parseInt(value);
        this.uniforms.uniforms.uSeed = this.state.seed;
        this.refreshSize();
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
        missProbability: state.missProbability,
        seed: state.seed,
      };
    }
    this.uniforms = new UniformGroup({
      uPixelSize: { value: this.state.pixelSize, type: "f32" },
      uMissProbability: { value: this.state.missProbability, type: "f32" },
      uSeed: { value: this.state.seed, type: "f32" },
      uWidth: { value: this.width, type: "f32" },
      uHeight: { value: this.height, type: "f32" },
    });
  }

  shaderName(): string {
    return PixelateShader.SHADER_NAME;
  }

  defaultState(): PixelateShaderState {
    return {
      ...super.defaultState(),
      pixelSize: 15,
      missProbability: 0,
      seed: 1,
    };
  }

  bind(container: Container): void {
    super.bind(container);
    this.container = container;
    this.refreshSize();
  }

  refreshSize() {
    if (this.container.width > 0) {
      this.width = this.container.width;
      this.uniforms.uniforms.uWidth = this.width;
      this.height = this.container.height;
      this.uniforms.uniforms.uHeight = this.height;
    }
  }
}
