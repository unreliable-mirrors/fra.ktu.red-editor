import jsx from "texsaur";
import { KTUComponent } from "../core/ktu_component";
import {
  EditorSceneHistoryEntry,
  EditorSceneMetadata,
} from "../../scenes/editor_scene";
import EventDispatcher from "../core/event_dispatcher";
import { FileHistoryRow } from "./file_history_row";

export class FileInfoPanel extends KTUComponent {
  render(): Element {
    console.log("FIP RENDER", this.bindingData);
    return (
      <div className="filePanel">
        <h3>File Info</h3>
        <div>
          <span>Name: </span>
          <input
            type="text"
            value={(this.bindingData["metadata"] as EditorSceneMetadata).name}
            oninput={(e) => {
              this.onNameChange((e.target as HTMLInputElement).value);
            }}
          ></input>
        </div>
        <div>
          <span>Length: </span>
          <input
            type="text"
            value={(this.bindingData["metadata"] as EditorSceneMetadata).length}
            oninput={(e) => {
              this.onLengthChange((e.target as HTMLInputElement).value);
            }}
          ></input>
        </div>
        <span className="separator"></span>
        <export-canvas-button></export-canvas-button>
        <export-viewport-button></export-viewport-button>
        <span className="separator"></span>
        <h3>Playback</h3>
        <playback-controls binding="playing"></playback-controls>
        <span className="separator"></span>
        <h3>History</h3>
        <div>
          {this.bindingData["history"].map(
            (history: EditorSceneHistoryEntry) => new FileHistoryRow(history)
          )}
        </div>
      </div>
    );
  }

  onNameChange(value: string) {
    EventDispatcher.getInstance().dispatchEvent("scene", "setName", value);
  }

  onLengthChange(value: string) {
    EventDispatcher.getInstance().dispatchEvent(
      "scene",
      "setLength",
      parseFloat(value)
    );
  }

  defaultBinding(): Record<string, any> {
    return { metadata: [], history: [] };
  }
}

customElements.define("file-info-panel", FileInfoPanel);
