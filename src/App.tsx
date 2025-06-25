import { BrowserRouter, Routes, Route } from "react-router-dom";
import TreeList from "./components/TreeList";
import TreeDetail from "./components/TreeDetail";
import CreateTreeForm from "./components/CreateTreeForm";
import MainImageUpload from "./components/MainImageUpload";
import MultipleImagesUpload from "./components/MultipleImagesUpload";
import AudioUpload from "./components/AudioUpload";
import AudioPlayerPage from "./components/AudioPlayerPage";
import GenerateQRCode from "./components/GenerateQRCode";
import { ToastContainer } from "react-toastify";

function App() {
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
        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

export default App;
