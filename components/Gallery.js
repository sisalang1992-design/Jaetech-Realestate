"use client";
import { useState } from "react";
export default function Gallery({ photos, thumbs, title }) {
  const [i, setI] = useState(0);
  if (!photos.length) return <div className="main ph">사진 준비 중</div>;
  return (
    <>
      <img className="main" src={photos[i]} alt={`${title} 사진 ${i + 1}`} width="1280" height="853" />
      {photos.length > 1 && (
        <div className="th">
          {thumbs.map((t, k) => (
            <button type="button" key={k} onClick={() => setI(k)} aria-label={`사진 ${k + 1} 보기`}>
              <img src={t} alt="" className={k === i ? "on" : ""} loading="lazy" width="76" height="56" />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
