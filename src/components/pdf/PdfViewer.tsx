import React from "react";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer, Worker as PDFWorker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface PdfViewerProps {
  fileUrl: string; // Define the type of fileUrl
}

const PdfViewer: React.FC<PdfViewerProps> = ({ fileUrl }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <PDFWorker
      workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
    >
      <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
    </PDFWorker>
  );
};

export default PdfViewer;
