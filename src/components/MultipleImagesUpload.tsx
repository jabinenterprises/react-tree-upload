import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useState } from "react";
import { toast } from "react-toastify";

const MultipleImagesUpload = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!files.length || !id) return;

    setIsUploading(true);
    setError(null);

    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}.${fileExt}`;
        const filePath = `trees/${id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("tree-images") // Must match bucket name exactly
          .upload(filePath, file);

        if (uploadError) {
          console.log("Upload error details:", {
            bucket: "tree-images",
            error: uploadError,
          });
          throw uploadError;
        }

        return {
          tree_id: id,
          image_path: filePath,
          is_main: false,
        };
      });

      const imageRecords = await Promise.all(uploadPromises);

      const { error: dbError } = await supabase
        .from("tree_images")
        .insert(imageRecords);

      if (dbError) throw dbError;

      toast.success(`${files.length} images uploaded successfully!`);
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
      <h2>Upload Multiple Images</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="upload-area">
        <input
          type="file"
          id="multi-upload"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
          disabled={isUploading}
        />
        <div className="preview-grid">
          {files.map((file, i) => (
            <div key={i} className="preview-item">
              <img src={URL.createObjectURL(file)} alt={`Preview ${i + 1}`} />
              <span>{file.name}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleUpload}
        disabled={!files.length || isUploading}
        className="upload-button"
      >
        {isUploading ? (
          <>
            <span className="spinner"></span>
            Uploading {files.length} images...
          </>
        ) : (
          `Upload ${files.length} Images`
        )}
      </button>
    </div>
  );
};

export default MultipleImagesUpload;
