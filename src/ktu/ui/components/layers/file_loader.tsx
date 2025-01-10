import jsx from "texsaur";

import { KTUComponent } from "../../core/ktu_component";
import { ImageLayer } from "../../../layers/image_layer";
import { getText } from "../../../helpers/localization_helper";
import { IconLeft } from "../../../helpers/icons";

export type FileLoaderOptions = {
  onchange: (event: string) => void;
  layer: ImageLayer;
};
export class FileLoaderComponent extends KTUComponent {
  options: FileLoaderOptions;
  urlInput?: Element;
  urlElement?: Element;
  uploadElement?: Element;
  changeButton?: Element;
  controlsElement?: Element;

  constructor(options: FileLoaderOptions) {
    super();
    this.options = options;
  }

  render(): Element {
    this.urlInput = <input type="text"></input>;
    this.urlElement = (
      <div class="hidden">
        <span>URL: </span>
        {this.urlInput}
        <button onclick={() => this.handleUrlClick()}>LOAD</button>
        <button
          className="iconButton"
          onclick={() => this.handleUrlBackClick()}
        >
          {IconLeft()}
        </button>
      </div>
    );
    this.controlsElement = (
      <span>
        <label for="imageLoadInput" className="button">
          File
        </label>
        <button onclick={() => this.showUrlClick()}>URL</button>
      </span>
    );
    this.uploadElement = (
      <div className={this.options.layer.state.imageUrl == "" ? "" : "hidden"}>
        <form
          className="hidden"
          id="imageFile"
          name="imageFile"
          enctype="multipart/form-data"
          method="post"
        >
          <fieldset>
            <input
              type="file"
              id="imageLoadInput"
              accept="image/*,video/*"
              onchange={() => {
                this.loadFile();
              }}
            />
          </fieldset>
        </form>
        {this.controlsElement}
        {this.urlElement}
      </div>
    );
    this.changeButton = (
      <button
        className={this.options.layer.state.imageUrl != "" ? "" : "hidden"}
        onclick={() => this.handleChangeClick()}
      >
        {getText("change")}
      </button>
    );
    return (
      <div className="fileLoader">
        {this.changeButton}
        {this.uploadElement}
      </div>
    );
  }

  loadFile() {
    let input: HTMLInputElement;
    let file, fr;

    console.log("ON LOAD FILE");
    //@ts-ignore
    window.KTUFullscreen();

    input = document.getElementById("imageLoadInput") as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      //TODO: DEDUPLICATE THIS
      file = input.files[0];
      fr = new FileReader();
      fr.onload = (e) => {
        this.receivedText(e);
      };
      if (file.size < 104857600) {
        fr.readAsDataURL(file);
      } else {
        //TODO: Implement an alert system for this
        console.log("ERROR - No files larger than 100mb");
      }
      input.value = "";
    }
  }

  receivedText(e: ProgressEvent<FileReader>) {
    const payload: string = e.target!.result as string;
    console.log("RECEIVE", typeof e.target!.result, payload.length);
    //@ts-ignore
    window.KTUFullscreen();
    this.options.onchange(payload);
  }
  handleChangeClick() {
    this.changeButton!.className = this.changeButton?.className + " hidden";
    this.uploadElement!.className = this.urlElement!.className.replace(
      "hidden",
      ""
    );
  }
  showUrlClick() {
    this.controlsElement!.className =
      this.controlsElement?.className + " hidden";
    this.urlElement!.className = this.urlElement!.className.replace(
      "hidden",
      ""
    );
  }
  handleUrlBackClick() {
    this.urlElement!.className = this.urlElement?.className + " hidden";
    this.controlsElement!.className = this.controlsElement!.className.replace(
      "hidden",
      ""
    );
  }

  handleUrlClick() {
    console.log("URL CLICK", (this.urlInput! as HTMLInputElement).value);
    this.options.onchange((this.urlInput! as HTMLInputElement).value);
  }
}

customElements.define("file-loader", FileLoaderComponent);
