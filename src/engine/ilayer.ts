import { Container, Ticker } from "pixi.js";

export interface ILayer {
  bind(container: Container): void;
  unbind(): void;
  tick(time: Ticker): void;
}
