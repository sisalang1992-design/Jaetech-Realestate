const S = window.SITE;
const db = supabase.createClient(S.supabaseUrl, S.supabaseKey);
const CAT = { office: "사무실", store: "상가", building: "건물 매매" };
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const won = n => {
  if (n === null || n === undefined || n === "") return "";
  n = Number(n);
  const e = Math.floor(n / 10000), m = n % 10000;
  if (e && m) return `${e}억 ${m.toLocaleString()}만`;
  if (e) return `${e}억`;
  return m.toLocaleString();
};
const wonU = n => {
  if (n === null || n === undefined || n === "") return "";
  n = Number(n); if (!n) return "0원";
  const e = Math.floor(n / 10000), m = n % 10000;
  return (e ? e + "억" : "") + (e && m ? " " : "") + (m ? m.toLocaleString() + "만" : "") + "원";
};
const dealOf = l => l.deal_type || (l.category === "building" ? "매매" : "월세");
const priceText = l => { const d = dealOf(l); return d === "매매" ? `매매 ${won(l.sale_price)}` : d === "전세" ? `전세 ${won(l.deposit)}` : `보증금 ${won(l.deposit)} / 월 ${won(l.monthly)}`; };
const priceFull = l => { const d = dealOf(l); return d === "매매" ? `매매 ${wonU(l.sale_price)}` : d === "전세" ? `전세 ${wonU(l.deposit)}` : `보증금 ${wonU(l.deposit)} / 월세 ${wonU(l.monthly)}`; };
const metaText = l => [l.area_name, l.area_m2 ? l.area_m2 + "㎡" : (l.size_pyeong ? l.size_pyeong + "평" : ""), l.floor].filter(Boolean).map(esc).join(" · ");
const card = l => `<a class="card" href="detail.html?id=${l.id}">
  ${l.photos && l.photos[0] ? `<img src="${esc(l.photos[0])}" alt="${esc(l.title)}" loading="lazy">` : `<div class="ph">사진 준비 중</div>`}
  <div class="cb">${l.is_violation ? '<span class="tag warn">위반건축물</span>' : ""}${l.is_featured ? '<span class="tag">추천</span>' : ""}<span class="tag">${CAT[l.category]}</span>
  <h3>${esc(l.title)}</h3><p class="meta">${metaText(l)}</p><p class="price">${esc(priceText(l))}</p></div></a>`;
function layout() {
  const tel = "tel:" + S.phone.replace(/[^0-9+]/g, ""), i = S.info;
  if ($("hd")) $("hd").innerHTML = `<div class="in"><a class="logo" href="index.html">${esc(S.name)}</a>
    <nav class="nav"><a href="list.html?cat=office">사무실</a><a href="list.html?cat=store">상가</a><a href="list.html?cat=building">건물 매매</a></nav>
    <a class="btn" href="${tel}">상담 ${esc(S.phone)}</a></div>`;
  if ($("ft")) $("ft").innerHTML = `<div class="in"><b>${esc(S.name)}</b><br>개업공인중개사 ${esc(i.ceo)} · 사업자등록번호 ${esc(i.bizNo)} · 중개사무소 등록번호 ${esc(i.regNo)}<br>
    ${esc(i.address)} · Tel ${esc(S.phone)} · Email ${esc(i.email)}</div>`;
}
layout();

const thumb = u => u.replace(/_m\.(webp|jpg)$/, "_t.$1");
