import { Outlet, Link, useLocation } from "react-router-dom";
import TopBar from "./components/TopBar";

export default function App() {
  const loc = useLocation();
  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar />
      <nav className="max-w-6xl mx-auto px-6 py-3 flex gap-4 text-sm">
        <Link to="/" className={loc.pathname === "/" ? "font-semibold" : ""}>Patient</Link>
        <Link to="/upload" className={loc.pathname === "/upload" ? "font-semibold" : ""}>Upload</Link>
        <Link to="/result" className={loc.pathname === "/result" ? "font-semibold" : ""}>Result</Link>
      </nav>
      <main className="max-w-6xl mx-auto px-6 pb-10">
        <Outlet />
      </main>
    </div>
  );
}
