import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Tree } from "../types";
import axios from "axios";

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

  // In a React component or API client file
  const testConnection = async () => {
    console.log("my text...");
    try {
      const response = await axios.get("http://localhost:3001/api/ping");
      console.log(response.data); // Should show { message: "Backend is alive!" }
    } catch (error) {
      console.error("Backend connection failed:", error);
    }
  };

  testConnection;

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
        <Link to="/trees/new" className="create-link">
          Create new tree
        </Link>
      </div>

      {/* {trees.map((tree) => (
        <div key={tree.id} className="tree-card">
          <h3>{tree.common_name}</h3>
          <p>Species: {tree.species}</p>
          <p>Family: {tree.family}</p>
        </div>
      ))} */}

      {trees.map((tree) => (
        <Link
          to={`/tree/${tree.id}`}
          key={tree.id}
          className="tree-card-link" // Optional: for styling
        >
          <div className="tree-card">
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
