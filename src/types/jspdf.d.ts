import "jspdf";

declare module "jspdf" {
  interface jsPDF {
    addFontToVFS(font: string | Record<string, string>, fontName: string): void;
  }
}
