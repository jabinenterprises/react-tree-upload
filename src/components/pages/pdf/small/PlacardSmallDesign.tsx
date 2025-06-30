import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import PlacardCard from "../../../ui/PlacardCard";
import type { Tree } from "../../../../types";

const PlacardSmallDesign = () => {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Loading placards...</div>;

  return (
    <div className="tree-list">
      <div className="header">
        <h1>Get Tree Placards</h1>
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
