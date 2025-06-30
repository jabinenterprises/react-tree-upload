import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Tree } from "../types";
// import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";

const TreeList = () => {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrees = async () => {
      try {
        const { data, error } = await supabase.from("trees").select("*");
        if (error) throw error;
        setTrees(data || []);
      } catch (error) {
        console.error("Error fetching trees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrees();
  }, []);

  if (loading) return <div>Loading trees...</div>;

  return (
    // <div className="tree-list">
    //   <h1>Test text</h1>
    //   {trees.map((tree) => (
    //     <div key={tree.id} className="tree-card">
    //       <h3>{tree.common_name}</h3>
    //       <p>Species: {tree.species}</p>
    //       <p>Family: {tree.family}</p>
    //     </div>
    //   ))}
    // </div>

    <div className="tree-list">
      <div className="header">
        <h1>Tree Catalog</h1>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <Link to="/trees/new" className="create-link">
            Create new tree
          </Link>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <Link to="/placards">Placards</Link>
            <Link to="/placards-small">Small Placards</Link>
          </div>
        </div>
      </div>

      {/* {trees.map((tree) => (
        <div key={tree.id} className="tree-card">
          <h3>{tree.common_name}</h3>
          <p>Species: {tree.species}</p>
          <p>Family: {tree.family}</p>
        </div>
      ))} */}

      {trees.map((tree) => (
        <Link to={`/tree/${tree.id}`} key={tree.id} className="tree-card-link">
          <div className="tree-card">
            {tree.qr_code_url && (
              <div className="qr-indicator">
                <FaCheckCircle
                  className="check-icon"
                  title="QR Code Generated"
                />
              </div>
            )}
            <h3>{tree.common_name}</h3>
            <p>Species: {tree.species || "Unknown"}</p>
            <p>Family: {tree.family || "Unknown"}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TreeList;
