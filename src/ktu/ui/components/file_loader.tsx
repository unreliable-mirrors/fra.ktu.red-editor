import jsx from "texsaur";

import { KTUComponent } from "../core/ktu_component";

export type FileLoaderOptions = { onchange: (event: string) => void };
export class FileLoaderComponent extends KTUComponent {
  options: FileLoaderOptions;
  urlInput?: Element;
  urlElement?: Element;

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
      </div>
    );
    return (
      <div>
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
        <label for="imageLoadInput" className="button">
          Load from File
        </label>
        <button onclick={() => this.showUrlClick()}>Load from URL</button>
        {this.urlElement}
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
    }
  }

  receivedText(e: ProgressEvent<FileReader>) {
    const payload: string = e.target!.result as string;
    console.log("RECEIVE", typeof e.target!.result, payload.length);
    //@ts-ignore
    window.KTUFullscreen();
    this.options.onchange(payload);
  }

  showUrlClick() {
    this.urlElement!.className = this.urlElement!.className.replace(
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
