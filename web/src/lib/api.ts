// web/src/lib/api.ts
const API_BASE = import.meta.env.VITE_API_BASE as string; // e.g. http://127.0.0.1:8000

export async function predictImage(file: File, conf: number) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/predict?conf=${conf.toFixed(2)}`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error(`Predict failed: ${res.status}`);
  return res.json();
}
