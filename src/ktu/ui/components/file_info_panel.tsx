import jsx from "texsaur";
import { KTUComponent } from "../core/ktu_component";
import { EditorSceneMetadata } from "../../scenes/editor_scene";
import EventDispatcher from "../core/event_dispatcher";

export class FileInfoPanel extends KTUComponent {
  render(): Element {
    return (
      <div id="hintsPanel" className="hintPanel">
        <h3>File Info</h3>
        <div>
          <span>Name: </span>
          <input
            type="text"
            value={(this.bindingData as EditorSceneMetadata).name}
            oninput={(e) => {
              this.onNameChange((e.target as HTMLInputElement).value);
            }}
          ></input>
        </div>
      </div>
    );
  }

  onNameChange(value: string) {
    EventDispatcher.getInstance().dispatchEvent("scene", "setName", value);
  }
}

customElements.define("file-info-panel", FileInfoPanel);
