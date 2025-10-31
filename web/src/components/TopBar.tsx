export default function TopBar() {
  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-6 py-5">
        <h1 className="text-3xl font-extrabold tracking-tight">Bone Fracture Detection</h1>
        <p className="text-slate-600">
          AI-powered X-ray analysis for rapid fracture identification
        </p>
      </div>
    </header>
  );
}
