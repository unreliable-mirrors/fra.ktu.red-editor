import { Container, Filter } from "pixi.js";
import { IScene } from "../iscene";
import { ContainerLayer } from "../../ktu/layers/container_layer";
import { ShaderLayer } from "../../ktu/shaders/shader_layer";
import { IModulator } from "../imodulator";

export abstract class BaseScene implements IScene {
  layers: ContainerLayer[];
  shaders: ShaderLayer[];
  modulators: IModulator[];
  container: Container;

  public constructor() {
    this.layers = [];
    this.shaders = [];
    this.modulators = [];
    this.container = new Container();
    this.container.eventMode = "none";
  }

  addLayer(layer: ContainerLayer): void {
    this.layers.push(layer);
    this.container.addChild(layer.container);
    layer.bind(this.container);
  }

  removeLayer(layer: ContainerLayer): void {
    const index = this.layers.indexOf(layer);
    if (index > -1) {
      this.layers.splice(index, 1);
    }
    this.container.removeChild(layer.container);
    layer.unbind();
  }

  addModulator(modulator: IModulator): void {
    this.modulators.push(modulator);
  }

  removeModulator(modulator: IModulator): void {
    const index = this.modulators.indexOf(modulator);
    if (index > -1) {
      this.modulators.splice(index, 1);
    }
    modulator.unbindAll();
  }

  addShader(shader: ShaderLayer): void {
    this.shaders.push(shader);
    shader.bind(this.container);
    console.log("FILTERS", this.container.filters);
    let filters: Filter[] = [];
    if (this.container.filters) {
      if (this.container.filters instanceof Array) {
        filters = [...this.container.filters];
      } else {
        filters.push(this.container.filters);
      }
    }
    filters.push(shader.shader);
    this.container.filters = filters;
  }

  removeShader(shader: ShaderLayer): void {
    const index = this.shaders.indexOf(shader);
    if (index > -1) {
      this.shaders.splice(index, 1);
      if (this.container.filters) {
        if (this.container.filters instanceof Array) {
          const filters = [...this.container.filters];
          filters.splice(index, 1);
          this.container.filters = filters;
        } else {
          this.container.filters = [];
        }
      }
    }
    shader.unbind();
  }
}
