import { Container, FederatedPointerEvent, Ticker } from "pixi.js";
import { EditorLayerSetting, IEditorLayer } from "./ieditor_layer";
import { getSecureIndex } from "../scenes/editor_scene";

export abstract class ContainerLayer implements IEditorLayer {
  layerId: number;
  parent?: Container;
  container: Container;
  abstract state: any;
  abstract settings: EditorLayerSetting[];
  active: boolean;

  public constructor() {
    this.container = new Container();
    //TODO: REPLACE THIS FOR A GLOBAL SAFE COUNTER
    this.layerId = getSecureIndex();
    this.active = false;
  }

  bind(container: Container): void {
    container.addChild(this.container);
    this.parent = container;
  }

  unbind(): void {
    this.container.parent.removeChild(this.container);
  }

  //@ts-ignore
  tick(time: Ticker): void {}

  //@ts-ignore
  pointerDown(event: FederatedPointerEvent): void {}
  //@ts-ignore
  pointerUp(event: FederatedPointerEvent): void {}
  //@ts-ignore
  pointerMove(event: FederatedPointerEvent): void {}
}
