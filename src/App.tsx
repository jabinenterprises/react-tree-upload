import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import TreeList from "./components/TreeList";
import TreeDetail from "./components/TreeDetail";
import CreateTreeForm from "./components/CreateTreeForm";
import MainImageUpload from "./components/MainImageUpload";
import MultipleImagesUpload from "./components/MultipleImagesUpload";
import AudioUpload from "./components/AudioUpload";
import AudioPlayerPage from "./components/AudioPlayerPage";
import GenerateQRCode from "./components/GenerateQRCode";
import PlacardPage from "./components/pages/PlacardPage";
import PlacardDesignPage from "./components/PlacardDesignPage";
import PlacardSmallDesign from "./components/pages/pdf/small/PlacardSmallDesign";
import PdfPreviewPage from "./components/PdfPreviewPage";
import { ToastContainer } from "react-toastify";

// import { registerCustomFont } from "./utils/pdfFontLoader";
import { registerFonts } from "./utils/pdfFonts";

function App() {
  useEffect(() => {
    // registerCustomFont().catch(console.error);

    registerFonts();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="react-tree-upload/" element={<TreeList />} /> */}
          <Route path="/" element={<TreeList />} />
          <Route path="/trees/new" element={<CreateTreeForm />} />
          <Route path="/tree/:id" element={<TreeDetail />} />

          <Route path="/tree/:id/upload/main" element={<MainImageUpload />} />
          <Route
            path="/tree/:id/upload/multiple"
            element={<MultipleImagesUpload />}
          />
          <Route path="/tree/:id/upload/audio" element={<AudioUpload />} />

          <Route path="/tree/:id/audio" element={<AudioPlayerPage />} />
          <Route path="/tree/:id/generate-qr" element={<GenerateQRCode />} />

          <Route path="/placards" element={<PlacardPage />} />
          <Route path="/placards-small" element={<PlacardSmallDesign />} />

          <Route path="/placards-small/:id" element={<PdfPreviewPage />} />

          <Route
            path="/trees/:id/placard-design"
            element={<PlacardDesignPage />}
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

export default App;
