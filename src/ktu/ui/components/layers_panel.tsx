import jsx from "texsaur";
import { KTUComponent } from "../core/ktu_component";
import EventDispatcher from "../core/event_dispatcher";

export class LayersPanel extends KTUComponent {
  render(): Element {
    console.log("RENDER", this.bindingData["layersVisibility"]);
    const layersContent: Element = this.bindingData["layersVisibility"] ? (
      <>
        <layers-buttons></layers-buttons>
        <div className="layerListContainer">
          <layers-list binding="layers"></layers-list>
        </div>
      </>
    ) : (
      <></>
    );
    return (
      <div className="right-ui">
        <div className="panel right">
          <div>
            <h3 onclick={() => this.click()}>Layers/Tools (L)</h3>

            {layersContent}
          </div>
        </div>
        <div className="panel right">
          <shaders-list binding="shaders,shadersVisibility"></shaders-list>
        </div>
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
