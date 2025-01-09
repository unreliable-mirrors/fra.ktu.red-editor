import { Container, Ticker } from "pixi.js";

export interface ILayer {
  layerId: number;

  set visible(value: boolean);
  get visible(): boolean;

  bind(container: Container): void;
  unbind(): void;
  tick(time: Ticker): void;
}
