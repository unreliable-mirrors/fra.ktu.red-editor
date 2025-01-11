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
            <open-state-button></open-state-button>
            <export-state-button></export-state-button>
            <span className="separator"></span>
            <import-state-button></import-state-button>
            <export-canvas-button></export-canvas-button>
          </div>
          <div className="panel left">
            <file-info-panel binding="metadata,history"></file-info-panel>
          </div>
        </div>
        <div className="right-ui">
          <div className="panel right">
            <div>
              <h3>Layers</h3>
              <layers-buttons></layers-buttons>
              <div className="layerListContainer">
                <layers-list binding="layers"></layers-list>
              </div>
            </div>
          </div>
          <div className="panel right">
            <shaders-list binding="shaders"></shaders-list>
          </div>
        </div>
        <div className="bottom-ui">
          <div id="hintsPanel" className="panel bottom">
            <hint-panel binding="activeLayer,showGeneralTips"></hint-panel>
          </div>
        </div>
      </div>
    );
    document.addEventListener("keyup", (e) => {
      if (["j", "J"].includes(e.key) && e.ctrlKey && e.altKey) {
        this.toggle("ui");
      }
      if (["h", "H"].includes(e.key) && e.ctrlKey && e.altKey) {
        this.toggle("hintsPanel");
      }
    });
  }

  toggle(id: string) {
    const ui = document.getElementById(id);
    console.log("TOGGLE", ui?.className.includes("hidden"));
    if (ui?.className.includes("hidden")) {
      ui.className = ui.className.replace("hidden", "");
    } else {
      ui!.className += " hidden";
    }
  }
}
