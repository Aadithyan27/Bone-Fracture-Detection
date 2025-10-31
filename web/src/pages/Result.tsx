// web/src/pages/Result.tsx
import React, { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { predictImage } from "../lib/api";
import type { ApiImageResult } from "../types";
import ImageWithBoxes from "../components/ImageWithBoxes";

export default function Result() {
  const nav = useNavigate();
  const { state } = useLocation() as { state?: { file?: File } };

  const [conf, setConf] = useState<number>(0.50); // 0..1
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiImageResult | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const file = state?.file;

  // Make a local URL for preview
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
    setResult(null);
    try {
      const data = await predictImage(file, conf);
      setResult(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  // Auto-run once when arriving if we already have a file
  React.useEffect(() => {
    if (file) handleRefresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  if (!file) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Bone Fracture Detection</h1>
        <p className="mb-4">No image to analyze. Go back to upload.</p>
        <button className="px-4 py-2 rounded bg-black text-white" onClick={() => nav("/upload")}>
          Go to Upload
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold">Bone Fracture Detection</h1>
      <p className="text-gray-500 mb-6">AI-powered X-ray analysis for rapid fracture identification</p>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <label className="font-medium">Confidence</label>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round(conf * 100)}
          onChange={e => setConf(parseInt(e.target.value, 10) / 100)}
        />
        <span className="w-14 text-right">{Math.round(conf * 100)}%</span>

        <button
          onClick={handleRefresh}
          className="ml-4 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Running..." : "Refresh"}
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-red-600 mb-4">Error: {error}</p>}

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-4 shadow">
          {fileUrl ? (
            result ? (
              <ImageWithBoxes
                fileUrl={fileUrl}
                originalW={result.width}
                originalH={result.height}
                detections={result.detections || []}
                minScore={conf} // optionally also filter client-side
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                {loading ? "Analyzing..." : "Image will appear here"}
              </div>
            )
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              Loading preview...
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-3">Summary</h2>
          {result ? (
            <div className="space-y-2">
              <div>Fractured: <b>{result.summary.fractured ? "true" : "false"}</b></div>
              <div>Types: <b>{result.summary.types.length ? result.summary.types.join(", ") : "—"}</b></div>
              <div>Detections: <b>{result.detections.length}</b></div>
            </div>
          ) : (
            <div className="text-gray-400">—</div>
          )}
        </div>
      </div>
    </div>
  );
}
