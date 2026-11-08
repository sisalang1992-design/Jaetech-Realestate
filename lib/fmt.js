export const CAT = { office: "사무실", store: "상가", building: "건물 매매" };
export const won = n => {
  if (n === null || n === undefined || n === "") return "";
  n = Number(n); const e = Math.floor(n / 10000), m = n % 10000;
  if (e && m) return `${e}억 ${m.toLocaleString()}만`;
  return e ? `${e}억` : m.toLocaleString();
};
export const wonU = n => {
  if (n === null || n === undefined || n === "") return "";
  n = Number(n); if (!n) return "0원";
  const e = Math.floor(n / 10000), m = n % 10000;
  return (e ? e + "억" : "") + (e && m ? " " : "") + (m ? m.toLocaleString() + "만" : "") + "원";
};
export const dealOf = l => l.deal_type || (l.category === "building" ? "매매" : "월세");
export const priceText = l => { const d = dealOf(l); return d === "매매" ? `매매 ${won(l.sale_price)}` : d === "전세" ? `전세 ${won(l.deposit)}` : `보증금 ${won(l.deposit)} / 월 ${won(l.monthly)}`; };
export const priceFull = l => { const d = dealOf(l); return d === "매매" ? `매매 ${wonU(l.sale_price)}` : d === "전세" ? `전세 ${wonU(l.deposit)}` : `보증금 ${wonU(l.deposit)} / 월세 ${wonU(l.monthly)}`; };
export const metaText = l => [l.area_name, l.area_m2 ? l.area_m2 + "㎡" : (l.size_pyeong ? l.size_pyeong + "평" : ""), l.floor].filter(Boolean).join(" · ");
export const thumb = u => u.replace(/_m\.(webp|jpg)$/, "_t.$1");
export const priceBrief = l => { const d = dealOf(l); return d === "매매" ? wonU(l.sale_price) : d === "전세" ? wonU(l.deposit) : `보 ${wonU(l.deposit)} / 월 ${wonU(l.monthly)}`; };
