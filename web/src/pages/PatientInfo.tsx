import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function PatientInfo() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [part, setPart] = useState("");

  return (
    <section className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
      <div className="grid gap-4">
        <label className="grid gap-1">
          <span>Patient Name</span>
          <input className="border rounded px-3 py-2" value={name} onChange={e=>setName(e.target.value)} />
        </label>
        <label className="grid gap-1">
          <span>Scan Type</span>
          <select className="border rounded px-3 py-2" value={part} onChange={e=>setPart(e.target.value)}>
            <option value="">Select body part</option>
            <option>Elbow</option>
            <option>Forearm</option>
            <option>Wrist</option>
          </select>
        </label>
        <button
          onClick={()=> nav("/upload", { state: { patient: { name, bodyPart: part } } })}
          className="mt-2 rounded-lg px-4 py-2 bg-indigo-600 text-white disabled:opacity-50"
          disabled={!name || !part}
        >
          Continue to Upload →
        </button>
      </div>
    </section>
  );
}
