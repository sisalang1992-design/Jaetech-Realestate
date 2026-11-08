import site from "../site.json";
export default function robots() {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin.html", "/search"] }], sitemap: `${site.siteUrl.replace(/\/$/, "")}/sitemap.xml` };
}
