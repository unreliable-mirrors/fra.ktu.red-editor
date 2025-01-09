import { Application } from "pixi.js";
import { IScene } from "./engine/iscene";
import { EditorScene } from "./ktu/scenes/editor_scene";
import { EditorUI } from "./ktu/ui/editor_ui";
import DataStore from "./ktu/ui/core/data_store";
export class FrakturedEditor {
  canvasAnchor: HTMLElement;
  uiAnchor: HTMLElement;
  live: boolean = false;

  scene?: IScene;

  public constructor(canvasAnchor: HTMLElement, uiAnchor: HTMLElement) {
    this.canvasAnchor = canvasAnchor;
    this.uiAnchor = uiAnchor;
  }
  public async init() {
    const app = new Application();

    await app.init({
      background: "#ffffff",
      resizeTo: this.canvasAnchor,
      sharedTicker: true,
    });
    this.canvasAnchor.appendChild(app.canvas);

    DataStore.getInstance().setStore("app", app);

    this.scene = new EditorScene();
    app.stage.addChild(this.scene.container);

    const ui = new EditorUI(this.uiAnchor);
    ui.init();
    this.live = true;
  }
}
