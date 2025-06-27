// src/utils/imageLoader.ts
export const loadImageFromPublic = async (
  relativePath: string
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Important for local files

    // Construct absolute path to public folder
    const publicPath = `${window.location.origin}/${relativePath.replace(
      /^\//,
      ""
    )}`;
    img.src = publicPath;

    img.onload = () => {
      console.log(`Successfully loaded: ${publicPath}`);
      resolve(img);
    };

    img.onerror = (e) => {
      console.error(`Failed to load image: ${publicPath}`, e);
      reject(new Error(`Image load failed for ${publicPath}`));
    };
  });
};
