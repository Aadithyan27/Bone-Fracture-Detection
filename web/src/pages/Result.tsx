// web/src/pages/Result.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { predictImage } from "../lib/api";
import type { ApiImageResult } from "../types";
import ImageWithBoxes from "../components/ImageWithBoxes";

export default function Result() {
  const nav = useNavigate();
  const { state } = useLocation() as {
    state?: { file?: File; patient?: { name?: string; bodyPart?: string; age?: string | number } };
  };

  // Default to 0.25 (25%) as requested
  const [conf, setConf] = React.useState<number>(0.25); // 0..1
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<ApiImageResult | null>(null);
  const [fileUrl, setFileUrl] = React.useState<string | null>(null);

  const file = state?.file;
  const patient = state?.patient ?? {};
  const now = React.useMemo(() => new Date().toLocaleString(), []);

  // Local preview
  React.useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleRefresh = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await predictImage(file, conf);
      setResult(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  // Auto-run once if we already have a file
  React.useEffect(() => {
    if (file) handleRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  // Status pill logic (treat healthy-only labels as "No Fracture")
  const healthyAliases = ["healthy", "normal", "no fracture", "no_fracture", "negative"];
  const isHealthyOnly =
    !!result &&
    Array.isArray(result.summary?.types) &&
    result.summary.types.length > 0 &&
    result.summary.types.every((t) => healthyAliases.some((h) => t.toLowerCase().includes(h)));

  const fractured = result == null ? null : (isHealthyOnly ? false : !!result.summary?.fractured);

  const statusLabel =
    fractured === null ? "Awaiting Analysis"
    : fractured ? "Fracture Detected" : "No Fracture Detected";

  const statusClass =
    fractured === null
      ? "bg-slate-200 text-slate-800"
      : fractured
        ? "bg-rose-100 text-rose-700"
        : "bg-emerald-100 text-emerald-700";

  // Print current page (export PDF via browser)
  const onExport = () => window.print();

  if (!file) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Analysis Report</h1>
        <p className="mb-4">No image to analyze. Please upload an X-ray.</p>
        <button className="px-4 py-2 rounded bg-black text-white" onClick={() => nav("/upload")}>
          Go to Upload
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Print-only styles to hide UI chrome */}
      <style>
        {`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-card { box-shadow: none !important; border-color: #e5e7eb !important; }
        }
        `}
      </style>

      {/* Header bar */}
      <div className="no-print bg-slate-50/80 backdrop-blur border rounded-xl p-4 mb-6 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">Analysis Report</h1>
          <div className="text-slate-600 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span><b>Patient:</b> {patient.name || "—"}</span>
            {patient.age ? <span>• <b>Age:</b> {patient.age}</span> : null}
            {patient.bodyPart ? <span>• <b>Body Part:</b> {patient.bodyPart}</span> : null}
            <span>• <b>Date:</b> {now}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}>
            {statusLabel}
          </span>
          <button
            onClick={onExport}
            className="ml-2 inline-flex items-center gap-2 rounded-lg bg-white border px-3 py-2 text-slate-700 hover:bg-slate-50 shadow-sm"
            title="Export Report (PDF)"
          >
            Export Report
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="no-print flex flex-wrap items-center gap-4 mb-6">
        <label className="font-medium">Confidence</label>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round(conf * 100)}
          onChange={(e) => { const v = parseInt(e.target.value, 10) / 100; setConf(v); }}
          className="w-52"
        />
        {/* Shows 25% at first load */}
        <span className="w-12 text-right">{Math.round(conf * 100)}%</span>

        <button
          onClick={handleRefresh}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Running..." : "Refresh"}
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-rose-600 mb-4">{error}</p>}

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* X-Ray Analysis card */}
        <div className="rounded-2xl border bg-white p-0 shadow-sm print-card">
          <div className="px-5 py-3 border-b bg-slate-50 rounded-t-2xl">
            <div className="font-semibold">X-Ray Analysis</div>
          </div>
          <div className="p-4">
            {fileUrl ? (
              result ? (
                <ImageWithBoxes
                  fileUrl={fileUrl}
                  originalW={result.width}
                  originalH={result.height}
                  detections={result.detections || []}
                  minScore={conf}
                />
              ) : (
                <div className="h-64 grid place-items-center text-gray-400">
                  {loading ? "Analyzing..." : "Image will appear here"}
                </div>
              )
            ) : (
              <div className="h-64 grid place-items-center text-gray-400">Loading preview…</div>
            )}
          </div>
        </div>

        {/* Clinical Findings card */}
        <div className="rounded-2xl border bg-white shadow-sm print-card">
          <div className="px-5 py-3 border-b bg-slate-50 rounded-t-2xl">
            <div className="font-semibold">Clinical Findings</div>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-slate-700 leading-relaxed">
              {fractured === null && "Run the analysis to view findings."}

              {fractured === false && (
                <>
                  {isHealthyOnly
                    ? <>The X-ray shows no signs of fracture. Findings are consistent with a healthy/normal study.</>
                    : <>No fracture detected.</>
                  }
                </>
              )}

              {fractured === true && (
                <>AI indicates fracture evidence{result?.summary?.types?.length ? ` (${result.summary.types.join(", ")})` : ""}. Please correlate clinically.</>
              )}
            </p>

            {/* Removed the "Analysis Confidence" section per your request */}

            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="text-sm font-semibold text-emerald-800 mb-1">Medical Recommendations</div>
              <p className="text-sm text-emerald-900/90">
                This is an AI-assisted report. For definitive diagnosis and treatment, consult a licensed clinician.
              </p>
            </div>

            <div className="text-sm text-slate-500">
              Detections: <b>{result?.detections?.length ?? 0}</b> • Types:{" "}
              <b>{result?.summary?.types?.length ? result.summary.types.join(", ") : "—"}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
