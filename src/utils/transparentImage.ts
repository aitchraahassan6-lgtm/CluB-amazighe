/**
 * Utility to process images client-side and strip white/off-white backgrounds
 * to ensure 100% transparent PNG display across any background or theme.
 */

const transparentImageCache = new Map<string, string>();

export function makeImageTransparent(imgUrl: string): Promise<string> {
  return new Promise((resolve) => {
    if (!imgUrl) return resolve(imgUrl);
    if (transparentImageCache.has(imgUrl)) {
      return resolve(transparentImageCache.get(imgUrl)!);
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(imgUrl);

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // High brightness / near white pixel detection
          if (r > 228 && g > 228 && b > 228) {
            data[i + 3] = 0; // Fully transparent
          } else if (r > 200 && g > 200 && b > 200) {
            // Smooth edge blending
            const brightness = (r + g + b) / 3;
            const factor = Math.max(0, Math.min(1, (255 - brightness) / 55));
            data[i + 3] = Math.floor(data[i + 3] * factor);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const transparentDataUrl = canvas.toDataURL('image/png');
        transparentImageCache.set(imgUrl, transparentDataUrl);
        resolve(transparentDataUrl);
      } catch (err) {
        console.warn('Canvas transparency processing fallback:', err);
        resolve(imgUrl);
      }
    };
    img.onerror = () => resolve(imgUrl);
    img.src = imgUrl;
  });
}
