import { notFound } from "next/navigation";
import { cache } from "react";
import { db } from "../../../lib/db";
import { CAT, dealOf, priceFull, thumb, wonU } from "../../../lib/fmt";
import Gallery from "../../../components/Gallery";
import site from "../../../site.json";
export const revalidate = 60;
export async function generateStaticParams() { return []; }
const get = cache(async id => {
  const n = Number(id); if (!Number.isInteger(n)) return null;
  const { data } = await db.from("listings").select("*").eq("id", n).eq("is_active", true).maybeSingle();
  return data;
});
const v = x => (x === null || x === undefined || x === "") ? "-" : x;
const dt = x => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(x || ""); return m ? `${m[1]}년 ${+m[2]}월 ${+m[3]}일` : "-"; };
const desc = l => [l.area_name, l.property_type || CAT[l.category], dealOf(l), priceFull(l), l.area_m2 ? `전용 ${l.area_m2}㎡` : "", l.floor && l.floor_total ? `${l.floor}/총 ${l.floor_total}` : l.floor].filter(Boolean).join(" · ");
export async function generateMetadata({ params }) {
  const l = await get(params.id);
  if (!l) return { title: "매물을 찾을 수 없습니다", robots: { index: false } };
  return { title: `${l.area_name ? l.area_name + " " : ""}${l.title}`, description: desc(l), alternates: { canonical: `/listing/${l.id}` },
    openGraph: { images: l.photos && l.photos[0] ? [l.photos[0]] : [] } };
}
const G = ({ t, rows }) => <><h2 className="gt">{t}</h2><dl>{rows.flatMap(([k, x]) => [<dt key={k + "t"}>{k}</dt>, <dd key={k + "d"}>{x}</dd>])}</dl></>;
export default async function Detail({ params }) {
  const l = await get(params.id); if (!l) notFound();
  const ph = l.photos || [], tel = "tel:" + site.phone.replace(/[^0-9+]/g, ""), I = site.info;
  const cnt = x => x === null || x === undefined ? "-" : x + "개";
  const park = /^\d+$/.test(l.parking || "") ? `${l.parking}대` : v(l.parking);
  const extra = [["권리금", l.key_money], ["엘리베이터", l.elevator], ["냉/난방", l.heating], ["화장실", l.restroom], ["주용도", l.main_use]].filter(r => r[1]);
  const ld = { "@context": "https://schema.org", "@type": "RealEstateListing", name: l.title, description: desc(l), url: `${site.siteUrl}/listing/${l.id}`, image: ph, datePosted: l.created_at };
  return (
    <main className="in">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="dt">
        <div>
          <Gallery photos={ph} thumbs={ph.map(thumb)} title={l.title} />
          {l.description && <div className="box desc" style={{ marginTop: 20 }}>{l.description}</div>}
        </div>
        <div>
          <div className="box">
            <span className="tag">{CAT[l.category]}</span>{l.is_violation && <span className="tag warn">위반건축물</span>}
            <h1>{l.title}</h1>
            <G t="기본정보" rows={[["매물번호", l.id], ["소재지", v(l.area_name)], ["거래형태", dealOf(l) === "매매" ? "매매" : "임대차 · " + dealOf(l)], ["금액", priceFull(l)],
              ["층수", `${v(l.floor)} / 총 ${v(l.floor_total)}`], ["전용면적", l.area_m2 ? `${l.area_m2}㎡${l.size_pyeong ? ` (약 ${l.size_pyeong}평)` : ""}` : "-"],
              ["관리비", l.maintenance_fee == null ? "-" : l.maintenance_fee === 0 ? "없음" : wonU(l.maintenance_fee)]]} />
            <G t="상세정보" rows={[["중개대상물 종류", v(l.property_type)], ["사용승인일", dt(l.approval_date)], ["입주가능일", v(l.move_in)], ["주차", park],
              ["욕실 수", cnt(l.bath_count)], ...(l.room_count != null ? [["방 수", cnt(l.room_count)]] : []), ["방향", l.entrance_dir ? l.entrance_dir + " (주출입구 기준)" : "-"]]} />
            {extra.length > 0 && <G t="추가정보" rows={extra} />}
            <a className="btn" style={{ display: "block", marginTop: 18 }} href={tel}>전화 문의 {site.phone}</a>
          </div>
          <div className="box off"><b>{site.name}</b><br />개업공인중개사 {I.ceo} · 등록번호 {I.regNo}<br />{I.address}<br />Tel {site.phone} · {I.email}</div>
        </div>
      </div>
    </main>
  );
}
