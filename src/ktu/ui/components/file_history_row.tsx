import jsx from "texsaur";

import { EditorSceneHistoryEntry } from "../../scenes/editor_scene";
import { KTUComponent } from "../core/ktu_component";
import EventDispatcher from "../core/event_dispatcher";

export class FileHistoryRow extends KTUComponent {
  history: EditorSceneHistoryEntry;
  constructor(history: EditorSceneHistoryEntry) {
    super();
    this.history = history;
  }

  //TODO: DEDUPLICATE THIS CODE
  render(): Element {
    return (
      <div className="historyRow">
        {this.history.image}
        <div>
          <span>{new Date(this.history.timestamp).toLocaleTimeString()}</span>
          <button onclick={() => this.restoreHistory()}>Restore</button>
        </div>
      </div>
    );
  }

  restoreHistory() {
    const payload = JSON.parse(this.history.raw);
    EventDispatcher.getInstance().dispatchEvent("scene", "openState", payload);
  }
}

customElements.define("file-history-row", FileHistoryRow);
