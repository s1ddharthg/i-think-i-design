// Shared handle: MusicToggle creates the analyser on first play,
// ScrollVisualizer reads it every frame if present.
export const audioBus: { analyser: AnalyserNode | null; data: Uint8Array<ArrayBuffer> | null } = {
  analyser: null,
  data: null,
};
