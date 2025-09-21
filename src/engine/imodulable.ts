export interface IModulable {
  getUniqueId(): number;
  pushModulator(field: string, modulatorId: number): void;
}
