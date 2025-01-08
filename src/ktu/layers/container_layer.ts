import { Container, FederatedPointerEvent, Ticker } from "pixi.js";
import { EditorLayerSetting, IEditorLayer } from "./ieditor_layer";

export abstract class ContainerLayer implements IEditorLayer {
  layerId: string;
  parent?: Container;
  container: Container;
  abstract state: any;
  abstract settings: EditorLayerSetting[];
  active: boolean;

  public constructor() {
    this.container = new Container();
    //TODO: REPLACE THIS FOR A GLOBAL SAFE COUNTER
    this.layerId = Math.floor(Math.random() * 9999999999) + "";
    this.active = false;
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
