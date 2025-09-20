import jsx from "texsaur";
import { KTUComponent } from "../core/ktu_component";
import EventDispatcher from "../core/event_dispatcher";
import { KeyboardManager } from "../../helpers/keyboard_manager";

export class LayersPanel extends KTUComponent {
  render(): Element {
    console.log("RENDER", this.bindingData["layersVisibility"]);
    const layersContent: Element = this.bindingData["layersVisibility"] ? (
      <>
        <layers-buttons></layers-buttons>
        <div className="layerListContainer">
          <layers-list binding="layers,modulators"></layers-list>
        </div>
      </>
    ) : (
      <></>
    );
    return (
      <div className="right-ui">
        <div className="panel right">
          <div>
            <h3 onclick={() => this.click()}>{`Layers/Tools ${
              KeyboardManager.keyboardExists() ? " (L)" : ""
            }`}</h3>

            {layersContent}
          </div>
        </div>
        <div className="panel right">
          <shaders-list binding="shaders,shadersVisibility,modulators"></shaders-list>
        </div>
        <div className="panel right">
          <modulators-list binding="modulators,modulatorsVisibility"></modulators-list>
        </div>{" "}
      </div>
    );
  }

  defaultBinding(): Record<string, any> {
    return { layersVisibility: true };
  }

  click() {
    EventDispatcher.getInstance().dispatchEvent("scene", "toggleLayers", {});
  }
}

customElements.define("layers-panel", LayersPanel);
