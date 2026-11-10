"use client";
import { useState } from "react";
const KINDS = ["사무실", "상가", "건물", "기타"], DEALS = ["매매", "전세", "월세"];
// [이름, 라벨, 종류(s=선택,t=한줄,a=여러줄), 선택지/안내문, 필수, 전체폭]
const T = {
  sell: { tag: "[매물내놓기]", tab: "매물 내놓기", btn: "매물 내놓기 접수", desc: "임대하시거나 파실 사무실·상가·건물을 맡겨 주세요. 확인 후 연락드립니다.", f: [
    ["role", "의뢰인 구분", "s", ["소유자", "임대인", "임차인(양도·전대)", "대리인"], false],
    ["kind", "매물 종류", "s", KINDS, true],
    ["deal", "거래형태", "s", DEALS, true],
    ["price", "희망 금액", "t", "예: 보증금 3,000 / 월 150 (만원), 매매 10억", false],
    ["addr", "매물 소재지", "t", "예: 마포구 서교동 ○○번지 또는 건물명", true, 1],
    ["size", "면적·층", "t", "예: 전용 20평 / 3층(총 5층)", false],
    ["date", "입주 가능일", "t", "예: 즉시, 2026년 12월 초", false],
    ["note", "상세 내용", "a", "현재 임차 현황, 시설 상태, 특이사항 등을 적어 주세요.", false, 1],
  ] },
  buy: { tag: "[매물구하기]", tab: "매물 구하기", btn: "매물 구하기 접수", desc: "찾으시는 조건을 남겨 주시면 맞는 매물을 찾아 연락드립니다.", f: [
    ["kind", "찾는 종류", "s", KINDS, true],
    ["deal", "거래형태", "s", DEALS, true],
    ["addr", "희망 매물 소재지", "t", "예: 마포구 서교동, 홍대입구역 근처", false, 1],
    ["price", "희망 예산", "t", "예: 보증금 3,000 / 월 150 (만원), 매매 10억", false],
    ["size", "희망 면적", "t", "예: 15~25평", false],
    ["use", "업종·사용 목적", "t", "예: 카페, 사무실", false],
    ["date", "입주 희망일", "t", "예: 즉시, 2026년 12월 초", false],
    ["note", "희망 조건, 참고 내용", "a", "희망하시는 지역, 가격, 면적, 입주 가능일 등을 적어주세요.", false, 1],
  ] },
};
export default function RequestForm({ initial = "sell" }) {
  const [kind, setKind] = useState(initial);
  const [st, setSt] = useState({ busy: false, msg: "", err: false });
  const t = T[kind];
  async function submit(e) {
    e.preventDefault();
    const form = e.target, f = new FormData(form), v = k => String(f.get(k) || "").trim();
    if (v("website")) return;
    if (!/^[0-9+\-\s]{8,20}$/.test(v("phone"))) { setSt({ busy: false, msg: "전화번호를 숫자로 정확히 입력해 주세요.", err: true }); return; }
    try { if (Date.now() - Number(localStorage.getItem("consultAt") || 0) < 60000) { setSt({ busy: false, msg: "잠시 후 다시 시도해 주세요.", err: true }); return; } } catch (x) {}
    setSt({ busy: true, msg: "", err: false });
    const lines = t.f.map(([k, l]) => v(k) && `${k === "note" ? "내용" : l}: ${v(k)}`).filter(Boolean);
    const message = (t.tag + "\n" + lines.join("\n")).slice(0, 2000);
    const res = await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      name: v("name"), phone: v("phone"), email: "", message, consent: true }) }).catch(() => ({ ok: false }));
    if (!res.ok) { setSt({ busy: false, msg: "접수에 실패했습니다. 전화로 문의해 주세요.", err: true }); return; }
    try { localStorage.setItem("consultAt", String(Date.now())); } catch (x) {}
    try { window.gtag && window.gtag("event", "request_submit", { type: kind }); } catch (x) {}
    form.reset(); setSt({ busy: false, msg: "✓ 접수되었습니다. 확인 후 연락드리겠습니다.", err: false });
  }
  return (
    <>
      <div className="tw"><div className="tabs" role="tablist">
        {Object.keys(T).map(k => (
          <button key={k} type="button" role="tab" aria-selected={k === kind} className={k === kind ? "on" : ""}
            onClick={() => { setKind(k); setSt({ busy: false, msg: "", err: false }); }}>{T[k].tab}</button>
        ))}
      </div></div>
      <p style={{ textAlign: "center" }}>{t.desc}</p>
      <form className="fc" key={kind} onSubmit={submit}>
        <div className="r2">
          <label>이름 *<input name="name" type="text" required maxLength={50} autoComplete="name" /></label>
          <label>전화 *<input name="phone" type="tel" required maxLength={20} placeholder="010-0000-0000" autoComplete="tel" /></label>
          {t.f.map(([k, l, ty, x, r, full]) => (
            <label key={k} style={full ? { gridColumn: "1 / -1" } : undefined}>{l}{r ? " *" : ""}
              {ty === "s" ? <select name={k} required={r} defaultValue=""><option value="">선택</option>{x.map(o => <option key={o}>{o}</option>)}</select>
                : ty === "a" ? <textarea name={k} maxLength={1500} placeholder={x} />
                : <input name={k} type="text" required={r} maxLength={150} placeholder={x} />}
            </label>
          ))}
        </div>
        <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <label className="cons"><input name="consent" type="checkbox" required />[필수] 개인정보 수집·이용 동의 <a href="/privacy" target="_blank">개인정보처리방침 보기</a></label>
        <button className="sub" type="submit" disabled={st.busy}>{st.busy ? "보내는 중…" : t.btn}</button>
        {st.msg && <p className={"fm" + (st.err ? " er" : "")} role="status">{st.msg}</p>}
      </form>
    </>
  );
}
