import type { Cell } from '../types/cell';

interface ImageToAsciiOptions {
  targetRows?: number;
  targetCols?: number;
  colorMode?: 'smart' |'foreground' | 'background';
  contrast?: number;
  invert?: boolean;
  brightness?: number;
  saturation?: number;
  hue?: number;
  sepia?: number;
  grayscale?: number;
  characterDensity?: number;
  edgeDetection?: number;
  threshold?: number;
  dithering?: number;
  vignette?: number;
  grain?: number;
  blur?: number;
  sharpen?: number;
  pixelate?: number;
  posterize?: number;
  vibrance?: number;
  temperature?: number;
  exposure?: number;
  highlights?: number;
  shadows?: number;
  whites?: number;
  blacks?: number;
}

const DEFAULT_FG = '#FFFFFF';
const DEFAULT_BG = '#222222';

// ASCII characters ordered by density (from light to dark)
const ASCII_CHARS = ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';

// Convert RGB values to hex color
const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Calculate brightness from RGB values
const getBrightness = (r: number, g: number, b: number): number => {
  // Using luminance formula for better perceived brightness
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

// Generate a contrasting foreground color based on background color
const getContrastingForeground = (bgColor: { r: number; g: number; b: number }): string => {
  const bgBrightness = getBrightness(bgColor.r, bgColor.g, bgColor.b);
  
  // If background is dark, use a light foreground
  if (bgBrightness < 128) {
    // Generate a light color that complements the background
    const lightR = Math.min(255, bgColor.r + 100);
    const lightG = Math.min(255, bgColor.g + 100);
    const lightB = Math.min(255, bgColor.b + 100);
    return rgbToHex(lightR, lightG, lightB);
  } else {
    // If background is light, use a dark foreground
    const darkR = Math.max(0, bgColor.r - 100);
    const darkG = Math.max(0, bgColor.g - 100);
    const darkB = Math.max(0, bgColor.b - 100);
    return rgbToHex(darkR, darkG, darkB);
  }
};

// Get the best foreground color for a given background
const getOptimalForeground = (bgColor: { r: number; g: number; b: number }): string => {
  // Always use contrasting foreground for background mode
  return getContrastingForeground(bgColor);
};

// Adjust contrast of a value
const adjustContrast = (value: number, contrast: number): number => {
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  return Math.max(0, Math.min(255, factor * (value - 128) + 128));
};

// Adjust brightness of a value
const adjustBrightness = (value: number, brightness: number): number => {
  return Math.max(0, Math.min(255, value + brightness));
};

// Adjust saturation of RGB values
const adjustSaturation = (r: number, g: number, b: number, saturation: number): { r: number; g: number; b: number } => {
  const factor = 1 + (saturation / 100);
  const gray = 0.299 * r + 0.587 * g + 0.114 * b;
  
  return {
    r: Math.max(0, Math.min(255, gray + factor * (r - gray))),
    g: Math.max(0, Math.min(255, gray + factor * (g - gray))),
    b: Math.max(0, Math.min(255, gray + factor * (b - gray)))
  };
};

// Adjust hue of RGB values
const adjustHue = (r: number, g: number, b: number, hue: number): { r: number; g: number; b: number } => {
  // Normalize RGB values to 0-1
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  
  // Convert RGB to HSL
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;
  const lightness = (max + min) / 2;
  
  let h = 0;
  let s = 0;
  
  if (delta !== 0) {
    s = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    
    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta) % 6;
    } else if (max === gNorm) {
      h = (bNorm - rNorm) / delta + 2;
    } else {
      h = (rNorm - gNorm) / delta + 4;
    }
    h *= 60;
  }
  
  // Adjust hue
  h = (h + hue + 360) % 360;
  
  // Convert back to RGB
  const hueToRgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  let newR, newG, newB;
  
  if (s === 0) {
    // Achromatic (gray)
    newR = newG = newB = lightness;
  } else {
    const q = lightness < 0.5 ? lightness * (1 + s) : lightness + s - lightness * s;
    const p = 2 * lightness - q;
    const hNorm = h / 360;
    
    newR = hueToRgb(p, q, hNorm + 1/3);
    newG = hueToRgb(p, q, hNorm);
    newB = hueToRgb(p, q, hNorm - 1/3);
  }
  
  return {
    r: Math.max(0, Math.min(255, newR * 255)),
    g: Math.max(0, Math.min(255, newG * 255)),
    b: Math.max(0, Math.min(255, newB * 255))
  };
};

