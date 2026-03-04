// src/App.jsx
import PdfTools from "./components/PdfTools";

function App() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl bg-[#161b22] border border-[#30363d] rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
        <header className="space-y-1">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-50">
            PDF Microservice
          </h1>
          <p className="text-sm text-slate-400">
            Merge PDFs or extract a page range into a new PDF.
          </p>
        </header>

        <PdfTools />

        <footer className="pt-2 text-xs text-slate-500">
          Endpoints: <span className="text-slate-400">POST /pdf/merge</span>,{" "}
          <span className="text-slate-400">POST /pdf/split</span>
        </footer>
      </div>
    </div>
  );
}

export default App;