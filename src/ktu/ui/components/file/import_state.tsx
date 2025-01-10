import jsx from "texsaur";

import EventDispatcher from "../../core/event_dispatcher";
import { KTUComponent } from "../../core/ktu_component";
import { getText } from "../../../helpers/localization_helper";

export class ImportStateButtonComponent extends KTUComponent {
  constructor() {
    super();
  }

  render(): Element {
    return (
      <div>
        <div>
          <form
            className="hidden"
            id="importFile"
            name="importFile"
            enctype="multipart/form-data"
            method="post"
          >
            <fieldset>
              <input
                type="file"
                id="fileImportInput"
                accept=".red"
                onchange={() => {
                  console.log("change");
                  this.loadFile();
                }}
              />
            </fieldset>
          </form>
          <label for="fileImportInput" className="button">
            {getText("import_state")}
          </label>
        </div>
      </div>
    );
  }

  loadFile() {
    let input: HTMLInputElement;
    let file, fr;

    input = document.getElementById("fileImportInput") as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      file = input.files[0];
      fr = new FileReader();
      fr.onload = (e) => {
        this.receivedText(e);
      };
      fr.readAsText(file);
      input.value = "";
    }
  }

  receivedText(e: ProgressEvent<FileReader>) {
    const lines: string = e.target!.result as string;
    const payload = JSON.parse(lines);
    //@ts-ignore
    window.KTUFullscreen();
    EventDispatcher.getInstance().dispatchEvent(
      "scene",
      "importState",
      payload
    );
  }

  handleClick() {
    document.getElementById("btnLoad")?.click();
  }
}

customElements.define("import-state-button", ImportStateButtonComponent);
