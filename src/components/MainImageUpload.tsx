import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainImageUpload = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file || !id) return;

    setIsUploading(true);
    setError(null);
    try {
      // Delete existing main image if needed
      await supabase
        .from("tree_images")
        .delete()
        .eq("tree_id", id)
        .eq("is_main", true);

      // Upload new main image
      const fileExt = file.name.split(".").pop();
      const fileName = `${id}-main-${Math.random()}.${fileExt}`;
      const filePath = `trees/${id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("tree-images") // Must match bucket name exactly
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.log("Full upload error:", uploadError); // Debugging
        throw uploadError;
      }

      // Add to database
      const { error: dbError } = await supabase.from("tree_images").insert([
        {
          tree_id: id,
          image_path: filePath,
          is_main: true,
        },
      ]);

      if (dbError) throw dbError;

      // Success - redirect with toast
      toast.success("Main image uploaded successfully!");
      navigate(`/tree/${id}`);
    } catch (error) {
      console.error("Upload failed:", error);
      setError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <div>
        <button onClick={() => navigate(`/tree/${id}`)} className="back-button">
          ← Back to Tree
        </button>
      </div>
      <h2>Upload Main Image</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="upload-area">
        <input
          type="file"
          id="main-upload"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          disabled={isUploading}
        />
        {file && (
          <div className="preview">
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              style={{ maxHeight: "200px" }}
            />
          </div>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="upload-button"
      >
        {isUploading ? (
          <>
            Uploading <span className="spinner"></span>
          </>
        ) : (
          "Upload Main Image"
        )}
      </button>
    </div>
  );
};

export default MainImageUpload;
