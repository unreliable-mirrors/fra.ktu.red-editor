import { Container } from "pixi.js";

export interface ILayer {
  bind(container: Container): void;
  unbind(): void;
}
