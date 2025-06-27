import { jsPDF } from "jspdf";
import type { Tree } from "../types";
// import { loadImageFromPublic } from "./imageLoader";
// import { registerFonts } from "./pdfFonts";
import { loadAllFonts } from "../utils/fontRegistry";

const PAGE_WIDTH = 400;
const PAGE_HEIGHT = 200;

const MARGIN = 10;
const MAX_TEXT_WIDTH = PAGE_WIDTH - 2 * MARGIN;
const USABLE_WIDTH = PAGE_WIDTH - MARGIN * 2;

const MAIN_LOGO_PATH = "/WRTI.png";
const SECONDARY_LOGO_PATH = "/seal.png";

export const generatePlacardPDF = async (tree: Tree) => {
  await loadAllFonts();

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [PAGE_WIDTH, PAGE_HEIGHT],
    compress: true,
  });

  doc.setDrawColor(255, 0, 0); // Red
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT); // Page boundary
  doc.rect(MARGIN, MARGIN, PAGE_WIDTH - 2 * MARGIN, PAGE_HEIGHT - 2 * MARGIN); // Safe area
  doc.setDrawColor(0); // Reset to black

  const loadStaticLogo = (path: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = path; // Direct public folder path
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.error(`Failed to load static logo at ${path}`);
        resolve(new Image()); // Return empty image as fallback
      };
    });
  };

  try {
    // ===== PAGE 1 - MAIN PLACARD =====
    // load images
    const [mainLogo, secondaryLogo] = await Promise.all([
      loadStaticLogo(MAIN_LOGO_PATH),
      loadStaticLogo(SECONDARY_LOGO_PATH),
    ]);

    // Section 1 - Top
    doc.setFont("Aloevera", "normal");
    doc.setFontSize(16);
    doc.text(`${tree.species}`, MARGIN, 15, { maxWidth: MAX_TEXT_WIDTH });
    doc.setFontSize(16);
    doc.text(`Common name: ${tree.common_name}`, MARGIN, 30, {
      maxWidth: MAX_TEXT_WIDTH,
    });
    doc.text(`Family: ${tree.family}`, MARGIN, 45, {
      maxWidth: MAX_TEXT_WIDTH,
    });

    // main logo (top right side)
    if (mainLogo.width > 0) {
      // Check if image loaded
      doc.addImage(
        mainLogo,
        "PNG",
        325, // x-position
        5, // y-position
        68, // width (mm)
        45 // height (mm)
      );
    }

    // Section 2 - Description
    doc.setFont("Aloevera", "bold");
    const descLine = doc.splitTextToSize(tree.description || "", USABLE_WIDTH);
    doc.text(descLine, MARGIN, 70);

    // Section 3 - Bottom
    if (tree.qr_code_url) {
      const qrImg = await loadImage(tree.qr_code_url);
      doc.addImage(qrImg, "PNG", 10, 150, 40, 40);
    }
    doc.text("Scan Me", 55, 190);

    // secondary logo (bottom right)
    if (secondaryLogo.width > 0) {
      doc.addImage(
        secondaryLogo,
        "PNG",
        345, // x-position
        143, // y-position
        50, // width (mm)
        50 // height (mm)
      );
    }

    // ===== PAGE 2 - SECONDARY PLACARD =====
    doc.addPage();
    doc.setFontSize(16);

    // top section for braille placard
    doc.text(`${tree.species}`, MARGIN, 15, { maxWidth: MAX_TEXT_WIDTH });
    doc.setFontSize(18);
    doc.text(`Common name: ${tree.common_name}`, MARGIN, 30, {
      maxWidth: MAX_TEXT_WIDTH,
    });
    doc.text(`Family: ${tree.family}`, MARGIN, 45, {
      maxWidth: MAX_TEXT_WIDTH,
    });

    // Section 2 - Braille Section Description
    doc.setFont("Braille", "normal");
    const brlDescLine = doc.splitTextToSize(
      tree.description || "",
      USABLE_WIDTH
    );
    doc.text(brlDescLine, MARGIN, 70);

    // Save the PDF
    doc.save(
      `Tree_Placard_${tree.common_name.replace(/\s+/g, "_")}_${tree.id}.pdf`
    );
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  }
};

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};
