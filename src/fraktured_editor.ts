import { Application } from "pixi.js";
import { IScene } from "./engine/iscene";
import { EditorScene } from "./engine/scenes/editor_scene";
import { EditorUI } from "./ui/editor_ui";
export class FrakturedEditor {
  canvasAnchor: HTMLElement;
  uiAnchor: HTMLElement;

  scene: IScene;

  public constructor(canvasAnchor: HTMLElement, uiAnchor: HTMLElement) {
    this.canvasAnchor = canvasAnchor;
    this.uiAnchor = uiAnchor;
    this.scene = new EditorScene();
  }

  public async init() {
    const app = new Application();
    app.stage.addChild(this.scene.container);

    await app.init({ background: "#000000 ", resizeTo: window });
    this.canvasAnchor.appendChild(app.canvas);

    const ui = new EditorUI(this.uiAnchor);
    ui.init();
  }
}
