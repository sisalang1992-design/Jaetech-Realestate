import Card from "../components/Card";
import { CAT } from "../lib/fmt";
import { latest } from "../lib/db";
export const revalidate = 60;
export default async function Home() {
  const secs = await Promise.all(Object.keys(CAT).map(async c => [c, await latest(c, 4)]));
  return (
    <>
      <section className="hero"><div className="in">
        <h1>사무실 · 상가 · 건물매매<br />전문 부동산</h1>
        <p>실매물, 실사진, 책임 중개로 안내합니다.</p>
        <form className="sb" action="/search">
          <label>매물 종류<select name="cat">{Object.keys(CAT).map(c => <option key={c} value={c}>{CAT[c]}</option>)}</select></label>
          <label>제목·지역<input name="q" type="text" placeholder="예: 역세권, 코너" /></label>
          <button className="btn" type="submit">매물 검색</button>
        </form>
      </div></section>
      <main className="in">
        {secs.map(([c, rows]) => (
          <section className="sec" key={c}>
            <div className="sh"><h2>신규 {CAT[c]} 매물</h2><a className="more" href={`/${c}`}>전체 보기</a></div>
            {rows.length ? <div className="grid">{rows.map(l => <Card key={l.id} l={l} />)}</div> : <p className="empty">등록된 매물이 없습니다.</p>}
          </section>
        ))}
      </main>
    </>
  );
}
