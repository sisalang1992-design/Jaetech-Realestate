"use client";
import { useState } from "react";
export default function Gallery({ photos, thumbs, title }) {
  const [i, setI] = useState(0);
  if (!photos.length) return <div className="main ph">사진 준비 중</div>;
  return (
    <>
      <div className="gm">
        <img className="main" src={photos[i]} alt={`${title} 사진 ${i + 1}`} width="1280" height="853" />
        {photos.length > 1 && <span className="cnt">{i + 1} / {photos.length}</span>}
      </div>
      {photos.length > 1 && (
        <div className="th">
          {thumbs.map((t, k) => (
            <button type="button" key={k} onClick={() => setI(k)} aria-label={`사진 ${k + 1} 보기`} aria-pressed={k === i}>
              <img src={t} alt="" className={k === i ? "on" : ""} loading="lazy" width="88" height="64" />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
