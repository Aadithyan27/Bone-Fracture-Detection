import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import PatientInfo from "./pages/PatientInfo";
import Upload from "./pages/Upload";
import Result from "./pages/Result";

class ErrorBoundary extends React.Component<{children: React.ReactNode},{error?: Error}> {
  constructor(props:any){ super(props); this.state = {}; }
  static getDerivedStateFromError(error: Error){ return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: "ui-sans-serif" }}>
          <h2>App crashed</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{String(this.state.error.stack || this.state.error.message)}</pre>
        </div>
      );
    }
    return this.props.children as any;
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <PatientInfo /> },
      { path: "upload", element: <Upload /> },
      { path: "result", element: <Result /> },
    ],
  },
]);

const root = document.getElementById("root");
if (!root) {
  throw new Error("Missing <div id='root'> in index.html");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>
);
