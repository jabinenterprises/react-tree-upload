import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useState, useRef, useEffect } from "react";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";
import type { TreeAudio } from "../types";
// import { unescape } from "querystring";

const supabaseStorageUrl =
  "https://qsvuddnbvuuzpnwofnzy.supabase.co/storage/v1/object/public";

const GenerateQRCode = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [treeAudio, setTreeAudio] = useState<TreeAudio | null>(null);
  // const [treeQR, setTreeQR] = useState<TreeQR | null>(null);
  // const [audioExists, setAudioExists] = useState(false);

  useEffect(() => {
    const checkAudio = async () => {
      const { data: audioData, error } = await supabase
        .from("tree_audio")
        .select("*")
        .eq("tree_id", id)
        .single();

      if (error || !audioData?.audio_path) {
        toast.error("Audio is required before generating QR code");
        navigate(`/tree/${id}/upload/audio`);
        return;
      }

      setTreeAudio(audioData?.audio_path);

      // //  Generate QR code pointing to our redirect endpoint
      // if (audioData) {
      //   setQrCodeUrl(`${import.meta.env.VITE_API_BASE_URL}/qr-redirect/${id}`);
      // }
    };

    checkAudio();
  }, [id, navigate]);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const redirectUrl = `${baseUrl}/api/qr-redirect/${id}`;

  // Generate URL that will play the audio when scanned
  const generateQR = () => {
    if (!treeAudio) return;
    setQrCodeUrl(redirectUrl);
  };

  // Convert QR code to image and upload to storage
  const saveQRCode = async () => {
    if (!qrCodeUrl || !id || !qrCodeRef.current || !treeAudio) {
      toast.error("Missing required data");
      return;
    }

    setIsSaving(true);

    try {
      // 1. Convert QR code to image
      const svg = qrCodeRef.current.querySelector("svg");
      if (!svg) throw new Error("QR code SVG not found");

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      const pngBlob = await new Promise<Blob>((resolve, reject) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Canvas to blob conversion failed"));
          }, "image/png");
        };
        img.onerror = reject;
        img.src = `data:image/svg+xml;base64,${btoa(
          unescape(encodeURIComponent(svgData))
        )}`;
      });

      // Upload to Supabase Storage
      const fileName = `tree_${id}_${Date.now()}.png`;
      const filePath = `qr-codes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("qrcodes")
        .upload(filePath, pngBlob, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("qrcodes").getPublicUrl(filePath);

      // Save to database
      const { error: dbError } = await supabase.from("qr_codes").upsert(
        {
          tree_id: id,
          tree_audio_id: treeAudio.id,
          qr_code_path: filePath,
          qr_code_url: publicUrl,
          redirect_url: `${redirectUrl}`,
          audio_url: `${supabaseStorageUrl}/tree-audio/${treeAudio.audio_path}`,
        },
        { onConflict: "tree_id" }
      );

      if (dbError) throw dbError;

<<<<<<< HEAD
      const { error: dbErrorMsg } = await supabase
        .from("trees")
        .update({
          qr_code_url: publicUrl,
          qr_code_path: filePath,
        })
        .eq("id", id);

      if (dbError) throw dbErrorMsg;

=======
>>>>>>> 670791e98f162d3f0760fec09ef25a8c0f46fd5a
      toast.success("QR code saved successfully!");
      navigate(`/tree/${id}`);
    } catch (error) {
      console.error("Error saving QR code:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save QR code"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="qr-generator">
      <button onClick={() => navigate(`/tree/${id}`)} className="back-button">
        ← Back to Tree
      </button>

      <h2>Generate QR Code</h2>

      <div className="qr-controls">
        <button onClick={generateQR} className="generate-button">
          Generate QR Code
        </button>

        {qrCodeUrl && (
          <>
            <div className="qr-preview" ref={qrCodeRef}>
              <QRCode
                value={qrCodeUrl}
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H" // High error correction
              />
              <p className="qr-url">{qrCodeUrl}</p>
            </div>

            <button
              onClick={saveQRCode}
              disabled={isSaving}
              className="save-button"
            >
              {isSaving ? "Saving..." : "Save QR Code"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GenerateQRCode;
