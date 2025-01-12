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
  pcHint: string;
  macHint: string;
  globalHint: string;
  command: string;
  feature: string;
  show: boolean;
  payload?: any;
};
export type ShortcutConfigSetting = {
  meta: ShortcutMeta;
  shortcuts: ShortcutSetting[];
};
export const SHORTCUTS: ShortcutConfigSetting[] = [
  {
    meta: {
      feature: "global",
      pcHint: "H",
      macHint: "H",
      globalHint: "Toggle Help",
      command: "toggleHints",
      show: true,
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
      feature: "global",
      pcHint: "Tab",
      macHint: "Tab",
      globalHint: "Toggle UI",
      command: "toggleUI",
      show: true,
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
      feature: "global",
      pcHint: "CTRL + V",
      macHint: "⌘ + V",
      globalHint: "Paste Image",
      command: "PASTEIMAGE",
      show: true,
    },
    shortcuts: [],
  },
  {
    meta: {
      feature: "global",
      pcHint: "1",
      macHint: "1",
      globalHint: "New Background Layer",
      command: "add_layer",
      payload: BackgroundLayer.LAYER_NAME,
      show: false,
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
      feature: "global",
      pcHint: "2",
      macHint: "2",
      globalHint: "New Draw Layer",
      command: "add_layer",
      payload: DrawLayer.LAYER_NAME,
      show: false,
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
      feature: "global",
      pcHint: "3",
      macHint: "3",
      globalHint: "New Background Layer",
      command: "add_layer",
      payload: ImageLayer.LAYER_NAME,
      show: false,
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
      feature: "global",
      pcHint: "4",
      macHint: "4",
      globalHint: "New Background Layer",
      command: "add_layer",
      payload: TextLayer.LAYER_NAME,
      show: false,
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
  if (
    navigator.platform.indexOf("Mac") === 0 ||
    navigator.platform === "iPhone"
  ) {
    return (
      <>
        <strong>{SHORTCUTS_DICTIONARY[command].meta.macHint}</strong>:{" "}
        {SHORTCUTS_DICTIONARY[command].meta.globalHint}
      </>
    );
  } else {
    return (
      <>
        <strong>{SHORTCUTS_DICTIONARY[command].meta.pcHint}</strong>:{" "}
        {SHORTCUTS_DICTIONARY[command].meta.globalHint}
      </>
    );
  }
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
