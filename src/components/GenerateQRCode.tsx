import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useState, useRef, useEffect } from "react";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";
import type { TreeAudio } from "../types";
// import { unescape } from "querystring";

const supabaseStorageUrl =
  "https://qsvuddnbvuuzpnwofnzy.supabase.co/storage/v1/object/public/tree-audio/";

const GenerateQRCode = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [treeAudio, setTreeAudio] = useState<TreeAudio | null>(null);
  // const [audioExists, setAudioExists] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Check if audio exists
      const { data: audioData } = await supabase
        .from("tree_audio")
        .select("*")
        .eq("tree_id", id)
        .single();

      setTreeAudio(audioData);
    };

    fetchData();
  }, [id]);

  const audioPath = treeAudio?.audio_path;

  useEffect(() => {
    const checkAudio = async () => {
      const { data, error } = await supabase
        .from("tree_audio")
        .select("audio_path")
        .eq("tree_id", id)
        .single();

      if (error || !data?.audio_path) {
        toast.error("Audio required before generating QR code");
        navigate(`/tree/${id}/upload/audio`);
      }
    };

    checkAudio();
  }, [id, navigate]);

  const redirectUrl = `${supabaseStorageUrl}/${audioPath}`;

  // Generate URL that will play the audio when scanned
  const generateQR = () => {
    const url = redirectUrl;
    // const url = `${window.location.origin}/tree/${id}/audio`;
    setQrCodeUrl(url);
  };

  // Convert QR code to image and upload to storage
  const saveQRCode = async () => {
    if (!qrCodeUrl || !id || !qrCodeRef.current) return;

    setIsSaving(true);

    try {
      // 1. Convert QR code to image
      const svg = qrCodeRef.current.querySelector("svg");
      if (!svg) throw new Error("QR code SVG not found");

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        // 2. Convert to blob
        canvas.toBlob(async (blob) => {
          if (!blob) {
            throw new Error("Failed to convert QR code to image");
          }

          // 3. Upload to Supabase Storage
          const filePath = `qr-codes/${id}.png`;
          const { error: uploadError } = await supabase.storage
            .from("qrcodes") // Make sure this bucket exists
            .upload(filePath, blob);

          if (uploadError) throw uploadError;

          // 4. Get public URL
          const {
            data: { publicUrl },
          } = supabase.storage.from("qrcodes").getPublicUrl(filePath);

          // 5. Save URL to database
          const { error: dbError } = await supabase
            .from("trees")
            .update({
              qr_code_url: publicUrl,
              qr_code_path: filePath,
            })
            .eq("id", id);

          if (dbError) throw dbError;

          toast.success("QR code saved successfully!");
          navigate(`/tree/${id}`);
        }, "image/png");
      };

      //   img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData))}`;
      img.src = `data:image/svg+xml;base64,${btoa(
        unescape(encodeURIComponent(svgData))
      )}`;
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