// Apply sepia effect to RGB values
const applySepia = (r: number, g: number, b: number, sepia: number): { r: number; g: number; b: number } => {
  const factor = sepia / 100;
  const newR = r * (1 - 0.607 * factor) + g * 0.769 * factor + b * 0.189 * factor;
  const newG = r * 0.349 * factor + g * (1 - 0.314 * factor) + b * 0.168 * factor;
  const newB = r * 0.272 * factor + g * 0.534 * factor + b * (1 - 0.869 * factor);
  
  return {
    r: Math.max(0, Math.min(255, newR)),
    g: Math.max(0, Math.min(255, newG)),
    b: Math.max(0, Math.min(255, newB))
  };
};

// Apply grayscale effect to RGB values
const applyGrayscale = (r: number, g: number, b: number, grayscale: number): { r: number; g: number; b: number } => {
  if (grayscale === 0) {
    return { r, g, b };
  }
  
  const factor = Math.abs(grayscale) / 100;
  const grayValue = 0.299 * r + 0.587 * g + 0.114 * b; // Standard luminance formula
  
  if (grayscale > 0) {
    // Convert to grayscale
    const newR = r + (grayValue - r) * factor;
    const newG = g + (grayValue - g) * factor;
    const newB = b + (grayValue - b) * factor;
    
    return {
      r: Math.max(0, Math.min(255, newR)),
      g: Math.max(0, Math.min(255, newG)),
      b: Math.max(0, Math.min(255, newB))
    };
  } else {
    // Convert from grayscale (add color back)
    const newR = r + (r - grayValue) * factor;
    const newG = g + (g - grayValue) * factor;
    const newB = b + (b - grayValue) * factor;
    
    return {
      r: Math.max(0, Math.min(255, newR)),
      g: Math.max(0, Math.min(255, newG)),
      b: Math.max(0, Math.min(255, newB))
    };
  }
};

// Apply vibrance effect (selective saturation)
const applyVibrance = (r: number, g: number, b: number, vibrance: number): { r: number; g: number; b: number } => {
  if (vibrance === 0) return { r, g, b };
  
  const factor = 1 + (vibrance / 100);
  const gray = 0.299 * r + 0.587 * g + 0.114 * b;
  
  // More selective than regular saturation
  const saturation = Math.max(r, g, b) - Math.min(r, g, b);
  const selectiveFactor = saturation < 50 ? factor * 1.5 : factor;
  
  return {
    r: Math.max(0, Math.min(255, gray + selectiveFactor * (r - gray))),
    g: Math.max(0, Math.min(255, gray + selectiveFactor * (g - gray))),
    b: Math.max(0, Math.min(255, gray + selectiveFactor * (b - gray)))
  };
};

// Apply temperature effect (warm/cool)
const applyTemperature = (r: number, g: number, b: number, temperature: number): { r: number; g: number; b: number } => {
  if (temperature === 0) return { r, g, b };
  
  const factor = temperature / 100;
  const warmR = 255 * 0.1 * factor;
  const warmG = 255 * 0.05 * factor;
  const coolB = 255 * 0.15 * factor;
  
  return {
    r: Math.max(0, Math.min(255, r + warmR)),
    g: Math.max(0, Math.min(255, g + warmG)),
    b: Math.max(0, Math.min(255, b + coolB))
  };
};

// Apply exposure adjustment
const applyExposure = (r: number, g: number, b: number, exposure: number): { r: number; g: number; b: number } => {
  if (exposure === 0) return { r, g, b };
  
  const factor = 1 + (exposure / 100);
  
  return {
    r: Math.max(0, Math.min(255, r * factor)),
    g: Math.max(0, Math.min(255, g * factor)),
    b: Math.max(0, Math.min(255, b * factor))
  };
};

// Apply highlights adjustment
const applyHighlights = (r: number, g: number, b: number, highlights: number): { r: number; g: number; b: number } => {
  if (highlights === 0) return { r, g, b };
  
  const brightness = getBrightness(r, g, b);
  const factor = highlights / 100;
  
  if (brightness > 128) {
    const adjustment = factor * (brightness - 128) / 128;
    return {
      r: Math.max(0, Math.min(255, r + adjustment * 255)),
      g: Math.max(0, Math.min(255, g + adjustment * 255)),
      b: Math.max(0, Math.min(255, b + adjustment * 255))
    };
  }
  
  return { r, g, b };
};

