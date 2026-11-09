import Card from "../components/Card";
import DealTabs from "../components/DealTabs";
import ConsultForm from "../components/ConsultForm";
import { CAT, dealOf } from "../lib/fmt";
import { db, COLS } from "../lib/db";
import { IconOffice, IconStore, IconBuilding, IconRequest, MailIc, PhoneIc, PinIc } from "../components/Icons";
import site from "../site.json";
export const revalidate = 60;
const Sec = ({ t, s, children }) => <section className="sec2"><div className="sh"><h2>{t}</h2>{s && <p>{s}</p>}</div>{children}</section>;
export default async function Home() {
  const { data } = await db.from("listings").select(COLS).eq("is_active", true).order("created_at", { ascending: false }).limit(60);
  const all = data || [];
  const latest = all.slice(0, 6), featured = all.filter(l => l.is_featured).slice(0, 3);
  const groups = ["매매", "전세", "월세"].map(key => ({ key, rows: all.filter(l => dealOf(l) === key).slice(0, 6) })).filter(g => g.rows.length);
  const counts = await Promise.all(Object.keys(CAT).map(async c => {
    const { count } = await db.from("listings").select("id", { count: "exact", head: true }).eq("category", c).eq("is_active", true);
    return [c, count || 0];
  }));
  const cnt = Object.fromEntries(counts);
  const i = site.info, hero = site.heroImage ? { backgroundImage: `linear-gradient(rgba(15,22,32,.55),rgba(15,22,32,.65)), url(${site.heroImage})` } : undefined;
  return (
    <>
      <section className="hero2" style={hero}><div className="in">
        <p className="hs">{site.heroSub || "누구보다 빠르게 좋은 매물을 안내해드리겠습니다."}</p>
        <h1>{site.heroTitle || "사무실 · 상가 · 건물매매, 제대로 찾는 중개"}</h1>
        <form className="sb2" action="/search">
          <input name="q" type="text" placeholder="검색어를 입력하세요" aria-label="검색어" />
          <select name="cat" aria-label="매물 종류"><option value="all">전체 종류</option>{Object.keys(CAT).map(c => <option key={c} value={c}>{CAT[c]}</option>)}</select>
          <select name="deal" aria-label="거래형태"><option value="">거래형태</option><option>매매</option><option>전세</option><option>월세</option></select>
          <button type="submit">검색</button>
        </form>
      </div></section>
      <section className="quick"><div className="in">
        {[["office", <IconOffice />], ["store", <IconStore />], ["building", <IconBuilding />]].map(([c, ic]) => (
          <a key={c} className="qc" href={`/${c}`}><div><b>{CAT[c]}</b><span>{cnt[c] ? `${cnt[c]}건 · ` : ""}전체 매물 보기 →</span></div>{ic}</a>
        ))}
        <a className="qc req" href="/request"><div><b>매물의뢰<br />및 접수</b><span>내놓기·구하기 →</span></div><IconRequest /></a>
      </div></section>
      <main className="in">
        {latest.length > 0 && <Sec t="최신 매물" s="새로 등록된 매물을 가장 먼저 만나보세요">
          <div className="grid">{latest.map(l => <Card key={l.id} l={l} />)}</div>
          <div className="mid"><a className="btn" href="/all">전체 매물 보기 →</a></div></Sec>}
        {featured.length > 0 && <Sec t="추천 매물" s="전문가가 엄선한 매물"><div className="grid">{featured.map(l => <Card key={l.id} l={l} />)}</div></Sec>}
        {groups.length > 0 && <Sec t="거래 유형별 매물" s="매매, 전세, 월세 중 원하는 조건으로 찾아보세요"><DealTabs groups={groups} /></Sec>}
      </main>
      <section className="cs" id="consult"><div className="in">
        <div>
          <span className="ey">맞춤 상담</span><h2>무료 상담 신청</h2>
          <p>희망 지역, 예산, 일정만 남겨주시면 담당자가 조건에 맞는 매물을 확인해 연락드립니다.</p>
          <p>불필요한 항목은 줄이고, 상담에 필요한 정보만 간단히 받습니다.</p>
          <div className="cx"><span className="ic" aria-hidden="true"><MailIc /></span><div><small>이메일</small>{i.email}</div></div>
          <div className="cx"><span className="ic" aria-hidden="true"><PhoneIc /></span><div><small>전화</small>{site.phone}</div></div>
          <div className="cx"><span className="ic" aria-hidden="true"><PinIc /></span><div><small>주소</small>{i.address}</div></div>
        </div>
        <ConsultForm />
      </div></section>
    </>
  );
}
