import { Container, Filter, UniformGroup } from "pixi.js";
import { ShaderLayer } from "../shader_layer";

import vertex from "../defaultFilter.vert?raw";
import fragment from "./bnw_shader.frag?raw";

export type BnwShaderLayerState = {
  name: string;
  layerId: number;
  strength: number;
};

export type BnwShaderLayerSetting = {
  field: "strength";
  type: "float";
  onchange: (value: string) => void;
};

export class BnwShaderLayer extends ShaderLayer {
  shader: Filter;
  state: BnwShaderLayerState;
  settings: BnwShaderLayerSetting[] = [
    {
      field: "strength",
      type: "float",
      onchange: (value) => {
        this.state.strength = parseFloat(value);
        this.uniforms.uniforms.uStrength = this.state.strength;
      },
    },
  ];
  uniforms: UniformGroup;

  constructor(state?: BnwShaderLayerState) {
    super();

    if (state) {
      this.state = {
        name: state.name,
        layerId: state.layerId,
        strength: state.strength,
      };
    } else {
      this.state = {
        name: "bnw_shader",
        layerId: this.layerId,
        strength: 1,
      };
    }
    this.uniforms = new UniformGroup({
      uStrength: { value: 1, type: "f32" },
    });

    this.shader = this.buildShader();
  }

  buildShader(): Filter {
    const uniforms = this.uniforms;
    console.log("2", this.uniforms);
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
  }
}
