import { Container, Filter } from "pixi.js";
import { ShaderLayer } from "../shader_layer";

import vertex from "../defaultFilter.vert?raw";
import fragment from "./bnw_shader.frag?raw";

export type BnwShaderLayerState = {
  name: string;
  layerId: number;
};

export type BnwShaderLayerSetting = {
  field: "";
  type: "";
  onchange: (value: string) => void;
};

export class BnwShaderLayer extends ShaderLayer {
  state: BnwShaderLayerState;
  settings: BnwShaderLayerSetting[] = [];

  constructor(state?: BnwShaderLayerState) {
    super();

    if (state) {
      this.state = {
        name: state.name,
        layerId: state.layerId,
      };
    } else {
      this.state = {
        name: "bnw_shader_layer",
        layerId: this.layerId,
      };
    }
  }

  buildShader(): Filter {
    return Filter.from({
      gl: {
        vertex: vertex,
        fragment: fragment,
      },
    });
  }

  bind(container: Container): void {
    super.bind(container);
  }
}
