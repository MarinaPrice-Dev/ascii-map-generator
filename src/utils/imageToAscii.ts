import type { Cell } from '../types/cell';

interface ImageToAsciiOptions {
  targetRows?: number;
  targetCols?: number;
  colorMode?: 'smart' |'foreground' | 'background';
  contrast?: number;
  invert?: boolean;
  brightness?: number;
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

// Calculate contrast ratio between two colors
const getContrastRatio = (color1: { r: number; g: number; b: number }, color2: { r: number; g: number; b: number }): number => {
  const brightness1 = getBrightness(color1.r, color1.g, color1.b);
  const brightness2 = getBrightness(color2.r, color2.g, color2.b);
  const lighter = Math.max(brightness1, brightness2);
  const darker = Math.min(brightness1, brightness2);
  return (lighter + 0.05) / (darker + 0.05);
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

// Generate a complementary foreground color based on background color
const getComplementaryForeground = (bgColor: { r: number; g: number; b: number }): string => {
  // Calculate complementary color (opposite on color wheel)
  const compR = 255 - bgColor.r;
  const compG = 255 - bgColor.g;
  const compB = 255 - bgColor.b;
  
  // Adjust brightness to ensure good contrast
  const bgBrightness = getBrightness(bgColor.r, bgColor.g, bgColor.b);
  const compBrightness = getBrightness(compR, compG, compB);
  
  if (Math.abs(bgBrightness - compBrightness) < 50) {
    // If contrast is too low, adjust the complementary color
    if (bgBrightness > 128) {
      // Darken the complementary color
      return rgbToHex(compR * 0.7, compG * 0.7, compB * 0.7);
    } else {
      // Lighten the complementary color
      return rgbToHex(Math.min(255, compR * 1.3), Math.min(255, compG * 1.3), Math.min(255, compB * 1.3));
    }
  }
  
  return rgbToHex(compR, compG, compB);
};

// Get the best foreground color for a given background
const getOptimalForeground = (bgColor: { r: number; g: number; b: number }): string => {
  const bgBrightness = getBrightness(bgColor.r, bgColor.g, bgColor.b);
  
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
  const avgA = totalA / nonTransparentPixels;
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
  targetCellSize: number = 10
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