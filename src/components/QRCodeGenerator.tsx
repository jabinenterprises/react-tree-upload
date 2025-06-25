import QRCode from "react-qr-code";
import type { Tree } from "../types";

interface Props {
  tree: Tree;
}

const QRCodeGenerator = ({ tree }: Props) => {
  const qrValue = `${window.location.origin}/tree/${tree.id}`;

  return (
    <div className="qr-code">
      <QRCode value={qrValue} size={128} />
      <p>Scan to view tree details</p>
    </div>
  );
};

export default QRCodeGenerator;
