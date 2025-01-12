import jsx from "texsaur";
import EventDispatcher from "./core/event_dispatcher";

export class EditorUI {
  anchor: HTMLElement;
  public constructor(anchor: HTMLElement) {
    this.anchor = anchor;
  }
  public init() {
    this.anchor.appendChild(
      <div>
        <left-panel binding="filesVisibility"></left-panel>
        <layers-panel binding="layersVisibility,shadersVisibility"></layers-panel>
        <hint-panel binding="activeLayer,showGeneralTips,hintsVisibility"></hint-panel>
      </div>
    );
    EventDispatcher.getInstance().addEventListener(
      "uiVisibility",
      "update",
      () => {
        this.toggle();
      }
    );
  }

  toggle() {
    const ui = document.getElementById("ui");
    console.log("TOGGLE", ui?.className.includes("hidden"));
    if (ui?.className.includes("hidden")) {
      ui.className = ui.className.replace("hidden", "");
    } else {
      ui!.className += " hidden";
    }
  }
}
