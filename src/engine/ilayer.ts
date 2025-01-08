import { Container, Ticker } from "pixi.js";

export interface ILayer {
  layerId: number;
  bind(container: Container): void;
  unbind(): void;
  tick(time: Ticker): void;
}