// Apply shadows adjustment
const applyShadows = (r: number, g: number, b: number, shadows: number): { r: number; g: number; b: number } => {
  if (shadows === 0) return { r, g, b };
  
  const brightness = getBrightness(r, g, b);
  const factor = shadows / 100;
  
  if (brightness < 128) {
    const adjustment = factor * (128 - brightness) / 128;
    return {
      r: Math.max(0, Math.min(255, r - adjustment * 255)),
      g: Math.max(0, Math.min(255, g - adjustment * 255)),
      b: Math.max(0, Math.min(255, b - adjustment * 255))
    };
  }
  
  return { r, g, b };
};

// Apply whites adjustment
const applyWhites = (r: number, g: number, b: number, whites: number): { r: number; g: number; b: number } => {
  if (whites === 0) return { r, g, b };
  
  const factor = whites / 100;
  const maxChannel = Math.max(r, g, b);
  
  if (maxChannel > 200) {
    const adjustment = factor * (maxChannel - 200) / 55;
    return {
      r: Math.max(0, Math.min(255, r + adjustment * 255)),
      g: Math.max(0, Math.min(255, g + adjustment * 255)),
      b: Math.max(0, Math.min(255, b + adjustment * 255))
    };
  }
  
  return { r, g, b };
};

// Apply blacks adjustment
const applyBlacks = (r: number, g: number, b: number, blacks: number): { r: number; g: number; b: number } => {
  if (blacks === 0) return { r, g, b };
  
  const factor = blacks / 100;
  const minChannel = Math.min(r, g, b);
  
  if (minChannel < 55) {
    const adjustment = factor * (55 - minChannel) / 55;
    return {
      r: Math.max(0, Math.min(255, r - adjustment * 255)),
      g: Math.max(0, Math.min(255, g - adjustment * 255)),
      b: Math.max(0, Math.min(255, b - adjustment * 255))
    };
  }
  
  return { r, g, b };
};

// Apply vignette effect
const applyVignette = (r: number, g: number, b: number, vignette: number, x: number, y: number, width: number, height: number): { r: number; g: number; b: number } => {
  if (vignette === 0) return { r, g, b };
  
  const centerX = width / 2;
  const centerY = height / 2;
  const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
  const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);
  const factor = 1 - (vignette / 100) * (distance / maxDistance);
  
  return {
    r: Math.max(0, Math.min(255, r * factor)),
    g: Math.max(0, Math.min(255, g * factor)),
    b: Math.max(0, Math.min(255, b * factor))
  };
};

// Apply grain effect
const applyGrain = (r: number, g: number, b: number, grain: number): { r: number; g: number; b: number } => {
  if (grain === 0) return { r, g, b };
  
  const factor = grain / 100;
  const noise = (Math.random() - 0.5) * 2 * factor * 50;
  
  return {
    r: Math.max(0, Math.min(255, r + noise)),
    g: Math.max(0, Math.min(255, g + noise)),
    b: Math.max(0, Math.min(255, b + noise))
  };
};

// Apply posterize effect
const applyPosterize = (r: number, g: number, b: number, posterize: number): { r: number; g: number; b: number } => {
  if (posterize === 0) return { r, g, b };
  
  const levels = Math.max(2, Math.floor(256 / (1 + posterize / 20)));
  const step = 256 / levels;
  
  return {
    r: Math.floor(r / step) * step,
    g: Math.floor(g / step) * step,
    b: Math.floor(b / step) * step
  };
};

// Apply blur to entire image
const applyBlurToImage = (imageData: ImageData, blur: number): ImageData => {
  const factor = blur / 100;
  const radius = Math.floor(factor * 10);
  
  if (radius <= 0) return imageData;
  
  const newData = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, count = 0;
      
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const index = (ny * width + nx) * 4;
            r += newData[index];
            g += newData[index + 1];
            b += newData[index + 2];
            count++;
          }
        }
      }
      
      const index = (y * width + x) * 4;
      newData[index] = r / count;
      newData[index + 1] = g / count;
      newData[index + 2] = b / count;
    }
  }
  
  return new ImageData(newData, width, height);
};

