import Vibrant from 'node-vibrant';

export async function extractColors(imageSrc: string): Promise<string[]> {
  try {
    // node-vibrant works well in browser too
    const palette = await Vibrant.from(imageSrc).getPalette();
    const colors: string[] = [];

    // Extract hex values from the standard Vibrant swatches
    if (palette.Vibrant) colors.push(palette.Vibrant.getHex());
    if (palette.Muted) colors.push(palette.Muted.getHex());
    if (palette.DarkVibrant) colors.push(palette.DarkVibrant.getHex());
    if (palette.DarkMuted) colors.push(palette.DarkMuted.getHex());
    if (palette.LightVibrant) colors.push(palette.LightVibrant.getHex());
    if (palette.LightMuted) colors.push(palette.LightMuted.getHex());

    // Deduplicate
    return [...new Set(colors)];
  } catch (error) {
    console.error("Color extraction failed:", error);
    return [];
  }
}
