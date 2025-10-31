import { Link, useLocation } from "react-router-dom";

const NavItem = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const active = pathname === to || (to === "/" && pathname === "/");
  return (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-xl transition
      ${active ? "bg-indigo-100 text-indigo-700" : "hover:bg-slate-100"}`}
    >
      {children}
    </Link>
  );
};

export default function Sidebar() {
  return (
    <aside className="border-r bg-white p-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-9 w-9 rounded-xl bg-indigo-600 grid place-items-center text-white font-bold">𝝙</div>
        <div>
          <div className="font-semibold">FractureScan</div>
          <div className="text-xs text-slate-500">AI-Powered Detection</div>
        </div>
      </div>
      <nav className="grid gap-2">
        <NavItem to="/">New Scan</NavItem>
        <NavItem to="/upload">Upload</NavItem>
        <NavItem to="/result">Result</NavItem>
      </nav>

      <div className="mt-8 p-4 rounded-xl bg-sky-50 border border-sky-100">
        <div className="font-medium mb-1">Medical Disclaimer</div>
        <p className="text-sm text-slate-600">
          Informational only. Always consult a licensed medical professional.
        </p>
      </div>
    </aside>
  );
}
