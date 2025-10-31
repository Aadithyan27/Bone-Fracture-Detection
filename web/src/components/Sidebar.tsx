import { Link, useLocation } from "react-router-dom";

const NavItem = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const active = pathname === to || (to === "/" && pathname === "/");
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
      ${active ? "bg-indigo-100 text-indigo-700" : "hover:bg-slate-100 text-slate-700"}`}
    >
      {children}
    </Link>
  );
};

export default function Sidebar() {
  return (
    <aside className="no-print fixed left-0 top-0 h-screen w-72 border-r bg-slate-50/80 backdrop-blur p-5 lg:p-6 z-40">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-indigo-600 grid place-items-center text-white font-bold shadow-sm">
          <span className="text-lg">𝝙</span>
        </div>
        <div>
          <div className="font-semibold text-slate-900">FractureAI</div>
          <div className="text-xs text-slate-500">Bone Fracture Detection</div>
        </div>
      </div>

      {/* Section heading */}
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
        Navigation
      </div>
      <nav className="grid gap-2 mb-8">
        <NavItem to="/">New Analysis</NavItem>
        {/* No Analysis History (as requested) */}
      </nav>

      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
        About
      </div>
      <div className="rounded-xl border bg-white p-4 shadow-sm mb-4">
        <div className="font-medium mb-1">AI-Powered Detection</div>
        <p className="text-sm text-slate-600">
          Advanced vision AI analyzes X-ray images for fracture detection.
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="text-sm font-medium text-amber-800 mb-1">Medical Disclaimer</div>
        <p className="text-xs text-amber-900/90">
          This is an AI-assisted tool. Always consult a qualified medical professional.
        </p>
      </div>
    </aside>
  );
}
