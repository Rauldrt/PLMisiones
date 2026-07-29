/**
 * Compresses an image client-side using HTML Canvas.
 * Returns a base64 string of the compressed image.
 */
export function compressImage(
  base64Str: string,
  maxWidth = 2048,
  maxHeight = 2048,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return resolve(base64Str); // Fallback if server-side
    }

    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return resolve(base64Str); // Fallback
      }

      ctx.drawImage(img, 0, 0, width, height);

      // We export to jpeg with a given quality
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };

    img.onerror = (err) => {
      reject(err);
    };
  });
}
