import { Application } from "pixi.js";
import { EditorScene } from "./ktu/scenes/editor_scene";
import { EditorUI } from "./ktu/ui/editor_ui";
import DataStore from "./ktu/ui/core/data_store";
export class FrakturedEditor {
  canvasAnchor: HTMLElement;
  uiAnchor: HTMLElement;
  live: boolean = false;

  scene?: EditorScene;

  public constructor(canvasAnchor: HTMLElement, uiAnchor: HTMLElement) {
    this.canvasAnchor = canvasAnchor;
    this.uiAnchor = uiAnchor;
  }
  public async init() {
    const app = new Application();

    await app.init({
      background: "#000000",
      resizeTo: this.canvasAnchor,
      sharedTicker: true,
    });
    this.canvasAnchor.appendChild(app.canvas);

    DataStore.getInstance().setStore("app", app);

    this.scene = new EditorScene();
    app.stage.addChild(this.scene.container);

    app.canvas.addEventListener("wheel", (e: WheelEvent) => {
      console.log("WHEEL", e);
      this.scene?.scroll(e);
      e.preventDefault();
    });

    app.canvas.addEventListener("pointerdown", (event: PointerEvent) => {
      console.log("POINTERCLICK", event.clientX);

      //@ts-ignore
      this.scene?.pointerDown(event);
    });

    app.canvas.addEventListener("pointerup", (event: PointerEvent) => {
      this.scene?.pointerUp(event);
    });
    app.canvas.addEventListener("pointermove", (event: PointerEvent) => {
      this.scene?.pointerMove(event);
    });

    const ui = new EditorUI(this.uiAnchor);
    ui.init();
    this.live = true;
  }
}
