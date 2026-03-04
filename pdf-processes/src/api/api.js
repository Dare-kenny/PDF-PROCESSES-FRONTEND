// src/api/api.js

// In production, set VITE_API_BASE to your backend URL (e.g. https://pdf-service.onrender.com)
// In dev, we’ll proxy /pdf to localhost:8080, so API_BASE can be empty.
export const API_BASE = import.meta.env.VITE_API_BASE;

async function postMultipart(path, formData) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    let message = "Request failed";
    try {
      const text = await res.text();
      if (text) message = text;
    } catch {}
    throw new Error(message);
  }

  return res;
}

// ✅ PDF endpoints (match Spring @RequestMapping("/pdf"))
export async function apiMergePdfs(files) {
  const form = new FormData();
  files.forEach((file) => form.append("files", file)); // must be "files"
  return postMultipart("/pdf/merge", form);
}

export async function apiSplitPdf(file, fromPage, toPage) {
  const form = new FormData();
  form.append("file", file); // must be "file"
  form.append("fromPage", String(fromPage));
  form.append("toPage", String(toPage));
  return postMultipart("/pdf/split", form);
}