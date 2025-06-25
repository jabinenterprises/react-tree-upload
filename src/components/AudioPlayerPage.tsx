import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

const AudioPlayerPage = () => {
  const { id } = useParams();
  const [audioUrl, setAudioUrl] = useState("");

  useEffect(() => {
    const fetchAudio = async () => {
      const { data } = await supabase
        .from("tree_audio")
        .select("audio_path")
        .eq("tree_id", id)
        .single();

      if (data?.audio_path) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("tree-audio").getPublicUrl(data.audio_path);
        setAudioUrl(publicUrl);
      }
    };

    fetchAudio();
  }, [id]);

  return (
    <div className="audio-player-page">
      {audioUrl ? (
        <>
          <h2>Tree Audio</h2>
          <audio controls autoPlay src={audioUrl} />
          <p>Audio is playing automatically...</p>
        </>
      ) : (
        <p>No audio found for this tree</p>
      )}
    </div>
  );
};

export default AudioPlayerPage;
