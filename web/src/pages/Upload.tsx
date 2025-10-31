import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Upload() {
  const nav = useNavigate();
  const { state } = useLocation() as { state?: any };
  const patient = state?.patient;
  const [file, setFile] = useState<File|null>(null);

  return (
    <section className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Upload X-ray for {patient?.name ?? "patient"}</h2>
      <div className="grid gap-4">
        <input type="file" accept="image/*" onChange={(e)=> setFile(e.target.files?.[0] ?? null)} />
        <div className="flex gap-3">
          <button onClick={()=> nav(-1)} className="rounded-lg px-4 py-2 border">Back to Patient Info</button>
          <button
            className="rounded-lg px-4 py-2 bg-indigo-600 text-white disabled:opacity-50"
            disabled={!file}
            onClick={()=> nav("/result", { state: { file, patient } })}
          >
            Analyze →
          </button>
        </div>
      </div>
    </section>
  );
}
