const bufferToBase64 = (buffer: ArrayBuffer): string => {
  const binary = String.fromCharCode(...new Uint8Array(buffer));
  return btoa(binary);
};

// const response = await fetch("/fonts/aloevera/Aloevera-Regular.ttf");
// const buffer = await response.arrayBuffer();
// const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
// console.log("base64", base64);

type FontStyle = "normal" | "bold" | "italic" | "bolditalic";

// interface FontEntry {
//   path: string;     // path under /public/fonts/
//   fileName: string; // just the font file name
// }

// type FontRegistry = {
//   [fontName: string]: {
//     [style in FontStyle]?: FontEntry;
//   };
// };

type FontFileMap = {
  [fontName: string]: {
    [style in FontStyle]?: {
      path: string; // full relative path like 'bebas-neue/BebasNeue.ttf'
      fileName: string; // the actual file name
    };
  };
};

const fontsToLoad: FontFileMap = {
  Aloevera: {
    normal: {
      path: "public/fonts/aloevera/Aloevera-Regular.ttf",
      fileName: "Aloevera-Regular.ttf",
    },
    bold: {
      path: "aloevera/Aloevera-Bold.ttf",
      fileName: "Aloevera-Bold.ttf",
    },
  },
  Braille: {
    normal: {
      path: "braille/BrailleCc0-DOeDd.ttf",
      fileName: "BrailleCc0-DOeDd.ttf",
    },
  },
};

export const loadAllFonts = async (): Promise<void> => {
  for (const [fontName, styles] of Object.entries(fontsToLoad)) {
    for (const [style, { path, fileName }] of Object.entries(styles)) {
      const response = await fetch(`/fonts/${path}`);
      if (!response.ok) throw new Error(`Failed to load font: ${path}`);
      const buffer = await response.arrayBuffer();
      const base64 = bufferToBase64(buffer);

      // Register with jsPDF
      (window as any).jsPDF?.addFileToVFS?.(fileName, base64);
      (window as any).jsPDF?.addFont?.(fileName, fontName, style);
    }
  }
};
