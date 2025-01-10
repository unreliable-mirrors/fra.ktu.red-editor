import { FrakturedEditor } from "./fraktured_editor";
import "./style.css";
import EventDispatcher from "./ktu/ui/core/event_dispatcher";
import { LayersList } from "./ktu/ui/components/layers/layers_list";
import { ExportStateButtonComponent } from "./ktu/ui/components/file/export_state";
import { ImportStateButtonComponent } from "./ktu/ui/components/file/import_state";
import { ShadersList } from "./ktu/ui/components/layers/shaders_list";
import { NewStateButtonComponent } from "./ktu/ui/components/file/new_state_button";
import { OpenStateButtonComponent } from "./ktu/ui/components/file/open_state";
import { HintPanel } from "./ktu/ui/components/hint_panel";
import { ExportCanvasButtonComponent } from "./ktu/ui/components/file/export_canvas";

declare global {
  interface Window {
    EventDispatcher: EventDispatcher;
  }
}

const editor = new FrakturedEditor(
  document.getElementById("canvas")!,
  document.getElementById("ui")!
);
document.getElementById("start-app")?.addEventListener("click", () => {
  //@ts-ignore
  window.KTUFullscreen();
});

//@ts-ignore
window.KTUFullscreen = () => {
  document.querySelector(".splash")!.className += " hidden";
  document.documentElement.requestFullscreen();
  document.addEventListener("fullscreenchange", () => {
    if (!editor.live) {
      console.log("FS HEIGHT", window.innerHeight);
      document.getElementById("app")!.className = document
        .getElementById("app")!
        .className.replace("hidden", "");
      editor.init();
    }
  });
};

export default {
  LayersList,
  ExportStateButtonComponent,
  ImportStateButtonComponent,
  ShadersList,
  NewStateButtonComponent,
  OpenStateButtonComponent,
  HintPanel,
  ExportCanvasButtonComponent,
};
