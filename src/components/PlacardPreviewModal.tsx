// import { useState, Fragment } from "react";
import {
  Dialog,
  // Transition
} from "@headlessui/react";
// import { jsPDF } from "jspdf";
import type { Tree } from "../types";

interface PlacardPreviewModalProps {
  tree: Tree;
  onClose: () => void;
}

const PlacardPreviewModal = ({ tree, onClose }: PlacardPreviewModalProps) => {
  //   const [activeTab, setActiveTab] = useState<"page1" | "page2">("page1");
  //   const [customText, setCustomText] = useState({
  //     page1Header: "Tree Information",
  //     page2Header: "Additional Details",
  //   });

  //   const exportPreview = async () => {
  //     const doc = new jsPDF();

  //     // Page 1 - Custom Template
  //     doc.setFontSize(24);
  //     doc.text(customText.page1Header, 105, 20, { align: "center" });
  //     doc.addImage(tree.qr_code_url || "", "PNG", 80, 40, 50, 50);

  //     // Page 2 - Custom Template
  //     doc.addPage();
  //     doc.setFontSize(24);
  //     doc.text(customText.page2Header, 105, 20, { align: "center" });

  //     doc.save(`custom_placard_${tree.id}.pdf`);
  //   };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop - This is now part of the Dialog component */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Modal Container */}
      <Dialog.Panel className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100"
        >
          ✕
        </button>

        {/* Modal Content */}
        <div className="p-6">
          <Dialog.Title className="text-2xl font-bold mb-4">
            Placard Designer - {tree.common_name}
          </Dialog.Title>

          {/* Your template designer content */}
          <div className="flex gap-6">
            {/* Left panel - controls */}
            <div className="w-1/3 space-y-4">{/* Form controls */}</div>

            {/* Right panel - preview */}
            <div className="w-2/3">{/* Preview content */}</div>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default PlacardPreviewModal;
