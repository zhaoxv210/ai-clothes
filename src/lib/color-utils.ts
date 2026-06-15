type RGB = [number, number, number]

const rgbToHex = ([r, g, b]: RGB): string =>
  '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')

export async function extractColors(
  imageData: string,
  count: number = 4
): Promise<string[]> {
  if (typeof window === 'undefined') return []

  const ColorThief = (await import('color-thief-browser')).default
  const img = new Image()
  img.crossOrigin = 'anonymous'

  return new Promise((resolve) => {
    img.onload = () => {
      try {
        const ct = new ColorThief()
        const palette: RGB[] = ct.getPalette(img, count)
        resolve(palette.map(rgbToHex))
      } catch {
        resolve(['#808080'])
      }
    }
    img.onerror = () => resolve(['#808080'])
    img.src = imageData
  })
}
