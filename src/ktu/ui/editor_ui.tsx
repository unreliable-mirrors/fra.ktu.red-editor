import jsx from "texsaur";

export class EditorUI {
  anchor: HTMLElement;
  public constructor(anchor: HTMLElement) {
    this.anchor = anchor;
  }
  public init() {
    this.anchor.appendChild(
      <div>
        <div className="left-ui">
          <div className="panel left">
            <h3>Open/Save</h3>
            <new-state-button></new-state-button>
            <load-state></load-state>
            <export-state-button></export-state-button>
          </div>
        </div>
        <div className="right-ui">
          <div className="panel right">
            <layers-list binding="layers"></layers-list>
          </div>
          <div className="panel right">
            <shaders-list binding="shaders"></shaders-list>
          </div>
        </div>
      </div>
    );
    document.addEventListener("keyup", (e) => {
      if (["h", "H"].includes(e.key) && e.ctrlKey) {
        this.toggleHide();
      }
    });
  }

  toggleHide() {
    const ui = document.getElementById("ui");
    console.log("TOGGLE", ui?.className.includes("hidden"));
    if (ui?.className.includes("hidden")) {
      ui.className = ui.className.replace("hidden", "");
    } else {
      ui!.className += " hidden";
    }
  }
}
