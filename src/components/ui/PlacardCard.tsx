import { useState } from "react";
import { FaEye, FaFilePdf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { generatePlacardPDF } from "../../utils/smallPdfGenerator";
import type { Tree } from "../../types";
import PlacardPreviewModal from "../PlacardPreviewModal";

interface PlacardCardProps {
  tree: Tree;
}

const PlacardCard = ({ tree }: PlacardCardProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  //   const handleView = () => {
  //     alert(`Viewing placard for ${tree.common_name}`);
  //   };

  const handleExport = async () => {
    try {
      setIsGenerating(true);
      await generatePlacardPDF(tree);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="tree-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{tree.common_name}</h3>
          <p className="text-gray-600 mb-1">Species: {tree.species}</p>
          {/* <p className="text-gray-600 mb-1">Planted: {new Date(tree.planted_at).toLocaleDateString()}</p> */}
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => navigate(`/placards-small/${tree.id}`)}
              //   onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
            >
              <FaEye /> Preview
            </button>
            <button
              onClick={handleExport}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition disabled:opacity-50"
            >
              <FaFilePdf /> {isGenerating ? "Generating..." : "Export PDF"}
            </button>
          </div>
        </div>
      </div>

      {showPreview && (
        <PlacardPreviewModal
          tree={tree}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
};

export default PlacardCard;
