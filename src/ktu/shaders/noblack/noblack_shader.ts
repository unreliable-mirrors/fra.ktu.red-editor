import { Container, Point, UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./noblack_shader.frag?raw";

export type NoBlackShaderState = ShaderState;

export type NoBlackShaderSetting = {
  field: "";
  type: "";
  onchange: (value: string) => void;
};

export class NoBlackShader extends ShaderLayer {
  static SHADER_NAME: string = "noblack_shader";
  declare state: NoBlackShaderState;
  fragment: string = fragment;
  container!: Container;
  settings: NoBlackShaderSetting[] = [];
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
      uSize: {
        value: new Point(window.innerWidth, window.innerHeight),
        type: "vec2<f32>",
      },
    });
  }

  shaderName(): string {
    return NoBlackShader.SHADER_NAME;
  }

  defaultState(): NoBlackShaderState {
    return {
      ...super.defaultState(),
    };
  }

  bind(container: Container): void {
    super.bind(container);
    this.container = container;
    this.refreshSize();
  }

  resize() {
    this.refreshSize();
  }

  refreshSize() {
    if (this.container.width > 0) {
      this.uniforms.uniforms.uSize = new Point(
        this.container.width,
        this.container.height
      );
    }
  }
}