// Apply sharpen to entire image
const applySharpenToImage = (imageData: ImageData, sharpen: number): ImageData => {
  const factor = sharpen / 100;
  
  if (factor <= 0) return imageData;
  
  const newData = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const index = (y * width + x) * 4;
      
      for (let c = 0; c < 3; c++) {
        const current = newData[index + c];
        const neighbors = [
          newData[((y - 1) * width + x) * 4 + c],
          newData[((y + 1) * width + x) * 4 + c],
          newData[(y * width + x - 1) * 4 + c],
          newData[(y * width + x + 1) * 4 + c]
        ];
        
        const avg = neighbors.reduce((sum, val) => sum + val, 0) / 4;
        const sharpened = current + factor * (current - avg);
        newData[index + c] = Math.max(0, Math.min(255, sharpened));
      }
    }
  }
  
  return new ImageData(newData, width, height);
};

// Apply pixelate to entire image
const applyPixelateToImage = (imageData: ImageData, pixelate: number): ImageData => {
  const factor = pixelate / 100;
  const blockSize = Math.max(1, Math.floor(factor * 20));
  
  if (blockSize <= 1) return imageData;
  
  const newData = new Uint8ClampedArray(imageData.data);
  const width = imageData.width;
  const height = imageData.height;
  
  for (let y = 0; y < height; y += blockSize) {
    for (let x = 0; x < width; x += blockSize) {
      let r = 0, g = 0, b = 0, count = 0;
      
      // Calculate average color for this block
      for (let dy = 0; dy < blockSize && y + dy < height; dy++) {
        for (let dx = 0; dx < blockSize && x + dx < width; dx++) {
          const index = ((y + dy) * width + (x + dx)) * 4;
          r += newData[index];
          g += newData[index + 1];
          b += newData[index + 2];
          count++;
        }
      }
      
      const avgR = r / count;
      const avgG = g / count;
      const avgB = b / count;
      
      // Apply the average color to the entire block
      for (let dy = 0; dy < blockSize && y + dy < height; dy++) {
        for (let dx = 0; dx < blockSize && x + dx < width; dx++) {
          const index = ((y + dy) * width + (x + dx)) * 4;
          newData[index] = avgR;
          newData[index + 1] = avgG;
          newData[index + 2] = avgB;
        }
      }
    }
  }
  
  return new ImageData(newData, width, height);
};

// Get the closest ASCII character based on brightness
const getAsciiChar = (brightness: number, invert: boolean = false): string => {
  const normalizedBrightness = brightness / 255;
  const charIndex = invert 
    ? Math.floor(normalizedBrightness * (ASCII_CHARS.length - 1))
    : Math.floor((1 - normalizedBrightness) * (ASCII_CHARS.length - 1));
  
  return ASCII_CHARS[Math.max(0, Math.min(ASCII_CHARS.length - 1, charIndex))];
};

// Calculate the average color of a region in the image
const getAverageColor = (
  imageData: ImageData,
  startX: number,
  startY: number,
  width: number,
  height: number
): { r: number; g: number; b: number; brightness: number; isTransparent: boolean } => {
  let totalR = 0, totalG = 0, totalB = 0, totalA = 0;
  let pixelCount = 0;
  let transparentPixels = 0;

  // Ensure we don't go out of bounds
  const endX = Math.min(startX + width, imageData.width);
  const endY = Math.min(startY + height, imageData.height);
  const actualStartX = Math.max(0, startX);
  const actualStartY = Math.max(0, startY);

  for (let y = actualStartY; y < endY; y++) {
    for (let x = actualStartX; x < endX; x++) {
      const index = (y * imageData.width + x) * 4;
      const alpha = imageData.data[index + 3];
      
      if (alpha < 128) {
        // Consider pixel transparent if alpha is less than 50%
        transparentPixels++;
      } else {
        totalR += imageData.data[index];
        totalG += imageData.data[index + 1];
        totalB += imageData.data[index + 2];
        totalA += alpha;
      }
      pixelCount++;
    }
  }

  // Avoid division by zero
  if (pixelCount === 0) {
    return { r: 0, g: 0, b: 0, brightness: 0, isTransparent: true };
  }

  // Check if the region is mostly transparent
  const transparencyRatio = transparentPixels / pixelCount;
  const isTransparent = transparencyRatio > 0.5; // More than 50% transparent pixels

  if (isTransparent) {
    return { r: 0, g: 0, b: 0, brightness: 0, isTransparent: true };
  }

  // Calculate average color from non-transparent pixels
  const nonTransparentPixels = pixelCount - transparentPixels;
  if (nonTransparentPixels === 0) {
    return { r: 0, g: 0, b: 0, brightness: 0, isTransparent: true };
  }

  const avgR = totalR / nonTransparentPixels;
  const avgG = totalG / nonTransparentPixels;
  const avgB = totalB / nonTransparentPixels;
  const brightness = getBrightness(avgR, avgG, avgB);

  return { r: avgR, g: avgG, b: avgB, brightness, isTransparent: false };
};

