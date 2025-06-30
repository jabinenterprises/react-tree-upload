import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import PlacardCard from "../../../ui/PlacardCard";
import type { Tree } from "../../../../types";
import { generateAllTreesPDF } from "../../../../utils/pdfGenerateAll";

const PlacardSmallDesign = () => {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchTreesWithQR = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("trees")
          .select("*")
          .not("qr_code_url", "is", null)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setTrees(data || []);
      } catch (error) {
        console.error("Error fetching trees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTreesWithQR();
  }, []);

  // Fetch trees (example)
  useEffect(() => {
    const fetchTrees = async () => {
      const { data } = await supabase.from("trees").select("*");
      setTrees(data || []);
    };
    fetchTrees();
  }, []);

  const handleExportAll = async () => {
    if (!trees.length) {
      alert("No trees to export");
      return;
    }

    setIsExporting(true);
    try {
      await generateAllTreesPDF(trees);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Check console for details.");
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) return <div>Loading placards...</div>;

  return (
    <div className="tree-list">
      <div className="header">
        <h1>Get Tree Placards</h1>

        <button
          onClick={handleExportAll}
          disabled={isExporting || !trees.length}
          className="export-button"
        >
          {isExporting ? (
            <>
              <span className="spinner"></span>
              Exporting...
            </>
          ) : (
            `Export All (${trees.length})`
          )}
        </button>
      </div>
      <div className="tree-card-link">
        {trees.length > 0 ? (
          trees.map((tree) => <PlacardCard key={tree.id} tree={tree} />)
        ) : (
          <p>No trees with QR codes found</p>
        )}
      </div>
    </div>
  );
};

export default PlacardSmallDesign;
