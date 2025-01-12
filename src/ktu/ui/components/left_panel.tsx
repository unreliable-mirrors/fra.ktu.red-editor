import jsx from "texsaur";
import { KTUComponent } from "../core/ktu_component";
import EventDispatcher from "../core/event_dispatcher";
import { keyboardExists } from "../../helpers/keyboard_manager";

export class LeftPanel extends KTUComponent {
  render(): Element {
    console.log("RENDER", this.bindingData["filesVisibility"]);
    const filesContent: Element = this.bindingData["filesVisibility"] ? (
      <>
        <new-state-button></new-state-button>
        <open-state-button></open-state-button>
        <export-state-button></export-state-button>
        <span className="separator"></span>
        <import-state-button></import-state-button>
        <export-canvas-button></export-canvas-button>
      </>
    ) : (
      <></>
    );
    const historyContent: Element = this.bindingData["filesVisibility"] ? (
      <div className="panel left">
        <file-info-panel binding="metadata,history"></file-info-panel>
      </div>
    ) : (
      <></>
    );
    return (
      <div className="left-ui">
        <div className="panel left">
          <h3 onclick={() => this.click()}>{`Open/Save ${
            keyboardExists() ? " (F)" : ""
          }`}</h3>
          {filesContent}
        </div>
        {historyContent}
      </div>
    );
  }

  defaultBinding(): Record<string, any> {
    return { filesVisibility: true };
  }

  click() {
    EventDispatcher.getInstance().dispatchEvent("scene", "toggleFiles", {});
  }
}

customElements.define("left-panel", LeftPanel);
