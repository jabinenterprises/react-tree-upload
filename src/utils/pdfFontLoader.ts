import { jsPDF } from "jspdf";

export const registerCustomFont = async () => {
  try {
    const fontName = "Aloevera";
    const fontPath = "/public/fonts/aloevera/aloevera.regular.ttf";

    // Load font file
    const response = await fetch(fontPath);
    const fontData = await response.arrayBuffer();

    console.log(response);

    // Convert to Base64
    const fontBase64 = arrayBufferToBase64(fontData);

    console.log(fontBase64);

    // Initialize jsPDF and register font
    const doc = new jsPDF();
    doc.addFileToVFS(`${fontName}-Regular.ttf`, fontBase64);
    doc.addFont(`${fontName}-Regular.ttf`, fontName, "normal");
    console.log("Font registered successfully");
  } catch (error) {
    console.error("Font registration failed:", error);
    throw error;
  }
};

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};
