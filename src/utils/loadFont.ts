// export interface CustomFont {
//   [fontName: string]: {
//     normal: ArrayBuffer;
//     bold?: ArrayBuffer;
//     italic?: ArrayBuffer;
//     bolditalic?: ArrayBuffer;
//   };
// }

// export const registerCustomFont = async (): Promise<CustomFont> => {
//   const fontName = "Aloevera";

//   // Normal weight
//   try {
//     const [fontRegular, fontBold] = await Promise.all([
//       fetch("/fonts/Aloevera-Regular.ttf").then((r) => r.arrayBuffer()),
//       fetch("/fonts/Aloevera-Bold.ttf").then((r) => r.arrayBuffer()),
//     ]);

//     // const fontRegular = await fetch('/fonts/Aloevera-Regular.otf').then(r => r.arrayBuffer());
//     // const fontBold = await fetch('/fonts/Aloevera-Bold.otf').then(r => r.arrayBuffer());

//     return {
//       [fontName]: {
//         normal: fontRegular,
//         bold: fontBold,
//       },
//     };
//   } catch (error) {
//     console.error("Failed to load fonts:", error);
//     throw error;
//   }
// };

// Convert ArrayBuffer to Base64 string
const bufferToBase64 = (buffer: ArrayBuffer): string => {
  const binary = String.fromCharCode(...new Uint8Array(buffer));
  return btoa(binary);
};
/**
 * Fetches a font from /public/fonts and converts it to base64 for use with jsPDF.
 * @param fontFileName e.g., 'BebasNeue.ttf'
 * @returns base64-encoded font string
 */
export const loadFontAsBase64 = async (
  fontFileName: string
): Promise<string> => {
  const response = await fetch(`/fonts/${fontFileName}`);
  if (!response.ok) throw new Error(`Failed to load font: ${fontFileName}`);
  const buffer = await response.arrayBuffer();
  return bufferToBase64(buffer);
};
