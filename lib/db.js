import { createClient } from "@supabase/supabase-js";
import site from "../site.json";
export const db = createClient(site.supabaseUrl, site.supabaseKey, { auth: { persistSession: false } });
export const COLS = "id,category,deal_type,title,area_name,area_m2,size_pyeong,floor,deposit,monthly,sale_price,photos,is_featured,is_violation,created_at";
export async function latest(cat, n) {
  const { data } = await db.from("listings").select(COLS).eq("category", cat).eq("is_active", true)
    .order("is_featured", { ascending: false }).order("created_at", { ascending: false }).limit(n);
  return data || [];
}