// Convert image to ASCII art
export const imageToAscii = async (
  file: File,
  options: ImageToAsciiOptions = {}
): Promise<{
  grid: Cell[][];
  dimensions: { rows: number; cols: number };
}> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      try {
        // Set canvas size to image size
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image to canvas
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Apply image-level effects first (blur, sharpen, pixelate)
        let processedImageData = imageData;
        
        if (options.blur !== undefined && options.blur > 0) {
          processedImageData = applyBlurToImage(processedImageData, options.blur);
        }
        
        if (options.sharpen !== undefined && options.sharpen > 0) {
          processedImageData = applySharpenToImage(processedImageData, options.sharpen);
        }
        
        if (options.pixelate !== undefined && options.pixelate > 0) {
          processedImageData = applyPixelateToImage(processedImageData, options.pixelate);
        }
        
        // Calculate target dimensions
        const targetRows = options.targetRows || 50;
        const targetCols = options.targetCols || 50;
        
        // Calculate region size for each ASCII character
        const regionWidth = canvas.width / targetCols;
        const regionHeight = canvas.height / targetRows;
        
        // Create ASCII grid
        const grid: Cell[][] = [];
        
        for (let row = 0; row < targetRows; row++) {
          const gridRow: Cell[] = [];
          
          for (let col = 0; col < targetCols; col++) {
            const startX = Math.floor(col * regionWidth);
            const startY = Math.floor(row * regionHeight);
            const regionW = Math.ceil(regionWidth);
            const regionH = Math.ceil(regionHeight);
            
            // Get average color for this region
            const color = getAverageColor(processedImageData, startX, startY, regionW, regionH);
            
            // Handle transparent areas
            if (color.isTransparent) {
              // For transparent areas, use default colors and space character
              gridRow.push({
                char: ' ',
                fg: DEFAULT_FG,
                bg: DEFAULT_BG,
                selected: false
              });
              continue;
            }
            
            // Apply adjustments
            let adjustedBrightness = color.brightness;
            let adjustedR = color.r;
            let adjustedG = color.g;
            let adjustedB = color.b;
            
            if (options.contrast !== undefined) {
              adjustedBrightness = adjustContrast(adjustedBrightness, options.contrast);
              adjustedR = adjustContrast(adjustedR, options.contrast);
              adjustedG = adjustContrast(adjustedG, options.contrast);
              adjustedB = adjustContrast(adjustedB, options.contrast);
            }
            
            if (options.brightness !== undefined) {
              adjustedBrightness = adjustBrightness(adjustedBrightness, options.brightness);
              adjustedR = adjustBrightness(adjustedR, options.brightness);
              adjustedG = adjustBrightness(adjustedG, options.brightness);
              adjustedB = adjustBrightness(adjustedB, options.brightness);
            }
            
            if (options.saturation !== undefined && options.saturation !== 0) {
              const satResult = adjustSaturation(adjustedR, adjustedG, adjustedB, options.saturation);
              adjustedR = satResult.r;
              adjustedG = satResult.g;
              adjustedB = satResult.b;
            }
            
            if (options.hue !== undefined && options.hue !== 0) {
              const hueResult = adjustHue(adjustedR, adjustedG, adjustedB, options.hue);
              adjustedR = hueResult.r;
              adjustedG = hueResult.g;
              adjustedB = hueResult.b;
            }
            
            if (options.sepia !== undefined && options.sepia !== 0) {
              const sepiaResult = applySepia(adjustedR, adjustedG, adjustedB, options.sepia);
              adjustedR = sepiaResult.r;
              adjustedG = sepiaResult.g;
              adjustedB = sepiaResult.b;
            }
            
            if (options.grayscale !== undefined && options.grayscale !== 0) {
              const grayscaleResult = applyGrayscale(adjustedR, adjustedG, adjustedB, options.grayscale);
              adjustedR = grayscaleResult.r;
              adjustedG = grayscaleResult.g;
              adjustedB = grayscaleResult.b;
            }
            
            // Apply new color and tone effects
            if (options.vibrance !== undefined && options.vibrance !== 0) {
              const vibranceResult = applyVibrance(adjustedR, adjustedG, adjustedB, options.vibrance);
              adjustedR = vibranceResult.r;
              adjustedG = vibranceResult.g;
              adjustedB = vibranceResult.b;
            }
            
            if (options.temperature !== undefined && options.temperature !== 0) {
              const tempResult = applyTemperature(adjustedR, adjustedG, adjustedB, options.temperature);
              adjustedR = tempResult.r;
              adjustedG = tempResult.g;
              adjustedB = tempResult.b;
            }
            
            if (options.exposure !== undefined && options.exposure !== 0) {
              const exposureResult = applyExposure(adjustedR, adjustedG, adjustedB, options.exposure);
              adjustedR = exposureResult.r;
              adjustedG = exposureResult.g;
              adjustedB = exposureResult.b;
            }
            
            if (options.highlights !== undefined && options.highlights !== 0) {
              const highlightsResult = applyHighlights(adjustedR, adjustedG, adjustedB, options.highlights);
              adjustedR = highlightsResult.r;
              adjustedG = highlightsResult.g;
              adjustedB = highlightsResult.b;
            }
            
            if (options.shadows !== undefined && options.shadows !== 0) {
              const shadowsResult = applyShadows(adjustedR, adjustedG, adjustedB, options.shadows);
              adjustedR = shadowsResult.r;
              adjustedG = shadowsResult.g;
              adjustedB = shadowsResult.b;
            }
            
            if (options.whites !== undefined && options.whites !== 0) {
              const whitesResult = applyWhites(adjustedR, adjustedG, adjustedB, options.whites);
              adjustedR = whitesResult.r;
              adjustedG = whitesResult.g;
              adjustedB = whitesResult.b;
            }
            
            if (options.blacks !== undefined && options.blacks !== 0) {
              const blacksResult = applyBlacks(adjustedR, adjustedG, adjustedB, options.blacks);
              adjustedR = blacksResult.r;
              adjustedG = blacksResult.g;
              adjustedB = blacksResult.b;
            }
            
            // Apply artistic effects
            if (options.vignette !== undefined && options.vignette !== 0) {
              const vignetteResult = applyVignette(adjustedR, adjustedG, adjustedB, options.vignette, col, row, targetCols, targetRows);
              adjustedR = vignetteResult.r;
              adjustedG = vignetteResult.g;
              adjustedB = vignetteResult.b;
            }
            
            if (options.grain !== undefined && options.grain !== 0) {
              const grainResult = applyGrain(adjustedR, adjustedG, adjustedB, options.grain);
              adjustedR = grainResult.r;
              adjustedG = grainResult.g;
              adjustedB = grainResult.b;
            }
            
            if (options.posterize !== undefined && options.posterize !== 0) {
              const posterizeResult = applyPosterize(adjustedR, adjustedG, adjustedB, options.posterize);
              adjustedR = posterizeResult.r;
              adjustedG = posterizeResult.g;
              adjustedB = posterizeResult.b;
            }
            
            // Apply ASCII-specific effects
            let finalBrightness = adjustedBrightness;
            
            // Apply threshold adjustment
            if (options.threshold !== undefined && options.threshold !== 0) {
              const thresholdFactor = options.threshold / 100;
              const threshold = 128 + thresholdFactor * 128;
              finalBrightness = finalBrightness > threshold ? 255 : 0;
            }
            
            // Apply edge detection enhancement
            if (options.edgeDetection !== undefined && options.edgeDetection > 0) {
              // Simple edge detection by comparing with neighbors
              const edgeFactor = options.edgeDetection / 100;
              // This is a simplified edge detection - in a real implementation,
              // you'd want to apply this at the image level with proper convolution
              const edgeEnhancement = edgeFactor * 50;
              finalBrightness = Math.max(0, Math.min(255, finalBrightness + edgeEnhancement));
            }
            
            // Apply dithering effect
            if (options.dithering !== undefined && options.dithering > 0) {
              const ditherFactor = options.dithering / 100;
              const noise = (Math.random() - 0.5) * ditherFactor * 100;
              finalBrightness = Math.max(0, Math.min(255, finalBrightness + noise));
            }
            
            // Get ASCII character based on brightness and character density
            let asciiChar = getAsciiChar(finalBrightness, options.invert);
            
            // Apply character density adjustment
            if (options.characterDensity !== undefined && options.characterDensity > 0) {
              const densityFactor = options.characterDensity / 100;
              const charSet = ASCII_CHARS.substring(0, Math.max(2, Math.floor(ASCII_CHARS.length * densityFactor)));
              const charIndex = Math.floor((finalBrightness / 255) * (charSet.length - 1));
              asciiChar = charSet[Math.max(0, Math.min(charSet.length - 1, charIndex))];
            }
            
            // Convert RGB to hex color
            const hexColor = rgbToHex(adjustedR, adjustedG, adjustedB);
            
            // Determine foreground and background colors based on color mode
            let fg: string;
            let bg: string;
            
            switch (options.colorMode) {
              case 'foreground':
                fg = hexColor;
                bg = DEFAULT_BG;
                break;
              case 'background':
                bg = hexColor;
                fg = hexColor; // Same color as background
                break;
              case 'smart':
                bg = hexColor;
                fg = getOptimalForeground({ r: adjustedR, g: adjustedG, b: adjustedB });
                break;
              default:
                // Default to foreground color mode
                fg = hexColor;
                bg = DEFAULT_BG;
                break;
            }
            
            // Create cell
            gridRow.push({
              char: asciiChar,
              fg,
              bg,
              selected: false
            });
          }
          
          grid.push(gridRow);
        }
        
        // Clean up object URL
        URL.revokeObjectURL(objectUrl);
        
        resolve({
          grid,
          dimensions: { rows: targetRows, cols: targetCols }
        });
        
      } catch (error) {
        // Clean up object URL on error
        URL.revokeObjectURL(objectUrl);
        reject(error);
      }
    };
    
    img.onerror = () => {
      // Clean up object URL on error
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };
    
    // Set image source
    img.src = objectUrl;
  });
};

