import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
// 이메일 알림 설정이 적용됐는지 확인용 (값 전체는 보여주지 않습니다)
export function GET() {
  const k = process.env.RESEND_API_KEY || "", t = process.env.NOTIFY_EMAIL || "";
  return NextResponse.json({
    RESEND_API_KEY: k ? `있음 (앞 3글자 ${k.slice(0, 3)}, 길이 ${k.length})` : "없음",
    NOTIFY_EMAIL: t ? `있음 (${t.replace(/^(.).*(@.*)$/, "$1***$2")})` : "없음",
  });
}
