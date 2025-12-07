import tinycolor from 'tinycolor2';

export const getContrastColor = (hex: string): 'black' | 'white' => {
  return tinycolor(hex).isLight() ? 'black' : 'white';
};

export const getContrastRatio = (color1: string, color2: string): number => {
  return tinycolor.readability(color1, color2);
};

export const isAccessible = (color1: string, color2: string): boolean => {
  return tinycolor.isReadable(color1, color2, { level: "AA", size: "small" });
};
