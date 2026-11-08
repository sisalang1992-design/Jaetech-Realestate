"use client";
import { useState } from "react";
import { db } from "../lib/db";
export default function RequestForm() {
  const [st, setSt] = useState({ busy: false, msg: "", err: false });
  async function submit(e) {
    e.preventDefault();
    const form = e.target, f = new FormData(form), v = k => String(f.get(k) || "").trim();
    if (v("website")) return;
    if (!/^[0-9+\-\s]{8,20}$/.test(v("phone"))) { setSt({ busy: false, msg: "전화번호를 숫자로 정확히 입력해 주세요.", err: true }); return; }
    try { if (Date.now() - Number(localStorage.getItem("consultAt") || 0) < 60000) { setSt({ busy: false, msg: "잠시 후 다시 시도해 주세요.", err: true }); return; } } catch (x) {}
    setSt({ busy: true, msg: "", err: false });
    const message = `[매물의뢰] 종류: ${v("kind")} / 거래형태: ${v("deal")} / 소재지: ${v("addr")}` + (v("note") ? `\n${v("note")}` : "");
    const { error } = await db.from("inquiries").insert({ name: v("name"), phone: v("phone"), email: null, message: message.slice(0, 2000), consent: true });
    if (error) { setSt({ busy: false, msg: "접수에 실패했습니다. 전화로 문의해 주세요.", err: true }); return; }
    try { localStorage.setItem("consultAt", String(Date.now())); } catch (x) {}
    form.reset(); setSt({ busy: false, msg: "접수되었습니다. 확인 후 연락드리겠습니다.", err: false });
  }
  return (
    <form className="fc" onSubmit={submit}>
      <div className="r2">
        <label>이름 *<input name="name" type="text" required maxLength={50} autoComplete="name" /></label>
        <label>전화 *<input name="phone" type="tel" required maxLength={20} placeholder="010-0000-0000" autoComplete="tel" /></label>
      </div>
      <div className="r2">
        <label>매물 종류 *<select name="kind" required defaultValue=""><option value="" disabled>선택</option><option>사무실</option><option>상가</option><option>건물</option><option>기타</option></select></label>
        <label>거래형태 *<select name="deal" required defaultValue=""><option value="" disabled>선택</option><option>매매</option><option>전세</option><option>월세</option></select></label>
      </div>
      <label>매물 소재지 *<input name="addr" type="text" required maxLength={150} placeholder="예: 서울 마포구 ○○동 ○○번지" /></label>
      <label>희망 조건·참고 내용<textarea name="note" maxLength={1500} placeholder="희망 가격, 면적, 층수, 입주 가능일 등을 적어 주세요" /></label>
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className="cons"><input name="consent" type="checkbox" required />[필수] 개인정보 수집·이용 동의 <a href="/privacy" target="_blank">개인정보처리방침 보기</a></label>
      <button className="sub" type="submit" disabled={st.busy}>{st.busy ? "보내는 중…" : "매물 의뢰하기"}</button>
      {st.msg && <p className={"fm" + (st.err ? " er" : "")} role="status">{st.msg}</p>}
    </form>
  );
}
