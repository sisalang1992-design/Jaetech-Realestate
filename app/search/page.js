import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default function Search({ searchParams }) {
  const c = ["office", "store", "building"].includes(searchParams.cat) ? searchParams.cat : "all";
  const d = ["매매", "전세", "월세"].includes(searchParams.deal) ? searchParams.deal : "";
  redirect(`/${c}?q=${encodeURIComponent(searchParams.q || "")}${d ? "&deal=" + encodeURIComponent(d) : ""}`);
}
