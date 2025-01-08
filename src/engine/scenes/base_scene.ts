import { Container, Filter } from "pixi.js";
import { IScene } from "../iscene";
import { ContainerLayer } from "../../ktu/layers/container_layer";
import { ShaderLayer } from "../../ktu/shaders/shader_layer";

export class BaseScene implements IScene {
  layers: ContainerLayer[];
  shaders: ShaderLayer[];
  container: Container;

  public constructor() {
    this.layers = [];
    this.shaders = [];
    this.container = new Container();
    this.container.eventMode = "none";
  }

  addLayer(layer: ContainerLayer): void {
    this.layers.push(layer);
    this.container.addChild(layer.container);
    layer.bind(this.container);
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
}
