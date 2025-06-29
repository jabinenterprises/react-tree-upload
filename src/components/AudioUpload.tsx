import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import type { TreeQR } from "../types";

const supabaseStorageUrl =
  "https://qsvuddnbvuuzpnwofnzy.supabase.co/storage/v1/object/public";

const AudioUpload = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [treeQR, setTreeQR] = useState<TreeQR | null>(null);
  // const [qrCodeUrl, setQrCodeUrl] = useState("");

  const location = useLocation();

  const fromQR =
    location.state?.fromQR ||
    new URLSearchParams(location.search).get("from") === "qr";

  useEffect(() => {
    const fetchQR = async () => {
      const { data: treeQRCode } = await supabase
        .from("qr_codes")
        .select("*")
        .eq("tree_id", id)
        .single();

      setTreeQR(treeQRCode);
    };

    fetchQR();
  }, [id]);

  const handleUpload = async () => {
    if (!file || !id) return;

    setIsUploading(true);
    setError(null);

    try {
      const { data: existingAudio, error: findError } = await supabase
        .from("tree_audio")
        .select("audio_path, id")
        .eq("tree_id", id)
        .maybeSingle();

      if (findError) throw findError;

      // Delete old audio file if exists
      if (existingAudio?.audio_path) {
        const { error: deleteError } = await supabase.storage
          .from("tree-audio")
          .remove([existingAudio.audio_path]);

        if (deleteError) throw deleteError;
      }

      // Upload new audio
      const fileExt = file.name.split(".").pop();
      const fileName = `audio-${Date.now()}.${fileExt}`;
      const filePath = `trees/${id}/${fileName}`;

      // const audioUrl = `${supabaseStorageUrl}/tree-audio/${treeAudio.audio_path}`;

      // Update database
      const { data: newAudio, error: dbError } = await supabase
        .from("tree_audio")
        .upsert(
          {
            tree_id: id,
            audio_path: filePath,
            updated_at: new Date().toISOString(),
            audio_url: `${supabaseStorageUrl}/tree-audio/${filePath}`,
          },
          { onConflict: "tree_id" } // Ensures only one record per tree
        )
        .select()
        .single();

      if (dbError) throw dbError;

      const { error: uploadError } = await supabase.storage
        .from("tree-audio")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL for the new audio
      const {
        data: { publicUrl: audioPublicUrl },
      } = supabase.storage.from("tree-audio").getPublicUrl(filePath);

      // Update qr_codes table if QR code exists for this tree
      const { data: existingQrCode } = await supabase
        .from("qr_codes")
        .select("*")
        .eq("tree_id", id)
        .maybeSingle();

      if (existingQrCode) {
        const { error: qrUpdateError } = await supabase
          .from("qr_codes")
          .update({
            audio_url: audioPublicUrl,
            tree_audio_id: newAudio.id,
            updated_at: new Date().toISOString(),
          })
          .eq("tree_id", id);

        if (qrUpdateError) throw qrUpdateError;
      }

      if (treeQR) {
        console.log(`qr code exists for tree ${id}`);
      } else {
        console.log(`qr code for tree ${id} does not exist`);
      }

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
