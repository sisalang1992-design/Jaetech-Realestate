import RequestForm from "../../components/RequestForm";
export const metadata = { title: "매물의뢰 및 접수", description: "매물을 내놓거나 찾으시는 분은 간단한 정보를 남겨 주세요. 확인 후 연락드립니다." };
export default function Request({ searchParams }) {
  return (
    <main className="in"><div className="rq">
      <h1 className="pt" style={{ marginBottom: 8, textAlign: "center" }}>매물의뢰 및 접수</h1>
      <p style={{ textAlign: "center" }}>내놓으실 매물이 있거나 찾으시는 매물이 있다면 아래에서 선택해 남겨 주세요.</p>
      <RequestForm initial={searchParams.type === "buy" ? "buy" : "sell"} />
    </div></main>
  );
}
