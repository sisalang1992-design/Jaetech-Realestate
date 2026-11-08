import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import site from "../../../site.json";
export const dynamic = "force-dynamic";
const hits = new Map();
const bad = (s, e) => NextResponse.json({ ok: false, error: e }, { status: s });
export async function POST(req) {
  let b; try { b = await req.json(); } catch (x) { return bad(400, "형식 오류"); }
  if (b.website) return NextResponse.json({ ok: true });
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "x", now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < 600000);
  if (arr.length >= 5) return bad(429, "잠시 후 다시 시도해 주세요.");
  arr.push(now); hits.set(ip, arr);
  const name = String(b.name || "").replace(/[\r\n]+/g, " ").trim().slice(0, 50), phone = String(b.phone || "").trim();
  const email = String(b.email || "").trim().slice(0, 100), message = String(b.message || "").trim().slice(0, 2000);
  if (!name || !/^[0-9+\-\s]{8,20}$/.test(phone) || b.consent !== true || (email && !/^\S+@\S+\.\S+$/.test(email))) return bad(400, "입력값 오류");
  const { error } = await db.from("inquiries").insert({ name, phone, email: email || null, message: message || null, consent: true });
  if (error) return bad(500, "저장 실패");
  const key = process.env.RESEND_API_KEY, to = process.env.NOTIFY_EMAIL;
  if (key && to) {
    const m = /^\[(매물내놓기|매물구하기|매물의뢰)\]/.exec(message), kind = m ? m[1] : "상담문의";
    const kst = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: process.env.NOTIFY_FROM || "onboarding@resend.dev", to: [to], subject: `[${site.name}] 새 ${kind} - ${name}`,
          text: `이름: ${name}\n전화: ${phone}\n이메일: ${email || "-"}\n접수: ${kst}\n\n${message || "(내용 없음)"}\n\n관리자 페이지에서도 확인할 수 있습니다.` }),
      });
    } catch (x) {}
  }
  return NextResponse.json({ ok: true });
}
