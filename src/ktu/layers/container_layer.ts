import { Container, FederatedPointerEvent, Ticker } from "pixi.js";
import { IEditorLayer } from "./ieditor_layer";

export class ContainerLayer implements IEditorLayer {
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

  tick(time: Ticker): void {}

  pointerDown(event: FederatedPointerEvent): void {}
}
