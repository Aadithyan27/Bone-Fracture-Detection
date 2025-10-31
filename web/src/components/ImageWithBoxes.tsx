// web/src/components/ImageWithBoxes.tsx
import React, { useEffect, useRef, useState } from "react";
import type { Detection } from "../types";

type Props = {
  fileUrl: string;          // URL.createObjectURL(file)
  originalW: number;        // API: original image width
  originalH: number;        // API: original image height
  detections: Detection[];  // API detections with absolute xyxy
  minScore?: number;        // optional client-side filter
};

export default function ImageWithBoxes({
  fileUrl,
  originalW,
  originalH,
  detections,
  minScore = 0,
}: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const update = () => {
      setSize({ w: img.clientWidth, h: img.clientHeight });
    };

    // Update when the image finishes loading
    if (img.complete) update();
    img.addEventListener("load", update);

    // Keep in sync with resizes
    const ro = new ResizeObserver(update);
    ro.observe(img);
    window.addEventListener("resize", update);

    return () => {
      img.removeEventListener("load", update);
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [fileUrl]);

  const scaleX = originalW ? size.w / originalW : 1;
  const scaleY = originalH ? size.h / originalH : 1;

  return (
    <div className="inline-block relative">
      {/* important: block removes inline-gap, overlay anchors to this box */}
      <img
        ref={imgRef}
        src={fileUrl}
        alt="xray"
        className="block max-w-full h-auto rounded-xl shadow"
      />

      {/* overlay exactly the size of the rendered image */}
      <div className="pointer-events-none absolute inset-0">
        {detections
          .filter((d) => d.score >= minScore)
          .map((d, idx) => {
            const [x1, y1, x2, y2] = d.box;
            const left = x1 * scaleX;
            const top = y1 * scaleY;
            const w = (x2 - x1) * scaleX;
            const h = (y2 - y1) * scaleY;
            return (
              <div
                key={idx}
                className="absolute border-2 border-red-500 rounded-md"
                style={{
                  left,
                  top,
                  width: w,
                  height: h,
                  boxShadow: "0 0 0 2px rgba(255,0,0,0.3) inset",
                }}
                title={`${d.class_name} (${(d.score * 100).toFixed(1)}%)`}
              />
            );
          })}
      </div>
    </div>
  );
}
