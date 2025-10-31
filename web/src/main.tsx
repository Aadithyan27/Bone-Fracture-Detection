import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";

// pages
import PatientInfo from "./pages/PatientInfo";
import Upload from "./pages/Upload";
import Result from "./pages/Result";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <PatientInfo /> },
      { path: "/upload", element: <Upload /> },
      { path: "/result", element: <Result /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
