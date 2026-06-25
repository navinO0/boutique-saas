import API_BASE_URL from '../config/api';

/**
 * Resolves the image URL.
 * If the path starts with http, returns as is.
 * Otherwise, prefixes with the backend source URL.
 * Also appends Cloudinary optimization parameters if applicable.
 */
export const resolveImageUrl = (path) => {
  if (!path) return '';
  
  if (path.startsWith('http')) {
    // If it's a Cloudinary URL, inject optimization parameters for faster fetching
    if (path.includes('cloudinary.com') && path.includes('/upload/') && !path.includes('/upload/q_auto,f_auto')) {
      return path.replace('/upload/', '/upload/q_auto,f_auto/');
    }
    return path;
  }
  
  // The backend base URL is usually one level up from /api
  const serverBase = API_BASE_URL.replace('/api', '');
  return `${serverBase}${path.startsWith('/') ? '' : '/'}${path}`;
};

/**
 * Compresses an image file using the Canvas API.
 * @param {File} file - The original image file.
 * @param {number} maxWidth - Maximum width/height of the output image.
 * @param {number} quality - Compression quality (0 to 1).
 * @returns {Promise<File|Blob>} - The compressed image as a File object (JPEG).
 */
export const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    // Skip compression for GIFs as Canvas doesn't support multi-frame animations
    if (file.type === 'image/gif') {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = (height / width) * maxWidth;
            width = maxWidth;
          } else {
            width = (width / height) * maxWidth;
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // Use high-quality image scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Image compression failed: Canvas to Blob failed'));
            }
            // Create a new File object from the blob
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            
            // Only return compressed if it's actually smaller (sometimes very small files get slightly larger)
            if (compressedFile.size < file.size) {
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
