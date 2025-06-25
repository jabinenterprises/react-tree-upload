import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useState } from "react";
import { toast } from "react-toastify";

const AudioUpload = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();

  const fromQR =
    location.state?.fromQR ||
    new URLSearchParams(location.search).get("from") === "qr";

  const handleUpload = async () => {
    if (!file || !id) return;

    setIsUploading(true);
    setError(null);

    try {
      // 1. Delete existing audio if any
      const { data: existingAudio, error: findError } = await supabase
        .from("tree_audio")
        .select("audio_path")
        .eq("tree_id", id)
        .maybeSingle();

      if (findError) throw findError;

      if (existingAudio?.audio_path) {
        const { error: deleteError } = await supabase.storage
          .from("tree-audio")
          .remove([existingAudio.audio_path]);

        if (deleteError) throw deleteError;
      }

      // 2. Upload new audio
      const fileExt = file.name.split(".").pop();
      const fileName = `audio-${Date.now()}.${fileExt}`;
      const filePath = `trees/${id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("tree-audio") // Must match your bucket name
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // 3. Update database
      const { error: dbError } = await supabase.from("tree_audio").upsert(
        {
          tree_id: id,
          audio_path: filePath,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "tree_id" } // Ensures only one record per tree
      );

      if (dbError) throw dbError;

      toast.success(
        fromQR
          ? "Audio uploaded! Redirecting to QR generation..."
          : "Audio uploaded successfully!"
      );

      // Smart redirect
      navigate(fromQR ? `/tree/${id}/generate-qr` : `/tree/${id}`);

      toast.success("Audio uploaded successfully!");
      navigate(`/tree/${id}`);
    } catch (error) {
      console.error("Full error details:", error);
      setError(
        error instanceof Error
          ? `Upload failed: ${error.message}`
          : "Audio upload failed. Check console for details."
      );
      toast.error("Upload failed. See error message for details.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      {fromQR && (
        <div className="context-notice">
          <p>ℹ You need to upload audio before generating a QR code</p>
        </div>
      )}

      <button onClick={() => navigate(`/tree/${id}`)} className="back-button">
        ← Back to Tree
      </button>

      <h2>Upload Audio Description</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="upload-area">
        <input
          type="file"
          id="audio-upload"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          disabled={isUploading}
        />

        {file && (
          <div className="audio-preview">
            <audio controls src={URL.createObjectURL(file)} />
            <p>
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
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
            <span className="spinner"></span>
            Uploading...
          </>
        ) : (
          "Upload Audio"
        )}
      </button>
    </div>
  );
};

export default AudioUpload;
