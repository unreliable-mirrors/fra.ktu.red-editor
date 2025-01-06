import { Container, FederatedPointerEvent, Ticker } from "pixi.js";
import { IEditorLayer } from "./ieditor_layer";

export class ContainerLayer implements IEditorLayer {
  parent?: Container;
  container: Container;

  public constructor() {
    this.container = new Container();
  }

  bind(container: Container): void {
    container.addChild(this.container);
    this.parent = container;
  }

  unbind(): void {
    this.container.parent.removeChild(this.container);
  }

  tick(time: Ticker): void {}

  pointerDown(event: FederatedPointerEvent): void {}
  pointerUp(event: FederatedPointerEvent): void {}
  pointerMove(event: FederatedPointerEvent): void {}
}
