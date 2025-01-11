import { md5 } from "js-md5";

export const ASSETS_MAP: Record<string, string> = {};

export const getAsset = (key: string): string => {
  return ASSETS_MAP[key]!;
};

export const cacheAsset = (content: string): string => {
  const key = md5(content);
  ASSETS_MAP[key] = content;
  return key;
};

export const rebuildAssets = (map: Record<string, string>) => {
  for (const key in map) {
    ASSETS_MAP[key] = map[key];
  }
};
