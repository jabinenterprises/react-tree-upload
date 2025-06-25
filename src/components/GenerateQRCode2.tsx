import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useState } from "react";
import { toast } from "react-toastify";
import QRCode from "qrcode"; // For QR generation
import { v4 as uuidv4 } from "uuid";

const GenerateQRCode = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const generateQR = async () => {
    try {
      // 1. Generate QR code as data URL
      const audioUrl = `${window.location.origin}/tree/${id}/audio`;
      const qrDataUrl = await QRCode.toDataURL(audioUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      // 2. Convert to blob
      const blob = await fetch(qrDataUrl).then((res) => res.blob());

      // 3. Generate unique filename
      const fileExt = "png";
      const fileName = `tree_${id}_${uuidv4()}.${fileExt}`;
      const filePath = `qrcodes/${fileName}`;

      // 4. Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("qrcodes")
        .upload(filePath, blob, {
          contentType: "image/png",
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // 5. Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("qrcodes").getPublicUrl(filePath);

      setQrCodeUrl(publicUrl);
    } catch (error) {
      console.error("QR generation failed:", error);
      toast.error("Failed to generate QR code");
    }
  };

  const saveQRCode = async () => {
    if (!qrCodeUrl || !id) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("trees")
        .update({
          qr_code_path: qrCodeUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("QR code saved successfully!");
      navigate(`/tree/${id}`);
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save QR code to database");
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
        <button
          onClick={generateQR}
          className="generate-button"
          disabled={isSaving}
        >
          Generate QR Code
        </button>

        {qrCodeUrl && (
          <>
            <div className="qr-preview">
              <img src={qrCodeUrl} alt="Generated QR Code" width={200} />
              <p className="qr-instructions">
                Scan this code to play the tree's audio guide
              </p>
            </div>

            <button
              onClick={saveQRCode}
              disabled={isSaving}
              className="save-button"
            >
              {isSaving ? "Saving..." : "Save to Database"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GenerateQRCode;
