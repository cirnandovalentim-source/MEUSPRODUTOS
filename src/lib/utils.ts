import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1583947581924-860bda6a5a83?auto=format&fit=crop&q=80&w=400';

/**
 * Resizes and compresses an uploaded image File using HTML5 Canvas to produce a lightweight Data URL.
 * Prevents Firestore payload size limits (1MB) and ensures fast loading.
 */
export function compressImageFile(
  file: File,
  maxDimension = 800,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('O arquivo selecionado não é uma imagem válida.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo de imagem.'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Erro ao processar a imagem.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Formats and validates image URLs or Base64 encoded strings stored in Firestore.
 * Handles arrays of strings, raw Base64 strings missing data headers, HTTP/HTTPS URLs, and empty values.
 */
export function getImageUrl(
  imageSource?: string | string[] | null,
  fallback: string = DEFAULT_PRODUCT_IMAGE
): string {
  if (!imageSource) return fallback;

  let raw = '';
  if (Array.isArray(imageSource)) {
    if (imageSource.length === 0) return fallback;
    raw = imageSource[0];
  } else {
    raw = imageSource;
  }

  if (typeof raw !== 'string') return fallback;
  const trimmed = raw.trim();
  if (!trimmed) return fallback;

  // Check if it's already a complete HTTP/HTTPS URL, Data URI, or Blob URL
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Handle raw Base64 string missing 'data:image/...;base64,' prefix
  if (/^[A-Za-z0-9+/=]+$/.test(trimmed.substring(0, 100))) {
    if (trimmed.startsWith('iVBORw0KGgo')) {
      return `data:image/png;base64,${trimmed}`;
    }
    if (trimmed.startsWith('/9j/')) {
      return `data:image/jpeg;base64,${trimmed}`;
    }
    if (trimmed.startsWith('R0lGOD')) {
      return `data:image/gif;base64,${trimmed}`;
    }
    if (trimmed.startsWith('UklGR')) {
      return `data:image/webp;base64,${trimmed}`;
    }
    return `data:image/png;base64,${trimmed}`;
  }

  return trimmed;
}

