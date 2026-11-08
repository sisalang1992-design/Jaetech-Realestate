import RequestForm from "../../components/RequestForm";
export const metadata = { title: "매물의뢰 및 접수", description: "사무실, 상가, 건물 매물을 내놓으실 분은 간단한 정보를 남겨 주세요. 확인 후 연락드립니다." };
export default function Request() {
  return (
    <main className="in"><div className="rq">
      <h1 className="pt" style={{ marginBottom: 8 }}>매물의뢰 및 접수</h1>
      <p>내놓으실 사무실, 상가, 건물 정보를 남겨 주시면 확인 후 연락드립니다.</p>
      <RequestForm />
    </div></main>
  );
}
