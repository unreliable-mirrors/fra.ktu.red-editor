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
        <button onclick={() => this.handleFileClick()}>Load from File</button>
        <button onclick={() => this.showUrlClick()}>Load from URL</button>
        {this.urlElement}
      </div>
    );
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
  handleFileClick() {
    this.options.onchange("");
  }
}

customElements.define("file-loader", FileLoaderComponent);
