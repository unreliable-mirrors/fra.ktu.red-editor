import { Container } from "pixi.js";
import { ILayer } from "../ilayer";
import { IScene } from "../iscene";

export class BaseScene implements IScene {
  layers: ILayer[];
  container: Container;

  public constructor() {
    this.layers = [];
    this.container = new Container();
    this.container.eventMode = "none";
  }

  addLayer(layer: ILayer): void {
    this.layers.push(layer);
    layer.bind(this.container);
  }
}
