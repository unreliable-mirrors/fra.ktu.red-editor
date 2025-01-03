import { Container } from "pixi.js";
import { ILayer } from "./ilayer";

export interface IScene {
  layers: ILayer[];
  container: Container;

  addLayer(layer: ILayer): void;
}
