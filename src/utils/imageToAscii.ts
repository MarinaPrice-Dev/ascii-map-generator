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
            const color = getAverageColor(imageData, startX, startY, regionW, regionH);
            
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
            
            // Get ASCII character based on brightness
            const asciiChar = getAsciiChar(adjustedBrightness, options.invert);
            
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
    return {
      newCellSize: Math.max(10, currentCellSize),
      newRows: Math.floor(availableHeight / Math.max(10, currentCellSize)),
      newCols: Math.floor(availableWidth / Math.max(10, currentCellSize))
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
  const cellSizeForCols = availableWidth / targetCols;
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