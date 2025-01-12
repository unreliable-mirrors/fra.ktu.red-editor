import jsx from "texsaur";

import { BackgroundLayer } from "../layers/background_layer";
import { DrawLayer } from "../layers/draw_layer";
import { ImageLayer } from "../layers/image_layer";
import { TextLayer } from "../layers/text_layer";
import EventDispatcher from "../ui/core/event_dispatcher";

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
  payload?: any;
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
      keyHint: "1",
      globalHint: "New Background Layer",
      command: "add_layer",
      payload: BackgroundLayer.LAYER_NAME,
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
      payload: DrawLayer.LAYER_NAME,
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
      payload: ImageLayer.LAYER_NAME,
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
      payload: TextLayer.LAYER_NAME,
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
      keyHint: "4",
      globalHint: "New Background Layer",
      command: "add_layer",
      payload: TextLayer.LAYER_NAME,
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
      keyHint: "PgUp",
      globalHint: "Move Active Layer/Shader Up",
      command: "moveUp",
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

export const getShortcutText = (command: string): Element => {
  return (
    <>
      <strong>{SHORTCUTS_DICTIONARY[command].meta.keyHint}</strong>:{" "}
      {SHORTCUTS_DICTIONARY[command].meta.globalHint}
    </>
  );
};

export const listenKeyboardEvents = () => {
  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (!(e.target instanceof HTMLInputElement)) {
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
            is.meta.payload
          );
        }
      }
    }
  });
};
