import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import type { Tree } from "../types";

const PlacardDesignPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tree, setTree] = useState<Tree | null>(null);
  const [template, setTemplate] = useState({
    headerText: "Tree Information",
    showQR: true,
    showSpecies: true,
    // Add more template options
  });

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

  const handleExport = () => {
    const doc = new jsPDF();

    // Page 1 Design
    doc.setFontSize(24);
    doc.text(template.headerText, 105, 20, { align: "center" });
    if (template.showQR && tree?.qr_code_url) {
      doc.addImage(tree.qr_code_url, "PNG", 80, 40, 50, 50);
    }

    // Page 2 Design
    doc.addPage();
    doc.text("Additional Information", 105, 20, { align: "center" });

    doc.save(`tree_${id}_placard.pdf`);
  };

  if (!tree) return <div>Loading...</div>;

  return (
    <div className="placard-design-page">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded"
      >
        ← Back
      </button>

      <div className="flex gap-8">
        {/* Template Controls */}
        <div className="w-1/3 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Design Options</h2>

          <div className="space-y-4">
            <div>
              <label className="block mb-1">Header Text</label>
              <input
                type="text"
                value={template.headerText}
                onChange={(e) =>
                  setTemplate({ ...template, headerText: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={template.showQR}
                onChange={(e) =>
                  setTemplate({ ...template, showQR: e.target.checked })
                }
                id="showQR"
              />
              <label htmlFor="showQR">Show QR Code</label>
            </div>

            {/* Add more controls as needed */}
          </div>

          <button
            onClick={handleExport}
            className="mt-6 w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Export Placard
          </button>
        </div>

        {/* Live Preview */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-4">Live Preview</h2>

          {/* Page 1 Preview */}
          <div className="placard-page bg-white p-8 rounded-lg shadow-md">
            {/* Section 1: Top Section */}
            <div className="flex justify-between items-start mb-8">
              {/* Left Side - Tree Info */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">
                  {tree.common_name || "Common Name"}
                </h1>
                <p className="text-xl">
                  <span className="font-semibold">Species:</span>{" "}
                  {tree.species || "Species name"}
                </p>
                <p className="text-xl">
                  <span className="font-semibold">Family:</span>{" "}
                  {tree.family || "Plant family"}
                </p>
              </div>

              {/* Right Side - Logo */}
              <div className="w-32 h-32 border flex items-center justify-center">
                <img
                  src={tree.logoUrl || "/WRTI.png"}
                  alt="Organization Logo"
                  className="max-w-full max-h-full object-contain"
                  width="200"
                />
              </div>
            </div>

            {/* Section 2: Description */}
            <div className="mb-8 p-4 bg-gray-50 rounded">
              <h2 className="text-xl font-bold mb-2">Description</h2>
              <p className="text-gray-700">
                {tree.description || "Tree description text goes here..."}
              </p>
            </div>

            {/* Section 3: Bottom Section */}
            <div className="flex justify-between items-end">
              {/* Left Side - QR Code */}
              <div className="flex items-center gap-4">
                {tree.qr_code_url && (
                  <img
                    src={tree.qr_code_url}
                    alt="QR Code"
                    className="w-24 h-24 border"
                  />
                )}
                <span className="text-2xl font-medium">Scan Me</span>
              </div>

              {/* Right Side - Logo */}
              <div className="w-24 h-24 border flex items-center justify-center">
                <img
                  src={tree.secondaryLogoUrl || "/seal.png"}
                  alt="Secondary Logo"
                  className="max-w-full max-h-full object-contain"
                  width="200"
                />
              </div>
            </div>
          </div>

          {/* Page 2 Preview */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-center text-2xl mb-6">
              Additional Information
            </h3>
            <div className="space-y-4">
              {/* <div>
                <h4 className="font-bold mb-2">Location</h4>
                <p>{tree.location || "Not specified"}</p>
              </div> */}
              <div>
                <h4 className="font-bold mb-2">Notes</h4>
                <p>{tree.description || "No notes available"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacardDesignPage;
