import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Tree, TreeImage, TreeAudio } from "../types";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";

const TreeDetail = () => {
  // const { id } = useParams();
  const { id } = useParams<{ id: string }>();
  const [tree, setTree] = useState<Tree | null>(null);
  const [images, setImages] = useState<TreeImage[]>([]);
  const [audio, setAudio] = useState<TreeAudio | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [audioExists, setAudioExists] = useState(false);
  const navigate = useNavigate();

  // const handleGenerateQR = async () => {
  //   // Check if audio exists
  //   const { data: audioData, error } = await supabase
  //     .from("tree_audio")
  //     .select("audio_path")
  //     .eq("tree_id", id)
  //     .single();

  //   if (error || !audioData?.audio_path) {
  //     toast.error("Please upload audio before generating QR code");
  //     navigate(`/tree/${id}/upload/audio`, {
  //       state: { fromQR: true }, // Pass state instead of query param
  //     });
  //   } else {
  //     navigate(`/tree/${id}/generate-qr`);
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      // Fetch tree data
      const { data: treeData } = await supabase
        .from("trees")
        .select("*")
        .eq("id", id)
        .single();

      const { data } = await supabase
        .from("trees")
        .select("qr_code_path")
        .eq("id", id)
        .single();

      if (data?.qr_code_path) {
        // setTree(data);
        const {
          data: { publicUrl },
        } = supabase.storage.from("qrcodes").getPublicUrl(data.qr_code_path);
        setQrCodeUrl(publicUrl);
      }

      // Fetch images
      const { data: imageData } = await supabase
        .from("tree_images")
        .select("*")
        .eq("tree_id", id);

      // // Fetch audio
      // const { data: audioData } = await supabase
      //   .from("tree_audio")
      //   .select("*")
      //   .eq("tree_id", id)
      //   .single();

      // Check if audio exists
      const { data: audioData, error } = await supabase
        .from("tree_audio")
        .select("audio_path")
        .eq("tree_id", id)
        .single();

      setAudioExists(!!audioData?.audio_path);

      setTree(treeData);
      setImages(imageData || []);
      // setAudio(audioData);
    };

    fetchData();
  }, [id]);

  const handleGenerateQR = async () => {
    if (!audioExists) {
      toast.error("Please upload audio first");
      navigate(`/tree/${id}/upload/audio`);
      return;
    }
    navigate(`/tree/${id}/generate-qr`);
  };

  if (!tree) return <div>Loading...</div>;

  return (
    <div className="tree-detail">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
        }}
      >
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back to all trees
        </button>

        <Link to="/" className="back-button">
          All trees
        </Link>
      </div>
      <h2>{tree.common_name}</h2>
      <p>
        <strong>Species:</strong> {tree.species || "Unknown"}
      </p>
      <p>
        <strong>Family:</strong> {tree.family || "Unknown"}
      </p>
      <p>
        <strong>Description:</strong> {tree.description || "None"}
      </p>
      <div>
        <Link to={`/tree/${id}/upload/audio`} className="upload-button">
          Upload Description Audio
        </Link>
        <p>Maximum one audio file per tree</p>
      </div>

      <div className="audio-status">
        <h4>Audio Status:</h4>
        {audioExists ? (
          <span className="status-badge success">✓ Audio uploaded</span>
        ) : (
          <span className="status-badge warning">⚠ No audio</span>
        )}
      </div>

      {/* Section to generate or display QR code */}
      <div className="qr-section">
        <h3>QR Code</h3>
        {tree.qr_code_path ? (
          <>
            {/* <QRCode value={tree.qr_code_url} size={150} /> */}
            <div>
              {qrCodeUrl && (
                <img src={qrCodeUrl} alt="Tree QR Code" width={200} />
              )}
            </div>
            <p>Scan to play audio</p>
            <button onClick={handleGenerateQR} className="regenerate-button">
              Regenerate QR Code
            </button>
          </>
        ) : (
          <>
            <p>No QR code generated yet</p>
            <Link
              to={`/tree/${tree.id}/generate-qr`}
              className="generate-button"
            >
              Generate QR Code
            </Link>
          </>
        )}
      </div>

      <div className="image-upload-section">
        <h3>Image Management</h3>

        {/* Single Image Upload */}
        <div className="upload-card">
          <h4>Main Thumbnail</h4>
          <Link to={`/tree/${id}/upload/main`} className="upload-button">
            Add/Change Main Image
          </Link>
          <p>Only one image allowed (will replace existing)</p>
        </div>

        {/* Multiple Images Upload */}
        <div className="upload-card">
          <h4>Additional Images</h4>
          <Link to={`/tree/${id}/upload/multiple`} className="upload-button">
            Add More Images
          </Link>
          <p>Upload multiple supporting images</p>
        </div>
      </div>
      {/* Add QR code or other details here */}
    </div>
  );
};

export default TreeDetail;
