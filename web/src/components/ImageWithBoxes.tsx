// web/src/components/ImageWithBoxes.tsx
import React, { useRef, useState, useEffect } from "react";
import type { Detection } from "../types";

type Props = {
  fileUrl: string;            // URL.createObjectURL(file)
  originalW: number;          // API: original image width
  originalH: number;          // API: original image height
  detections: Detection[];    // API detections with absolute xyxy
  minScore?: number;          // optional client-side filter
};

export default function ImageWithBoxes({ fileUrl, originalW, originalH, detections, minScore = 0 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [dispW, setDispW] = useState<number>(0);
  const [dispH, setDispH] = useState<number>(0);

  useEffect(() => {
    const update = () => {
      const img = imgRef.current;
      if (!img) return;
      setDispW(img.clientWidth);
      setDispH(img.clientHeight);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const scaleX = originalW ? dispW / originalW : 1;
  const scaleY = originalH ? dispH / originalH : 1;

  return (
    <div ref={containerRef} className="relative w-full">
      <img ref={imgRef} src={fileUrl} alt="xray" className="w-full h-auto rounded-xl shadow" />
      {/* boxes */}
      {detections
        .filter(d => d.score >= minScore)
        .map((d, idx) => {
          const [x1, y1, x2, y2] = d.box;
          const left = x1 * scaleX;
          const top  = y1 * scaleY;
          const w    = (x2 - x1) * scaleX;
          const h    = (y2 - y1) * scaleY;
          return (
            <div
              key={idx}
              className="absolute border-2 border-red-500 rounded-md"
              style={{ left, top, width: w, height: h, boxShadow: "0 0 0 2px rgba(255,0,0,0.3) inset" }}
              title={`${d.class_name} (${(d.score * 100).toFixed(1)}%)`}
            />
          );
        })}
    </div>
  );
}
