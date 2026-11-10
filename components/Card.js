import { dealOf, priceBrief, metaText, thumb } from "../lib/fmt";
const isNew = d => d && Date.now() - new Date(d).getTime() < 7 * 86400000;
export default function Card({ l }) {
  const p = l.photos && l.photos[0], d = dealOf(l);
  return (
    <a className="card" href={`/listing/${l.id}`}>
      <div className="ci">
        {p ? <img src={thumb(p)} alt={`${l.title} 사진`} loading="lazy" width="480" height="320" /> : <div className="ph">사진 준비 중</div>}
        <span className="bds">{isNew(l.created_at) && <span className="nw">NEW</span>}{l.is_featured && <span className="rc">추천</span>}</span>
        {l.is_violation && <span className="vio">위반건축물</span>}
      </div>
      <div className="cb">
        <h3>{l.title}</h3><p className="meta">{metaText(l)}</p>
        <div className="cr"><span>{d}</span><span className={d === "매매" ? "pr red" : "pr grn"}>{priceBrief(l)}</span></div>
      </div>
    </a>
  );
}
