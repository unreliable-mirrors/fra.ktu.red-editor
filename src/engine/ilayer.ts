import { Container, Ticker } from "pixi.js";

export interface ILayer {
  layerId: string;
  bind(container: Container): void;
  unbind(): void;
  tick(time: Ticker): void;
}
