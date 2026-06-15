declare module 'color-thief-browser' {
  interface ColorThief {
    getColor(image: HTMLImageElement): [number, number, number]
    getPalette(image: HTMLImageElement, colorCount?: number): [number, number, number][]
  }
  const ColorThief: new () => ColorThief
  export default ColorThief
}
