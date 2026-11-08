import { db } from "../lib/db";
import site from "../site.json";
export const revalidate = 3600;
export default async function sitemap() {
  const base = site.siteUrl.replace(/\/$/, ""), out = [{ url: base }, ...["office", "store", "building"].map(c => ({ url: `${base}/${c}` }))];
  for (let from = 0; ; from += 1000) {
    const { data } = await db.from("listings").select("id,created_at").eq("is_active", true).order("id").range(from, from + 999);
    if (!data || !data.length) break;
    out.push(...data.map(l => ({ url: `${base}/listing/${l.id}`, lastModified: l.created_at })));
    if (data.length < 1000) break;
  }
  return out;
}
