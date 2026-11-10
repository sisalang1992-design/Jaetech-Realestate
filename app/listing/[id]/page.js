import { notFound } from "next/navigation";
import { cache } from "react";
import { db, COLS } from "../../../lib/db";
import { CAT, dealOf, priceFull, thumb, wonU, KAKAO } from "../../../lib/fmt";
import Gallery from "../../../components/Gallery";
import Card from "../../../components/Card";
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
  const { data: rel } = await db.from("listings").select(COLS).eq("is_active", true).eq("category", l.category).neq("id", l.id).order("created_at", { ascending: false }).limit(3);
  const ph = l.photos || [], tel = "tel:" + site.phone.replace(/[^0-9+]/g, ""), I = site.info;
  const cnt = x => x === null || x === undefined ? "-" : x + "개";
  const park = /^\d+$/.test(l.parking || "") ? `${l.parking}대` : v(l.parking);
  const extra = [["권리금", l.key_money], ["엘리베이터", l.elevator], ["냉/난방", l.heating], ["화장실", l.restroom], ["주용도", l.main_use]].filter(r => r[1]);
  const ld = { "@context": "https://schema.org", "@type": "RealEstateListing", name: l.title, description: desc(l), url: `${site.siteUrl}/listing/${l.id}`, image: ph, datePosted: l.created_at };
  return (
    <main className="in">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <nav className="bc" aria-label="현재 위치"><a href="/">홈</a> › <a href={`/${l.category}`}>{CAT[l.category]}</a> › {l.title}</nav>
      <div className="dt">
        <div>
          <Gallery photos={ph} thumbs={ph.map(thumb)} title={l.title} />
          {l.description && <div className="box desc" style={{ marginTop: 20 }}>{l.description}</div>}
        </div>
        <div>
          <div className="box">
            <span className="bd">계약가능</span><span className="bd cat">{CAT[l.category]}</span>{l.is_violation && <span className="bd w">위반건축물</span>}
            <h1>{l.title}</h1>
            <p className={"pbig" + (dealOf(l) === "매매" ? " red" : "")}>{priceFull(l)}</p>
            <G t="기본정보" rows={[["매물번호", l.id], ["소재지", v(l.area_name)], ["거래형태", dealOf(l) === "매매" ? "매매" : "임대차 · " + dealOf(l)], ["금액", priceFull(l)],
              ["층수", `${v(l.floor)} / 총 ${v(l.floor_total)}`], ["전용면적", l.area_m2 ? `${l.area_m2}㎡${l.size_pyeong ? ` (약 ${l.size_pyeong}평)` : ""}` : "-"],
              ["관리비", l.maintenance_fee == null ? "-" : l.maintenance_fee === 0 ? "없음" : wonU(l.maintenance_fee)]]} />
            <G t="상세정보" rows={[["중개대상물 종류", v(l.property_type)], ["사용승인일", dt(l.approval_date)], ["입주가능일", v(l.move_in)], ["주차", park],
              ["욕실 수", cnt(l.bath_count)], ...(l.room_count != null ? [["방 수", cnt(l.room_count)]] : []), ["방향", l.entrance_dir ? l.entrance_dir + " (주출입구 기준)" : "-"]]} />
            {extra.length > 0 && <G t="추가정보" rows={extra} />}
            <div className="acts"><a className="btn kbtn" href={KAKAO} target="_blank" rel="noopener noreferrer">카카오톡으로 문의</a><a className="btn" href={tel}>전화 문의 {site.phone}</a><a className="btn line" href={`/${l.category}`}>목록으로</a></div>
            <p className="hint">카톡으로 문의하실 때 <b>매물번호 {l.id}번</b>을 알려주세요.</p>
          </div>
          <div className="box off"><b>{site.name}</b><br />개업공인중개사 {I.ceo} · 등록번호 {I.regNo}<br />{I.address}<br />Tel {site.phone} · {I.email}</div>
        </div>
      </div>
      {rel && rel.length > 0 && <section className="sec2"><div className="sh"><h2>다른 {CAT[l.category]} 매물</h2></div><div className="grid">{rel.map(x => <Card key={x.id} l={x} />)}</div></section>}
    </main>
  );
}
