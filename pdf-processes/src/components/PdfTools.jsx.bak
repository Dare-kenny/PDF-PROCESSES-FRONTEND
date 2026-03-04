// src/components/PdfTools.jsx
import { useState, useEffect } from "react";
import FileDropZone from "./FileDropZone";
import Toast from "./Toast";
import { apiMergePdfs, apiSplitPdf } from "../api/api";

function PdfTools() {
  const [activeMode, setActiveMode] = useState("merge"); // "merge" | "split"

  const [mergeFiles, setMergeFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);

  const [splitFile, setSplitFile] = useState(null);
  const [fromPage, setFromPage] = useState("");
  const [toPage, setToPage] = useState("");
  const [isSplitting, setIsSplitting] = useState(false);

  const [toast, setToast] = useState(null); // { type, message }

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  const showError = (msg) =>
    setToast({ type: "error", message: msg || "Something went wrong." });
  const showSuccess = (msg) => setToast({ type: "success", message: msg });

  const isPdfFile = (file) => {
    if (!file) return false;
    const name = (file.name || "").toLowerCase();
    const type = file.type || "";
    const extOk = name.endsWith(".pdf");
    const mimeOk =
      type === "application/pdf" ||
      type === "application/x-pdf" ||
      type === "application/acrobat";
    return extOk || mimeOk;
  };

  // Merge handlers
  const handleMergeFilesSelected = (files) => {
    const list = Array.isArray(files) ? files : [files];
    if (list.length === 0) return;

    const invalid = list.filter((f) => !isPdfFile(f));
    if (invalid.length > 0) {
      setMergeFiles([]);
      showError("Only PDF files can be merged. Please upload .pdf documents.");
      return;
    }

    setMergeFiles(list);
  };

  const handleMergeSubmit = async (e) => {
    e.preventDefault();

    if (!mergeFiles.length) {
      showError("Please select at least one PDF file to merge.");
      return;
    }

    setIsMerging(true);
    try {
      const res = await apiMergePdfs(mergeFiles);
      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showSuccess("Merged PDF downloaded successfully.");
    } catch (err) {
      console.error(err);
      showError(err.message);
    } finally {
      setIsMerging(false);
    }
  };

  // Split handlers
  const handleSplitFileSelected = (file) => {
    if (file && !isPdfFile(file)) {
      setSplitFile(null);
      showError("Only PDF files can be split. Please upload a .pdf document.");
      return;
    }
    setSplitFile(file || null);
  };

  const handleSplitSubmit = async (e) => {
    e.preventDefault();

    if (!splitFile) {
      showError("Please select a PDF to split.");
      return;
    }

    const from = parseInt(fromPage, 10);
    const to = parseInt(toPage, 10);
    if (!from || !to || from <= 0 || to < from) {
      showError("Please provide a valid page range (e.g. from 1 to 3).");
      return;
    }

    setIsSplitting(true);
    try {
      const res = await apiSplitPdf(splitFile, from, to);
      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "split.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showSuccess("Split PDF downloaded successfully.");
    } catch (err) {
      console.error(err);
      showError(err.message);
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Inner mode tabs (Merge / Split) */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setActiveMode("merge")}
          className={`px-3 py-1.5 text-sm rounded-lg border ${
            activeMode === "merge"
              ? "bg-slate-100 text-slate-900 border-slate-100"
              : "bg-[#161b22] border-[#30363d] text-slate-300 hover:bg-[#21262d]"
          }`}
        >
          Merge PDFs
        </button>
        <button
          type="button"
          onClick={() => setActiveMode("split")}
          className={`px-3 py-1.5 text-sm rounded-lg border ${
            activeMode === "split"
              ? "bg-slate-100 text-slate-900 border-slate-100"
              : "bg-[#161b22] border-[#30363d] text-slate-300 hover:bg-[#21262d]"
          }`}
        >
          Split PDF
        </button>
      </div>

      {activeMode === "merge" && (
        <form
          onSubmit={handleMergeSubmit}
          className="space-y-4 bg-[#161b22] border border-[#30363d] rounded-xl p-4"
        >
          <FileDropZone
            label="Merge PDFs"
            hint="Upload multiple PDF files; they will be merged in order."
            multiple
            accept="application/pdf,.pdf"
            disabled={isMerging}
            onFilesSelected={handleMergeFilesSelected}
          />

          {mergeFiles.length > 0 && (
            <div className="mt-2 text-xs text-slate-300">
              <p className="mb-1">
                <span className="font-medium">{mergeFiles.length}</span> file(s)
                selected:
              </p>
              <ul className="space-y-0.5">
                {mergeFiles.map((f, idx) => (
                  <li key={idx} className="text-slate-400 truncate">
                    • {f.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isMerging}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500 text-slate-900 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {isMerging ? "Merging..." : "Merge & Download"}
            </button>
          </div>
        </form>
      )}

      {activeMode === "split" && (
        <form
          onSubmit={handleSplitSubmit}
          className="space-y-4 bg-[#161b22] border border-[#30363d] rounded-xl p-4"
        >
          <FileDropZone
            label="Split PDF"
            hint="Upload a single PDF and choose the page range to extract."
            multiple={false}
            accept="application/pdf,.pdf"
            disabled={isSplitting}
            onFilesSelected={handleSplitFileSelected}
          />

          {splitFile && (
            <p className="mt-2 text-xs text-slate-300">
              Selected:{" "}
              <span className="text-emerald-400 font-medium">
                {splitFile.name}
              </span>
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                From page
              </label>
              <input
                type="number"
                min="1"
                value={fromPage}
                onChange={(e) => setFromPage(e.target.value)}
                className="w-full rounded-md bg-[#0d1117] border border-[#30363d] px-2 py-1.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. 1"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                To page
              </label>
              <input
                type="number"
                min="1"
                value={toPage}
                onChange={(e) => setToPage(e.target.value)}
                className="w-full rounded-md bg-[#0d1117] border border-[#30363d] px-2 py-1.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. 3"
              />
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            The selected page range will be extracted as a new PDF.
          </p>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSplitting}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-slate-900 hover:bg-blue-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {isSplitting ? "Splitting..." : "Split & Download"}
            </button>
          </div>
        </form>
      )}

      <Toast
        type={toast?.type}
        message={toast?.message}
        onClose={() => setToast(null)}
      />
    </div>
  );
}

export default PdfTools;
