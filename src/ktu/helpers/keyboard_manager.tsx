import jsx from "texsaur";

import { BackgroundLayer } from "../layers/background_layer";
import { DrawLayer } from "../layers/draw_layer";
import { ImageLayer } from "../layers/image_layer";
import { TextLayer } from "../layers/text_layer";
import EventDispatcher from "../ui/core/event_dispatcher";
import DataStore from "../ui/core/data_store";
import { ShapeLayer } from "../layers/shape_layer";

export type ShortcutSetting = {
  key: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
};
export type ShortcutMeta = {
  keyHint: string;
  globalHint: string;
  command: string;
  payload?: Function;
};
export type ShortcutConfigSetting = {
  meta: ShortcutMeta;
  shortcuts: ShortcutSetting[];
};

export const ctrlKey = (): string => {
  if (
    navigator.platform.indexOf("Mac") === 0 ||
    navigator.platform === "iPhone"
  ) {
    return "⌘";
  } else {
    return "CTRL";
  }
};

export const altKey = (): string => {
  if (
    navigator.platform.indexOf("Mac") === 0 ||
    navigator.platform === "iPhone"
  ) {
    return "Option";
  } else {
    return "ALT";
  }
};

export const SHORTCUTS: ShortcutConfigSetting[] = [
  {
    meta: {
      keyHint: "H",
      globalHint: "Toggle Help",
      command: "toggleHints",
    },
    shortcuts: [
      {
        key: "H",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
      {
        key: "h",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
    ],
  },
  {
    meta: {
      keyHint: "L",
      globalHint: "Toggle Layers Panel",
      command: "toggleLayers",
    },
    shortcuts: [
      {
        key: "L",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
      {
        key: "l",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
    ],
  },
  {
    meta: {
      keyHint: "S",
      globalHint: "Toggle Shaders Panel",
      command: "toggleShaders",
    },
    shortcuts: [
      {
        key: "S",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
      {
        key: "s",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
    ],
  },
  {
    meta: {
      keyHint: "M",
      globalHint: "Toggle Modulators Panel",
      command: "toggleModulators",
    },
    shortcuts: [
      {
        key: "M",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
      {
        key: "m",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
    ],
  },
  {
    meta: {
      keyHint: "F",
      globalHint: "Toggle File Panel",
      command: "toggleFiles",
    },
    shortcuts: [
      {
        key: "F",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
      {
        key: "f",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
    ],
  },
  {
    meta: {
      keyHint: "Tab",
      globalHint: "Toggle UI",
      command: "toggleUI",
    },
    shortcuts: [
      {
        key: "Tab",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
    ],
  },
  {
    meta: {
      keyHint: `${ctrlKey()} + V`,
      globalHint: "Paste Image",
      command: "PASTEIMAGE",
    },
    shortcuts: [],
  },
  {
    meta: {
      keyHint: `${ctrlKey()} + CLICK`,
      globalHint: "Drag the Active Layer even if it's under another one",
      command: "DRAGLAYER",
    },
    shortcuts: [],
  },
  {
    meta: {
      keyHint: "1",
      globalHint: "New Background Layer",
      command: "add_layer",
      payload: () => BackgroundLayer.LAYER_NAME,
    },
    shortcuts: [
      {
        key: "1",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
    ],
  },
  {
    meta: {
      keyHint: "2",
      globalHint: "New Draw Layer",
      command: "add_layer",
      payload: () => DrawLayer.LAYER_NAME,
    },
    shortcuts: [
      {
        key: "2",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
    ],
  },
  {
    meta: {
      keyHint: "3",
      globalHint: "New Background Layer",
      command: "add_layer",
      payload: () => ImageLayer.LAYER_NAME,
    },
    shortcuts: [
      {
        key: "3",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
    ],
  },
  {
    meta: {
      keyHint: "4",

      globalHint: "New Background Layer",
      command: "add_layer",
      payload: () => TextLayer.LAYER_NAME,
    },
    shortcuts: [
      {
        key: "4",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
    ],
  },
  {
    meta: {
      keyHint: "5",

      globalHint: "New Shape Layer",
      command: "add_layer",
      payload: () => ShapeLayer.LAYER_NAME,
    },
    shortcuts: [
      {
        key: "5",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
    ],
  },
  {
    meta: {
      keyHint: "PgUp",
      globalHint: "Move Active Layer/Shader Up",
      command: "moveUp",
      payload: () => DataStore.getInstance().getStore("activeLayer"),
    },
    shortcuts: [
      {
        key: "PageUp",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
    ],
  },
  {
    meta: {
      keyHint: "PgDown",
      globalHint: "Move Active Layer/Shader Down",
      command: "moveDown",
      payload: () => DataStore.getInstance().getStore("activeLayer"),
    },
    shortcuts: [
      {
        key: "PageDown",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
    ],
  },
  {
    meta: {
      keyHint: "Shift + PgUp",
      globalHint: "Move Active Layer/Shader to Top",
      command: "moveToTop",
      payload: () => DataStore.getInstance().getStore("activeLayer"),
    },
    shortcuts: [
      {
        key: "PageUp",
        ctrlKey: false,
        shiftKey: true,
        altKey: false,
        metaKey: false,
      },
    ],
  },
  {
    meta: {
      keyHint: "Shift + PgDown",
      globalHint: "Move Active Layer/Shader to Bottom",
      command: "moveToBottom",
      payload: () => DataStore.getInstance().getStore("activeLayer"),
    },
    shortcuts: [
      {
        key: "PageDown",
        ctrlKey: false,
        shiftKey: true,
        altKey: false,
        metaKey: false,
      },
    ],
  },
  {
    meta: {
      keyHint: `${ctrlKey()} + D`,
      globalHint: "Duplicate Active Layer/Shader",
      command: "duplicate",
      payload: () => DataStore.getInstance().getStore("activeLayer"),
    },
    shortcuts: [
      {
        key: "D",
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
      {
        key: "D",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: true,
      },
      {
        key: "d",
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
      {
        key: "d",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: true,
      },
    ],
  },
  {
    meta: {
      keyHint: `DELETE`,
      globalHint: "Remove Layer",
      command: "removeLayerShader",
      payload: () => DataStore.getInstance().getStore("activeLayer"),
    },
    shortcuts: [
      {
        key: "Delete",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
      {
        key: "Backspace",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
    ],
  },
  {
    meta: {
      keyHint: `${ctrlKey()} + N`,
      globalHint: "New File",
      command: "newState",
    },
    shortcuts: [
      {
        key: "N",
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
      {
        key: "N",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: true,
      },
      {
        key: "n",
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
      {
        key: "n",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: true,
      },
    ],
  },
  {
    meta: {
      keyHint: `${ctrlKey()} + 0`,
      globalHint: "Reset Zoom",
      command: "resetZoom",
    },
    shortcuts: [
      {
        key: "0",
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
      {
        key: "0",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: true,
      },
    ],
  },
  {
    meta: {
      keyHint: `${ctrlKey()} + +`,
      globalHint: "Zoom In",
      command: "zoomIn",
    },
    shortcuts: [
      {
        key: "+",
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
      {
        key: "+",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: true,
      },
    ],
  },
  {
    meta: {
      keyHint: `${ctrlKey()} + -`,
      globalHint: "Zoom Out",
      command: "zoomOut",
    },
    shortcuts: [
      {
        key: "-",
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        metaKey: false,
      },
      {
        key: "-",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        metaKey: true,
      },
    ],
  },
];

export const INVERTED_SHORTCUTS: {
  shortcut: ShortcutSetting;
  meta: ShortcutMeta;
}[] = [];

export const SHORTCUTS_DICTIONARY: Record<string, ShortcutConfigSetting> = {};

for (const shortcutSetting of SHORTCUTS) {
  SHORTCUTS_DICTIONARY[shortcutSetting.meta.command] = shortcutSetting;
  for (const shortcut of shortcutSetting.shortcuts) {
    INVERTED_SHORTCUTS.push({ shortcut: shortcut, meta: shortcutSetting.meta });
  }
}

export class KeyboardManager {
  static spacePressed: boolean = false;

  static getShortcutText(command: string): Element {
    return (
      <>
        <strong>{SHORTCUTS_DICTIONARY[command].meta.keyHint}</strong>:{" "}
        {SHORTCUTS_DICTIONARY[command].meta.globalHint}
      </>
    );
  }

  static listenKeyboardEvents() {
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (!(e.target instanceof HTMLInputElement)) {
        if (e.key == " ") {
          KeyboardManager.spacePressed = true;
        }
        for (const is of INVERTED_SHORTCUTS) {
          if (
            is.shortcut.key === e.key &&
            is.shortcut.ctrlKey === e.ctrlKey &&
            is.shortcut.shiftKey === e.shiftKey &&
            is.shortcut.altKey === e.altKey &&
            is.shortcut.metaKey === e.metaKey
          ) {
            e.preventDefault();
          }
        }
      }
    });

    document.addEventListener("keyup", (e: KeyboardEvent) => {
      if (!(e.target instanceof HTMLInputElement)) {
        if (e.key == " ") {
          KeyboardManager.spacePressed = false;
        }
        for (const is of INVERTED_SHORTCUTS) {
          if (
            is.shortcut.key === e.key &&
            is.shortcut.ctrlKey === e.ctrlKey &&
            is.shortcut.shiftKey === e.shiftKey &&
            is.shortcut.altKey === e.altKey &&
            is.shortcut.metaKey === e.metaKey
          ) {
            EventDispatcher.getInstance().dispatchEvent(
              "scene",
              is.meta.command,
              is.meta.payload ? is.meta.payload() : undefined
            );
          }
        }
      }
    });
  }

  static keyboardExists(): boolean {
    return !(
      [
        "iPad Simulator",
        "iPhone Simulator",
        "iPod Simulator",
        "iPad",
        "iPhone",
        "iPod",
      ].includes(navigator.platform) ||
      navigator.userAgent.toLowerCase().indexOf("android") > -1
    );
  }
}
