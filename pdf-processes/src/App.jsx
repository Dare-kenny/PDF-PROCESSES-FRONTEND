// src/App.jsx
import { useState } from "react";
import Tabs from "./components/Tabs";
import PdfTools from "./components/PdfTools";
import ImageTools from "./components/ImageTools";

function App() {
  const [activeTool, setActiveTool] = useState("pdf");

  const tabs = [
    { id: "pdf", label: "PDF Tools" },
    { id: "image", label: "Image Tools" }
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-4xl bg-[#161b22] border border-[#30363d] rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
        <header className="space-y-1">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-50">
            Image & PDF Utility Service
          </h1>
          <p className="text-sm text-slate-400">
            Merge and split PDFs, transform images
          </p>
        </header>

        <Tabs tabs={tabs} active={activeTool} onChange={setActiveTool} />

        <section className="mt-4">
          {activeTool === "pdf" && <PdfTools />}
          {activeTool === "image" && <ImageTools />}
        </section>
      </div>
    </div>
  );
}

export default App;
