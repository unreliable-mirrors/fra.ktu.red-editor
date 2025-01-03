import { Container } from "pixi.js";
import { ILayer } from "../ilayer";

export class ContainerLayer implements ILayer {
  container: Container;

  public constructor() {
    this.container = new Container();
  }

  bind(container: Container): void {
    container.addChild(this.container);
  }

  unbind(): void {
    this.container.parent.removeChild(this.container);
  }
}
