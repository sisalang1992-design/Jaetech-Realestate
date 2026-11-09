"use client";
import { useState } from "react";
export default function ConsultForm() {
  const [st, setSt] = useState({ busy: false, msg: "", err: false });
  async function submit(e) {
    e.preventDefault();
    const form = e.target, f = new FormData(form);
    if (f.get("website")) return;
    const phone = String(f.get("phone") || "").trim();
    if (!/^[0-9+\-\s]{8,20}$/.test(phone)) { setSt({ busy: false, msg: "전화번호를 숫자로 정확히 입력해 주세요.", err: true }); return; }
    try { if (Date.now() - Number(localStorage.getItem("consultAt") || 0) < 60000) { setSt({ busy: false, msg: "잠시 후 다시 시도해 주세요.", err: true }); return; } } catch (x) {}
    setSt({ busy: true, msg: "", err: false });
    const res = await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      name: String(f.get("name") || "").trim(), phone, email: "",
      message: String(f.get("message") || "").trim(), consent: true }) }).catch(() => ({ ok: false }));
    if (!res.ok) { setSt({ busy: false, msg: "접수에 실패했습니다. 전화로 문의해 주세요.", err: true }); return; }
    try { localStorage.setItem("consultAt", String(Date.now())); } catch (x) {}
    form.reset(); setSt({ busy: false, msg: "✓ 접수되었습니다. 확인 후 연락드리겠습니다.", err: false });
  }
  return (
    <form className="fc" onSubmit={submit}>
      <div className="r2">
        <label>이름 *<input name="name" type="text" required maxLength={50} placeholder="홍길동" autoComplete="name" /></label>
        <label>전화 *<input name="phone" type="tel" required maxLength={20} placeholder="010-0000-0000" autoComplete="tel" /></label>
      </div>
      <label>상담 문의<textarea name="message" maxLength={2000} placeholder="희망 지역, 예산, 일정 등을 자유롭게 적어 주세요" /></label>
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className="cons"><input name="consent" type="checkbox" required />[필수] 개인정보 수집·이용 동의 <a href="/privacy" target="_blank">개인정보처리방침 보기</a></label>
      <button className="sub" type="submit" disabled={st.busy}>{st.busy ? "보내는 중…" : "문의하기"}</button>
      {st.msg && <p className={"fm" + (st.err ? " er" : "")} role="status">{st.msg}</p>}
    </form>
  );
}
