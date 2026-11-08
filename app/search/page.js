import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default function Search({ searchParams }) {
  const c = ["office", "store", "building"].includes(searchParams.cat) ? searchParams.cat : "office";
  redirect(`/${c}?q=${encodeURIComponent(searchParams.q || "")}`);
}
