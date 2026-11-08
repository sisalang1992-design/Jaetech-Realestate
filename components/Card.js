import { CAT, priceText, metaText, thumb } from "../lib/fmt";
export default function Card({ l }) {
  const p = l.photos && l.photos[0];
  return (
    <a className="card" href={`/listing/${l.id}`}>
      {p ? <img src={thumb(p)} alt={`${l.title} 사진`} loading="lazy" width="480" height="320" /> : <div className="ph">사진 준비 중</div>}
      <div className="cb">
        {l.is_violation && <span className="tag warn">위반건축물</span>}
        {l.is_featured && <span className="tag">추천</span>}
        <span className="tag">{CAT[l.category]}</span>
        <h3>{l.title}</h3><p className="meta">{metaText(l)}</p><p className="price">{priceText(l)}</p>
      </div>
    </a>
  );
}
