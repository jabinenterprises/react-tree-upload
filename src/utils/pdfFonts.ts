import jsPDF from "jspdf";

// Helper to convert ArrayBuffer to Base64
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  return btoa(String.fromCharCode(...bytes));
};

export const registerFonts = async (doc: jsPDF): Promise<void> => {
  try {
    // 1. Load font files
    const fontResponses = await Promise.all([
      fetch("/fonts/Aloevera-Regular.ttf"),
      fetch("/fonts/braille/BrailleCc0-DOeDd.ttf"),
      //   fetch("/fonts/Roboto-Regular.ttf"),
    ]);

    // const fontModules = await Promise.all([
    //   import('!!arraybuffer-loader!../../public/fonts/Aloevera-Regular.ttf').then(m => m.default),
    //   import('!!arraybuffer-loader!../../public/fonts/Aloevera-Bold.ttf').then(m => m.default),
    //   import('!!arraybuffer-loader!../../public/fonts/braille/BrailleCc0-DOeDd.ttf').then(m => m.default)
    // ]as const);

    // const jsPDFWithVFS = doc as any;
    // fontModules.forEach((fontBuffer, i) => {
    //   const fontName = ['OpenSans-Regular', 'OpenSans-Bold', 'PlayfairDisplay-Regular'][i];
    //   const fontFamily = fontName.split('-')[0];
    //   const fontStyle = fontName.includes('Bold') ? 'bold' : 'normal';

    //   jsPDFWithVFS.addFileToVFS(`${fontName}.ttf`, arrayBufferToBase64(fontBuffer));
    //   doc.addFont(`${fontName}.ttf`, fontFamily, fontStyle);
    // });

    // const fonts = {
    //   'OpenSans-Regular': arrayBufferToBase64(fontModules[0].default),
    //   'OpenSans-Bold': arrayBufferToBase64(fontModules[1].default),
    //   'PlayfairDisplay-Regular': arrayBufferToBase64(fontModules[2].default)
    // };

    // Object.entries(fonts).forEach(([fontName, fontData]) => {
    //   // Type-safe registration
    //   const jsPDFAPI = doc as any;
    //   if (jsPDFAPI.addFileToVFS) {
    //     jsPDFAPI.addFileToVFS(`${fontName}.ttf`, fontData);
    //     doc.addFont(`${fontName}.ttf`, fontName.split("-")[0], "normal");
    //   }
    // });

    // 2. Convert to ArrayBuffer
    const [openSansRegular, openSansBold, playfair] = await Promise.all(
      fontResponses.map((res) => res.arrayBuffer())
    );

    // 3. Register fonts with jsPDF
    (doc as any).addFontToVFS(
      "Aloevera-Regular",
      arrayBufferToBase64(openSansRegular)
    );
    (doc as any).addFontToVFS(
      "Aloevera-Bold",
      arrayBufferToBase64(openSansBold)
    );
    (doc as any).addFontToVFS("Braille-Regular", arrayBufferToBase64(playfair));

    // 4. Add font mappings
    // 4.1. Register primary font
    doc.addFont("/fonts/Aloevera-Regular.ttf", "Aloevera", "normal");
    doc.addFont("/fonts/Aloevera-Bold.ttf", "Aloevera", "bold");

    // 4.2. Register secondary font
    doc.addFont("/fonts/braille/BrailleCc0-DOeDd.ttf", "Braille", "normal");

    // 4.3. Register monospace font
    // doc.addFont("/fonts/RobotoMono-Regular.ttf", "RobotoMono", "normal");
  } catch (error) {
    console.error("Font registration failed:", error);
    throw error;
  }
};