// Auto-zoom function to fit image optimally
export const calculateOptimalZoom = (
  imageWidth: number,
  imageHeight: number,
  currentCellSize: number,
  availableWidth: number,
  availableHeight: number,
): { newCellSize: number; newRows: number; newCols: number } => {
  // Ensure we have valid dimensions
  if (imageWidth <= 0 || imageHeight <= 0 || availableWidth <= 0 || availableHeight <= 0) {
    const cellWidth = Math.floor(Math.max(10, currentCellSize) * 0.5);
    return {
      newCellSize: Math.max(10, currentCellSize),
      newRows: Math.floor(availableHeight / Math.max(10, currentCellSize)),
      newCols: Math.floor(availableWidth / cellWidth)
    };
  }
  
  // Calculate aspect ratio of the image
  const imageAspectRatio = imageWidth / imageHeight;
  
  // Calculate how many cells we need for the image based on desired resolution
  // We want to maintain good detail, so we'll use a reasonable pixel-to-character ratio
  const pixelToCharRatio = 8; // 8 pixels per character for good detail
  
  let targetCols: number;
  let targetRows: number;
  
  if (imageAspectRatio > 1) {
    // Image is wider than tall
    targetCols = Math.max(20, Math.floor(imageWidth / pixelToCharRatio));
    targetRows = Math.floor(targetCols / imageAspectRatio);
  } else {
    // Image is taller than wide
    targetRows = Math.max(20, Math.floor(imageHeight / pixelToCharRatio));
    targetCols = Math.floor(targetRows * imageAspectRatio);
  }
  
  // Ensure minimum dimensions
  targetCols = Math.max(targetCols, 20);
  targetRows = Math.max(targetRows, 20);
  
  // Calculate the cell size needed to fit the image
  const cellSizeForCols = (availableWidth / targetCols) * 2; // Multiply by 2 because cell width is 0.5 * cellSize
  const cellSizeForRows = availableHeight / targetRows;
  
  // Use the smaller cell size to ensure the image fits in the viewport
  // But don't go below the minimum cell size
  const newCellSize = Math.max(10, Math.min(cellSizeForCols, cellSizeForRows));
  
  // If the calculated cell size is too small, we'll allow the grid to be larger than the viewport
  // This will enable scrollbars for navigation
  const finalCellSize = Math.max(10, newCellSize);
  
  // Use the target dimensions from the image, not constrained by viewport
  // This allows for scrollbars when the image is larger than the viewport
  return { 
    newCellSize: finalCellSize, 
    newRows: targetRows, 
    newCols: targetCols 
  };
}; 