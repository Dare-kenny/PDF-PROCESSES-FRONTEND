// src/components/PdfTools.jsx
import { useState, useEffect } from "react";
import FileDropZone from "./FileDropZone";
import Toast from "./Toast";
import { apiMergePdfs, apiSplitPdf } from "../api/api";

// Accepted MIME types and extensions
const ACCEPTED_MIME = [
  "application/pdf",
  "application/x-pdf",
  "application/acrobat",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ACCEPTED_EXTENSIONS = [".pdf", ".docx"];
const ACCEPT_ATTR = "application/pdf,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx";

const isDocx = (file) => {
  const name = (file?.name || "").toLowerCase();
  const type = file?.type || "";
  return (
    name.endsWith(".docx") ||
    type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
};

const isSupportedFile = (file) => {
  if (!file) return false;
  const name = (file.name || "").toLowerCase();
  const type = file.type || "";
  const extOk = ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
  const mimeOk = ACCEPTED_MIME.includes(type);
  return extOk || mimeOk;
};

const downloadName = (prefix, file) => `${prefix}${isDocx(file) ? ".docx" : ".pdf"}`;

function PdfTools() {
  const [activeMode, setActiveMode] = useState("merge");

  const [mergeFiles, setMergeFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);

  const [splitFile, setSplitFile] = useState(null);
  const [fromPage, setFromPage] = useState("");
  const [toPage, setToPage] = useState("");
  const [isSplitting, setIsSplitting] = useState(false);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  const showError = (msg) =>
    setToast({ type: "error", message: msg || "Something went wrong." });
  const showSuccess = (msg) => setToast({ type: "success", message: msg });

  const handleMergeFilesSelected = (files) => {
    const list = Array.isArray(files) ? files : [files];
    if (list.length === 0) return;

    const invalid = list.filter((f) => !isSupportedFile(f));
    if (invalid.length > 0) {
      setMergeFiles([]);
      showError("Only PDF and DOCX files can be merged. Please upload .pdf or .docx documents.");
      return;
    }

    const hasDocx = list.some(isDocx);
    const hasPdf = list.some((f) => !isDocx(f));
    if (hasDocx && hasPdf) {
      setMergeFiles([]);
      showError("All files must be the same type. Please upload either all PDFs or all DOCX files.");
      return;
    }

    setMergeFiles(list);
  };

  const handleMergeSubmit = async (e) => {
    e.preventDefault();

    if (!mergeFiles.length) {
      showError("Please select at least one file to merge.");
      return;
    }

    setIsMerging(true);
    try {
      const res = await apiMergePdfs(mergeFiles);
      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadName("merged", mergeFiles[0]);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showSuccess("Merged document downloaded successfully.");
    } catch (err) {
      console.error(err);
      showError(err.message);
    } finally {
      setIsMerging(false);
    }
  };

  const handleSplitFileSelected = (file) => {
    if (file && !isSupportedFile(file)) {
      setSplitFile(null);
      showError("Only PDF and DOCX files can be split. Please upload a .pdf or .docx document.");
      return;
    }
    setSplitFile(file || null);
  };

  const handleSplitSubmit = async (e) => {
    e.preventDefault();

    if (!splitFile) {
      showError("Please select a file to split.");
      return;
    }

    const from = parseInt(fromPage, 10);
    const to = parseInt(toPage, 10);
    if (!from || !to || from <= 0 || to < from) {
      showError(
        isDocx(splitFile)
          ? "Please provide a valid paragraph range (e.g. from 1 to 10)."
          : "Please provide a valid page range (e.g. from 1 to 3)."
      );
      return;
    }

    setIsSplitting(true);
    try {
      const res = await apiSplitPdf(splitFile, from, to);
      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadName("split", splitFile);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showSuccess("Split document downloaded successfully.");
    } catch (err) {
      console.error(err);
      showError(err.message);
    } finally {
      setIsSplitting(false);
    }
  };

  const splitRangeLabel = splitFile && isDocx(splitFile) ? "paragraph" : "page";

  return (
    <div className="space-y-5">
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
          Merge Documents
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
          Split Document
        </button>
      </div>

      {activeMode === "merge" && (
        <form
          onSubmit={handleMergeSubmit}
          className="space-y-4 bg-[#161b22] border border-[#30363d] rounded-xl p-4"
        >
          <FileDropZone
            label="Merge Documents"
            hint="Upload multiple PDF or DOCX files; they will be merged in order. All files must be the same type."
            multiple
            accept={ACCEPT_ATTR}
            disabled={isMerging}
            onFilesSelected={handleMergeFilesSelected}
          />

          {mergeFiles.length > 0 && (
            <div className="mt-2 text-xs text-slate-300">
              <p className="mb-1">
                <span className="font-medium">{mergeFiles.length}</span> file(s) selected:
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
            label="Split Document"
            hint="Upload a single PDF or DOCX file and choose the range to extract."
            multiple={false}
            accept={ACCEPT_ATTR}
            disabled={isSplitting}
            onFilesSelected={handleSplitFileSelected}
          />

          {splitFile && (
            <p className="mt-2 text-xs text-slate-300">
              Selected:{" "}
              <span className="text-emerald-400 font-medium">{splitFile.name}</span>
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                From {splitRangeLabel}
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
                To {splitRangeLabel}
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
            {splitFile && isDocx(splitFile)
              ? "The selected paragraph range will be extracted as a new DOCX file. (DOCX files use paragraph numbers, not page numbers.)"
              : "The selected page range will be extracted as a new PDF."}
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
