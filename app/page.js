import Card from "../components/Card";
import DealTabs from "../components/DealTabs";
import { CAT, dealOf, KAKAO } from "../lib/fmt";
import { db, COLS, latest } from "../lib/db";
import { IconOffice, IconStore, IconBuilding, IconRequest, MailIc, PhoneIc, PinIc } from "../components/Icons";
import site from "../site.json";
export const revalidate = 60;
const Sec = ({ t, s, more, children }) => <section className="sec2"><div className="sh2"><h2>{t}</h2>{more && <a className="more" href={more}>전체 매물 보기 →</a>}</div>{s && <p className="sub">{s}</p>}{children}</section>;
export default async function Home() {
  const keys = Object.keys(CAT);
  const [rows, allRes, counts] = await Promise.all([
    Promise.all(keys.map(c => latest(c, 8))),
    db.from("listings").select(COLS).eq("is_active", true).order("created_at", { ascending: false }).limit(60),
    Promise.all(keys.map(async c => {
      const { count } = await db.from("listings").select("id", { count: "exact", head: true }).eq("category", c).eq("is_active", true);
      return [c, count || 0];
    })),
  ]);
  const all = allRes.data || [], featured = all.filter(l => l.is_featured).slice(0, 4);
  const groups = ["매매", "전세", "월세"].map(key => ({ key, rows: all.filter(l => dealOf(l) === key).slice(0, 8) })).filter(g => g.rows.length);
  const cnt = Object.fromEntries(counts), tel = "tel:" + site.phone.replace(/[^0-9+]/g, "");
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
        {featured.length > 0 && <Sec t="추천 매물" s="전문가가 엄선한 매물"><div className="grid">{featured.map(l => <Card key={l.id} l={l} />)}</div></Sec>}
        {keys.map((c, n) => rows[n].length > 0 && <Sec key={c} t={`${CAT[c]} 신규 매물`} more={`/${c}`}><div className="grid">{rows[n].map(l => <Card key={l.id} l={l} />)}</div></Sec>)}
        {groups.length > 0 && <Sec t="거래 유형별 매물" s="매매, 전세, 월세 중 원하는 조건으로 찾아보세요"><DealTabs groups={groups} /></Sec>}
      </main>
      <section className="cs" id="consult"><div className="in">
        <div>
          <span className="ey">빠른 상담</span><h2>편하게 문의하세요</h2>
          <p>카카오톡 오픈채팅으로 원하시는 지역과 조건을 남겨 주시면 담당자가 확인 후 답변드립니다.</p>
          <p>전화로 바로 문의하셔도 됩니다.</p>
          <div className="cx"><span className="ic" aria-hidden="true"><PhoneIc /></span><div><small>전화</small>{site.phone}</div></div>
          <div className="cx"><span className="ic" aria-hidden="true"><PinIc /></span><div><small>주소</small>{i.address}</div></div>
        </div>
        <div className="qa">
          <a className="kk" href={KAKAO} target="_blank" rel="noopener noreferrer"><b>카카오톡 오픈채팅 상담</b><span>대화로 편하게 바로 문의하세요</span></a>
          <a className="tl" href={tel}><b>전화 상담</b><span>{site.phone}</span></a>
          <a className="tl" href="/request"><b>매물 내놓기 · 구하기 접수</b><span>조건을 남겨 두시면 확인 후 연락드립니다</span></a>
        </div>
      </div></section>
    </>
  );
}
