import { notFound } from "next/navigation";
import Card from "../../components/Card";
import { db, COLS } from "../../lib/db";
import { CAT } from "../../lib/fmt";
import site from "../../site.json";
export const dynamic = "force-dynamic";
export const dynamicParams = false;
const NAME = { ...CAT, all: "전체" }, DEALS = ["매매", "전세", "월세"], PER = 12;
export function generateStaticParams() { return Object.keys(NAME).map(cat => ({ cat })); }
export function generateMetadata({ params, searchParams }) {
  const c = params.cat;
  return { title: `${NAME[c]} 매물`, description: `${site.name}의 ${NAME[c]} 매물 목록입니다. 보증금, 월세, 면적, 층수 정보를 확인하세요.`,
    alternates: { canonical: `/${c}` }, robots: searchParams.q || searchParams.deal ? { index: false } : undefined };
}
export default async function List({ params, searchParams }) {
  const cat = params.cat; if (!NAME[cat]) notFound();
  const q = (searchParams.q || "").replace(/[,()%*]/g, " ").trim(), page = Math.max(1, parseInt(searchParams.page) || 1);
  const deal = DEALS.includes(searchParams.deal) ? searchParams.deal : "";
  let r = db.from("listings").select(COLS, { count: "exact" }).eq("is_active", true);
  if (cat !== "all") r = r.eq("category", cat);
  if (deal) r = r.eq("deal_type", deal);
  if (q) r = r.or(`title.ilike.%${q}%,area_name.ilike.%${q}%`);
  const { data, count } = await r.order("is_featured", { ascending: false }).order("created_at", { ascending: false }).range((page - 1) * PER, page * PER - 1);
  const last = Math.ceil((count || 0) / PER);
  const u = n => `/${cat}?page=${n}${q ? "&q=" + encodeURIComponent(q) : ""}${deal ? "&deal=" + encodeURIComponent(deal) : ""}`;
  return (
    <main className="in" style={{ paddingTop: 32 }}>
      <h1 className="pt">{NAME[cat]} 매물</h1>
      <form className="fb" action={`/${cat}`}>
        <label>제목·지역 검색<input name="q" type="text" defaultValue={q} /></label>
        <label>거래형태<select name="deal" defaultValue={deal}><option value="">전체</option>{DEALS.map(d => <option key={d}>{d}</option>)}</select></label>
        <button className="btn" type="submit" style={{ height: 46 }}>검색</button>
      </form>
      <div className="grid">{data && data.length ? data.map(l => <Card key={l.id} l={l} />) : <p className="empty">조건에 맞는 매물이 없습니다.</p>}</div>
      {last > 1 && <div className="pgn">{page > 1 && <a className="btn line sm" href={u(page - 1)}>이전</a>}<span>{page} / {last}</span>{page < last && <a className="btn line sm" href={u(page + 1)}>다음</a>}</div>}
    </main>
  );
}
