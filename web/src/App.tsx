import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import "./index.css";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      {/* pushed by sidebar in screen, but not in print */}
      <div className="lg:pl-72 print:pl-0 print-pl-0">
        <TopBar />
        <main className="max-w-7xl mx-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

