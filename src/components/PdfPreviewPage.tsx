// src/components/PdfPreviewPage.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PdfPreview from "./pages/pdf/small/PdfPreview";
import { supabase } from "../lib/supabase";
import type { Tree } from "../types";

// const initialTree: Tree = {
//   id: "1",
//   species: "Sample Species",
//   common_name: "Sample Tree",
//   family: "Sample Family",
//   description:
//     "This is a sample description for the tree placard. It should be long enough to test text wrapping in the preview.",
//   qr_code_url: "https://example.com/qr-code.png",
// };

const PdfPreviewPage = () => {
  //   const [tree, setTree] = useState<Tree>(initialTree);
  const { id } = useParams();
  const [tree, setTree] = useState<Tree | null>(null);
  const [scale, setScale] = useState<number>(0.5);

  useEffect(() => {
    const fetchTree = async () => {
      const { data } = await supabase
        .from("trees")
        .select("*")
        .eq("id", id)
        .single();
      setTree(data);
    };
    fetchTree();
  }, [id]);

  return (
    <div className="preview-page">
      <h1>PDF Placard Preview</h1>

      <div className="controls">
        <label>
          Scale:
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
          />
          {scale.toFixed(1)}
        </label>
      </div>

      {/* <div className="form-fields">
        <label>
          Species:
          <input
            value={tree?.species}
            onChange={(e) => setTree({ ...tree, species: e.target.value })}
          />
        </label>
      </div> */}

      <div className="preview-container">
        {tree && <PdfPreview tree={tree} scale={scale} />}
      </div>
    </div>
  );
};

export default PdfPreviewPage;
