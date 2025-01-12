import { Container, Point, UniformGroup } from "pixi.js";
import { ShaderLayer, ShaderState } from "../shader_layer";

import fragment from "./grid_shader.frag?raw";

export type GridShaderState = ShaderState & {
  pixelSize: number;
};

export type GridShaderSetting = {
  field: "size";
  type: "integer";
  onchange: (value: string) => void;
};

export class GridShader extends ShaderLayer {
  static SHADER_NAME: string = "grid_shader";
  declare state: GridShaderState;
  fragment: string = fragment;
  container!: Container;
  settings: GridShaderSetting[] = [
    {
      field: "size",
      type: "integer",
      onchange: (value) => {
        this.state.pixelSize = parseInt(value);
        this.uniforms.uniforms.uPixelSize = this.state.pixelSize;
        this.refreshSize();
      },
    },
  ];
  uniforms: UniformGroup;

  constructor(state?: GridShaderState) {
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
      uSize: {
        value: new Point(window.innerWidth, window.innerHeight),
        type: "vec2<f32>",
      },
    });
  }

  shaderName(): string {
    return GridShader.SHADER_NAME;
  }

  defaultState(): GridShaderState {
    return {
      ...super.defaultState(),
      pixelSize: 15,
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
