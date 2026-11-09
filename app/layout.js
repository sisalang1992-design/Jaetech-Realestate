import site from "../site.json";
export const metadata = {
  metadataBase: new URL(site.siteUrl),
  title: { default: `${site.name} | 사무실·상가·건물매매`, template: `%s | ${site.name}` },
  description: `${site.name} 사무실, 상가, 건물 매매 매물 안내. 실매물과 실사진으로 책임 중개합니다.`,
  openGraph: { siteName: site.name, locale: "ko_KR", type: "website" },
};
export const viewport = { width: "device-width", initialScale: 1 };
export default function RootLayout({ children }) {
  const tel = "tel:" + site.phone.replace(/[^0-9+]/g, ""), i = site.info;
  const ld = { "@context": "https://schema.org", "@type": "RealEstateAgent", name: site.name, telephone: site.phone, url: site.siteUrl, address: i.address };
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" />
        <link rel="stylesheet" href="/style.css" />
        <link rel="stylesheet" href="/home.css" />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
        <header className="hd"><div className="in">
          <a className="logo" href="/">{site.name}</a>
          <nav className="nav"><a href="/office">사무실</a><a href="/store">상가</a><a href="/building">건물 매매</a><a href="/request">매물의뢰</a></nav>
          <a className="btn" href={tel}>상담 {site.phone}</a>
        </div></header>
        {children}
        <footer className="ft"><div className="in">
          <b>{site.name}</b><br />개업공인중개사 {i.ceo} · 사업자등록번호 {i.bizNo} · 중개사무소 등록번호 {i.regNo}<br />
          {i.address} · Tel {site.phone} · Email {i.email}<br /><a href="/privacy">개인정보처리방침</a>
        </div></footer>
      </body>
    </html>
  );
}
