import { Container, Filter, UniformGroup } from "pixi.js";
import { ShaderLayer } from "../shader_layer";

import vertex from "../defaultFilter.vert?raw";
import fragment from "./pixelate_shader.frag?raw";

export type PixelateShaderState = {
  name: string;
  layerId: number;
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
  shader: Filter;
  state: PixelateShaderState;
  width: number = 1920;
  height: number = 1080;
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
      field: "missProbability",
      type: "float",
      onchange: (value) => {
        this.state.missProbability = parseFloat(value);
        this.uniforms.uniforms.uMissProbability = this.state.missProbability;
      },
    },
    {
      field: "seed",
      type: "integer",
      onchange: (value) => {
        this.state.seed = parseInt(value);
        this.uniforms.uniforms.uSeed = this.state.seed;
      },
    },
  ];
  uniforms: UniformGroup;

  constructor(state?: PixelateShaderState) {
    super();

    if (state) {
      this.state = {
        name: state.name,
        layerId: state.layerId,
        pixelSize: state.pixelSize,
        missProbability: state.missProbability,
        seed: state.seed,
      };
    } else {
      this.state = {
        name: "pixelate_shader",
        layerId: this.layerId,
        pixelSize: 15,
        missProbability: 0,
        seed: 1,
      };
    }
    this.uniforms = new UniformGroup({
      uPixelSize: { value: this.state.pixelSize, type: "f32" },
      uMissProbability: { value: this.state.missProbability, type: "f32" },
      uSeed: { value: this.state.seed, type: "f32" },
      uWidth: { value: this.width, type: "f32" },
      uHeight: { value: this.height, type: "f32" },
    });

    this.shader = this.buildShader();
  }

  buildShader(): Filter {
    const uniforms = this.uniforms;
    return Filter.from({
      gl: {
        vertex: vertex,
        fragment: fragment,
      },
      resources: { uniforms },
    });
  }

  bind(container: Container): void {
    super.bind(container);
    this.width = container.width;
    this.height = container.width;
  }
}
