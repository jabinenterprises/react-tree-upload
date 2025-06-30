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
          margin: `${MARGIN}px`,
        }}
      >
        {/* very top */}
        <div
          className="very-top-section"
          style={{
            width: "100%",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            padding: "10px",
          }}
        >
          {mainLogo && (
            <img
              src={mainLogo.src}
              alt="Main Logo"
              style={{
                position: "relative",
                right: `${MARGIN}px`,
                top: `0`,
                width: `auto`,
                height: `${23 * scale}px`,
              }}
            />
          )}
        </div>

        {/* Top Section */}
        <div
          className="top-section"
          style={{ padding: `0px`, textAlign: "center" }}
        >
          <p
            style={{
              fontFamily: "'Aloevera', sans-serif",
              fontSize: `${9 * scale}px`,
              margin: 0,
            }}
          >
            {tree.species}
          </p>
          <p
            style={{
              fontFamily: "'Aloevera', sans-serif",
              fontSize: `${7 * scale}px`,
              margin: 0,
            }}
          >
            Common name: {tree.common_name}
          </p>
          <p
            style={{
              fontFamily: "'Aloevera', sans-serif",
              fontSize: `${6 * scale}px`,
              margin: 0,
            }}
          >
            Family: {tree.family?.toUpperCase()}
          </p>
        </div>

        {/* QR Code */}
        <div
          className=""
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            marginTop: "5px",
          }}
        >
          {qrCode && (
            <img
              src={qrCode.src}
              alt="QR Code"
              style={{
                width: `${65 * scale}px`,
                height: `${65 * scale}px`,
              }}
            />
          )}
          <p
            style={{
              fontFamily: "'Aloevera', sans-serif",
              fontSize: `${9 * scale}px`,
              margin: "5px 0px",
            }}
          >
            Scan Me
          </p>
        </div>

        {/* secondary bottom most logo */}
        {secondaryLogo && (
          <img
            src={secondaryLogo.src}
            alt="Secondary Logo"
            style={{
              position: "absolute",
              right: `${MARGIN}px`,
              bottom: `${7 * scale}px`,
              width: `${20 * scale}px`,
              height: `${20 * scale}px`,
            }}
          />
        )}
      </div>

      {/* Page 2 - Braille Placard */}

      <div
        className="pdf-page braille-page"
        style={{
          width: `${PAGE_WIDTH}px`,
          height: `${PAGE_HEIGHT}px`,
          fontFamily: "'Braille', sans-serif",
        }}
      >
        {/* very top */}
        <div
          className="very-top-section"
          style={{
            width: "100%",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            padding: "10px",
          }}
        >
          {mainLogo && (
            <img
              src={mainLogo.src}
              alt="Main Logo"
              style={{
                position: "relative",
                right: `${MARGIN}px`,
                top: `0`,
                width: `auto`,
                height: `${23 * scale}px`,
              }}
            />
          )}
        </div>

        {/* Middle Section */}
        <div
          className="middle-section"
          style={{
            padding: `${MARGIN}px`,
            // background: "red",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: `${13 * scale}px`, margin: 0 }}>
            {tree.species}
          </h1>
          <p
            style={{ fontSize: `${11 * scale}px`, margin: `${15 * scale}px 0` }}
          >
            Common name: {tree.common_name}
          </p>
          <p style={{ fontSize: `${10 * scale}px`, margin: 0 }}>
            Family: {tree.family?.toUpperCase()}
          </p>
        </div>

        {/* secondary bottom most logo */}
        <div
          className="bottom-most"
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            // background: "blue",
          }}
        >
          {secondaryLogo && (
            <img
              src={secondaryLogo.src}
              alt="Secondary Logo"
              style={{
                position: "relative",
                right: `${MARGIN}px`,
                width: `${20 * scale}px`,
                height: `${20 * scale}px`,
                marginBottom: "10px",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfPreview;
