import { md5 } from "js-md5";

export const ASSETS_MAP: Record<string, string> = {};
export const ASSETS_CLIENTS: Record<string, number[]> = {};

export const getAsset = (key: string, layerId: number): string => {
  ASSETS_CLIENTS[key] ||= [];
  if (ASSETS_CLIENTS[key].indexOf(layerId) === -1) {
    ASSETS_CLIENTS[key].push(layerId);
  }
  return ASSETS_MAP[key]!;
};

export const freeAsset = (key: string, layerId: number) => {
  const index = ASSETS_CLIENTS[key].indexOf(layerId);
  ASSETS_CLIENTS[key].splice(index, 1);

  console.log(key, layerId, ASSETS_CLIENTS[key]);
  if (ASSETS_CLIENTS[key].length === 0) {
    delete ASSETS_MAP[key];
    delete ASSETS_CLIENTS[key];
  }
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
