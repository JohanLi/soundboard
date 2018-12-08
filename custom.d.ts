declare module '*.css' {
  const css: any;
  export default css;
}

interface HTMLAudioElement {
  setSinkId(id: string): Promise<undefined>;
}
