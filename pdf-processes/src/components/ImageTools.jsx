// src/components/ImageTools.jsx
import { useState, useEffect } from "react";
import FileDropZone from "./FileDropZone";
import Toast from "./Toast";
import {
  apiResizeImage,
  apiConvertImage,
  apiCompressImage,
} from "../api/api";

function ImageTools() {
  const [imageFile, setImageFile] = useState(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [format, setFormat] = useState("jpeg");
  const [quality, setQuality] = useState(80);
  const [loadingAction, setLoadingAction] = useState(null); // "resize" | "convert" | "compress" | null

  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  const showError = (msg) =>
    setToast({ type: "error", message: msg || "Something went wrong." });
  const showSuccess = (msg) => setToast({ type: "success", message: msg });

  const isImage = (file) => {
    if (!file) return false;
    return (file.type || "").startsWith("image/");
  };

  const handleImageSelected = (file) => {
    if (!file) {
      setImageFile(null);
      return;
    }
    if (!isImage(file)) {
      setImageFile(null);
      showError("Please upload a valid image file (PNG, JPEG, etc).");
      return;
    }
    setImageFile(file);
  };

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const ensureImageSelected = () => {
    if (!imageFile) {
      showError("Please select an image first.");
      return false;
    }
    return true;
  };

  const handleResize = async () => {
    if (!ensureImageSelected()) return;

    const w = parseInt(width, 10);
    const h = parseInt(height, 10);

    if (!w || !h || w <= 0 || h <= 0) {
      showError("Enter a valid width and height.");
      return;
    }

    setLoadingAction("resize");
    try {
      const res = await apiResizeImage(imageFile, w, h);
      const blob = await res.blob();
      downloadBlob(blob, "resized-image.png");
      showSuccess("Resized image downloaded successfully.");
    } catch (err) {
      console.error(err);
      showError(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleConvert = async () => {
    if (!ensureImageSelected()) return;

    setLoadingAction("convert");
    try {
      const res = await apiConvertImage(imageFile, format);
      const blob = await res.blob();
      downloadBlob(blob, `converted-image.${format}`);
      showSuccess(`Image converted to ${format.toUpperCase()} successfully.`);
    } catch (err) {
      console.error(err);
      showError(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCompress = async () => {
    if (!ensureImageSelected()) return;

    setLoadingAction("compress");
    try {
      const res = await apiCompressImage(imageFile, quality);
      const blob = await res.blob();
      downloadBlob(blob, "compressed-image.jpg");
      showSuccess("Compressed image downloaded successfully.");
    } catch (err) {
      console.error(err);
      showError(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 space-y-4">
        <FileDropZone
          label="Image Tools"
          hint="Upload an image to resize, convert or compress."
          multiple={false}
          accept="image/*"
          disabled={!!loadingAction}
          onFilesSelected={handleImageSelected}
        />

        {imageFile && (
          <p className="text-xs text-slate-300">
            Selected:{" "}
            <span className="text-emerald-400 font-medium">
              {imageFile.name}
            </span>{" "}
            ({Math.round(imageFile.size / 1024)} KB)
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {/* Resize block */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-100">
              Resize image
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Width (px)
                </label>
                <input
                  type="number"
                  min="1"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full rounded-md bg-[#0d1117] border border-[#30363d] px-2 py-1.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Height (px)
                </label>
                <input
                  type="number"
                  min="1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full rounded-md bg-[#0d1117] border border-[#30363d] px-2 py-1.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
            <button
              type="button"
              disabled={loadingAction === "resize"}
              onClick={handleResize}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-emerald-500 text-slate-900 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loadingAction === "resize"
                ? "Resizing..."
                : "Resize & Download"}
            </button>
          </div>

          {/* Convert block */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-100">
              Convert format
            </h3>
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Target format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full rounded-md bg-[#0d1117] border border-[#30363d] px-2 py-1.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
              </select>
            </div>
            <button
              type="button"
              disabled={loadingAction === "convert"}
              onClick={handleConvert}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 text-slate-900 hover:bg-blue-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loadingAction === "convert"
                ? "Converting..."
                : "Convert & Download"}
            </button>
          </div>
        </div>

        {/* Compress block */}
        <div className="space-y-3 pt-2 border-t border-[#30363d] mt-2">
          <h3 className="text-sm font-semibold text-slate-100">
            Compress image
          </h3>
          <label className="block text-xs text-slate-300 mb-1">
            Quality: <span className="font-medium">{quality}%</span>
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value, 10))}
            className="w-full accent-purple-500"
          />
          <button
            type="button"
            disabled={loadingAction === "compress"}
            onClick={handleCompress}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-purple-500 text-slate-900 hover:bg-purple-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loadingAction === "compress"
              ? "Compressing..."
              : "Compress & Download"}
          </button>
        </div>
      </div>

      <Toast
        type={toast?.type}
        message={toast?.message}
        onClose={() => setToast(null)}
      />
    </div>
  );
}

export default ImageTools;
