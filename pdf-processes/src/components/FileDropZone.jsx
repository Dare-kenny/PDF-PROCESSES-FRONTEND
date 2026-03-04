// src/components/FileDropZone.jsx
import { useRef } from "react";

function FileDropZone({
  label,
  hint,
  multiple = false,
  accept,
  disabled = false,
  onFilesSelected,
}) {
  const inputRef = useRef(null);

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    if (disabled) return;
    preventDefaults(e);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    onFilesSelected(multiple ? Array.from(files) : files[0]);
  };

  const handleInputChange = (e) => {
    if (disabled) return;

    const files = e.target.files;
    if (!files || files.length === 0) return;

    onFilesSelected(multiple ? Array.from(files) : files[0]);
  };

  const handleClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  return (
    <div
      className={`border border-dashed border-[#30363d] rounded-xl p-4 text-center bg-[#161b22] hover:bg-[#1f242d] transition cursor-pointer ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
      onClick={handleClick}
      onDragEnter={preventDefaults}
      onDragOver={preventDefaults}
      onDragLeave={preventDefaults}
      onDrop={handleDrop}
    >
      {label && (
        <p className="text-sm font-medium text-slate-100 mb-1">{label}</p>
      )}
      {hint && <p className="text-xs text-slate-400 mb-1">{hint}</p>}
      <p className="text-xs text-slate-500">
        {multiple
          ? "Click to browse or drag multiple files here"
          : "Click to browse or drag a file here"}
      </p>

      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
      />
    </div>
  );
}

export default FileDropZone;
