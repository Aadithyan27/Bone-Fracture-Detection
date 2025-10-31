// web/src/types.ts
export type Detection = {
  box: [number, number, number, number]; // [x1,y1,x2,y2] in pixels
  cls: number;
  class_name: string;
  score: number;
};

export type ApiImageResult = {
  filename: string;
  width: number;
  height: number;
  detections: Detection[];
  summary: { fractured: boolean; types: string[] };
};
