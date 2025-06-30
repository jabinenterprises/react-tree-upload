import { useEffect, useState } from "react";
import type { Tree } from "../../../../types";

interface PdfPreviewProps {
  tree?: Tree;
  scale?: number;
}

const PdfPreview = ({ tree, scale = 1 }: PdfPreviewProps) => {
  const [mainLogo, setMainLogo] = useState<HTMLImageElement | null>(null);
  const [secondaryLogo, setSecondaryLogo] = useState<HTMLImageElement | null>(
    null
  );
  const [qrCode, setQrCode] = useState<HTMLImageElement | null>(null);

  // Constants matching your PDF dimensions (scaled down)
  const PAGE_WIDTH = 150 * scale;
  const PAGE_HEIGHT = 150 * scale;
  const MARGIN = 10 * scale;

  if (!tree) {
    return <div>Loading tree data...</div>;
    // or return null;
  }

  useEffect(() => {
    // Load images
    const loadImages = async () => {
      try {
        const [main, secondary, qr] = await Promise.all([
          loadImage("/WRTI.png"),
          loadImage("/seal.png"),
          tree.qr_code_url ? loadImage(tree.qr_code_url) : null,
        ]);
        setMainLogo(main);
        setSecondaryLogo(secondary);
        setQrCode(qr);

        console.log(mainLogo);
        console.log(secondaryLogo);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    loadImages();
  }, [tree.qr_code_url]);

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  return (
    <div className="pdf-preview-container">
      {/* Page 1 - Main Placard */}
      <div
        className="pdf-page"
        style={{
          width: `${PAGE_WIDTH}px`,
          height: `${PAGE_HEIGHT}px`,
          //   marginBottom: "20px",
          margin: `${MARGIN}px`,
          //   background: "red",
        }}
      >
        {/* Top Section */}
        <div
          className="top-section"
          style={{ padding: `${MARGIN}px`, textAlign: "center" }}
        >
          <p
            style={{
              fontFamily: "'Aloevera', sans-serif",
              fontSize: `${10 * scale}px`,
              margin: 0,
            }}
          >
            {tree.species}
          </p>
          {/* <p
            style={{ fontSize: `${16 * scale}px`, margin: `${15 * scale}px 0` }}
          >
            Common name: {tree.common_name}
          </p> */}
          <p
            style={{
              fontFamily: "'Aloevera', sans-serif",
              fontSize: `${10 * scale}px`,
              margin: 0,
            }}
          >
            Family: {tree.family}
          </p>
        </div>

        {/* Main Logo */}
        {/* {mainLogo && (
          <img
            src={mainLogo.src}
            alt="Main Logo"
            style={{
              position: "absolute",
              right: `${MARGIN}px`,
              top: `${5 * scale}px`,
              width: `${68 * scale}px`,
              height: `${45 * scale}px`,
            }}
          />
        )} */}

        {/* Description */}
        {/* <div
          className="description"
          style={{
            padding: `${MARGIN}px`,
            marginTop: `${25 * scale}px`,
            fontWeight: "bold",
          }}
        >
          {tree.description}
        </div> */}

        {/* QR Code */}
        <div
          className=""
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            // bottom: `${10 * scale}px`,
            // left: `${10 * scale}px`,
          }}
        >
          {qrCode && (
            <img
              src={qrCode.src}
              alt="QR Code"
              style={{
                width: `${80 * scale}px`,
                height: `${80 * scale}px`,
              }}
            />
          )}
          <p
            style={{
              // marginLeft: `${45 * scale}px`,
              // marginTop: `${10 * scale}px`,
              fontFamily: "'Aloevera', sans-serif",
              fontSize: `${9 * scale}px`,
            }}
          >
            Scan Me
          </p>
        </div>

        {/* Secondary Logo */}
        {/* {secondaryLogo && (
          <img
            src={secondaryLogo.src}
            alt="Secondary Logo"
            style={{
              position: "absolute",
              right: `${MARGIN}px`,
              bottom: `${7 * scale}px`,
              width: `${50 * scale}px`,
              height: `${50 * scale}px`,
            }}
          />
        )} */}
      </div>

      {/* Page 2 - Braille Placard */}

      {/* <div
        className="pdf-page braille-page"
        style={{
          width: `${PAGE_WIDTH}px`,
          height: `${PAGE_HEIGHT}px`,
          fontFamily: "'Braille', sans-serif",
        }}
      >
        Top Section
        <div className="top-section" style={{ padding: `${MARGIN}px` }}>
          <h1 style={{ fontSize: `${16 * scale}px`, margin: 0 }}>
            {tree.species}
          </h1>
          <p
            style={{ fontSize: `${18 * scale}px`, margin: `${15 * scale}px 0` }}
          >
            Common name: {tree.common_name}
          </p>
          <p style={{ fontSize: `${18 * scale}px`, margin: 0 }}>
            Family: {tree.family}
          </p>
        </div>

        Braille Description
        <div
          className="description"
          style={{
            padding: `${MARGIN}px`,
            marginTop: `${25 * scale}px`,
            fontFamily: "'Braille', sans-serif",
          }}
        >
          {tree.description}
        </div>
      </div> */}
    </div>
  );
};

export default PdfPreview;
