// src/api/api.js

export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:8080"; // gateway base

console.log("API_BASE:", API_BASE);

async function postMultipart(path, formData) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    let message = "Request failed";

    try {
      const text = await res.text();
      if (text) {
        try {
          const data = JSON.parse(text);
          message =
            data?.message ||
            data?.error ||
            text;
        } catch {
          message = text;
        }
      }
    } catch {
      // ignore
    }

    throw new Error(message);
  }

  return res;
}

// PDF endpoints
export async function apiMergePdfs(files) {
  const form = new FormData();
  files.forEach((file) => form.append("files", file)); // "files" matches backend
  return postMultipart("/api/pdf/merge", form);
}

export async function apiSplitPdf(file, fromPage, toPage) {
  const form = new FormData();
  form.append("file", file);
  form.append("fromPage", String(fromPage));
  form.append("toPage", String(toPage));
  return postMultipart("/api/pdf/split", form);
}

// Image endpoints (if your backend exposes them)
export async function apiResizeImage(file, width, height) {
  const form = new FormData();
  form.append("file", file);
  form.append("width", String(width));
  form.append("height", String(height));
  return postMultipart("/api/image/resize", form);
}

export async function apiConvertImage(file, format) {
  const form = new FormData();
  form.append("file", file);
  form.append("format", format);
  return postMultipart("/api/image/convert", form);
}

export async function apiCompressImage(file, quality) {
  const form = new FormData();
  form.append("file", file);
  form.append("quality", String(quality));
  return postMultipart("/api/image/compress", form);
}

// File info endpoint (optional)
export async function apiFileInfo(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await postMultipart("/api/file/info", form);
  return res.json();
}

