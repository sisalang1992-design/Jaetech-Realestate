"use client";
import { useEffect } from "react";
import Script from "next/script";
import site from "../site.json";
const where = a => a.closest(".fab") ? "floating" : a.closest(".hd") ? "header" : a.closest(".quick") ? "quick_cards" : a.closest(".cs") ? "bottom_section" : a.closest(".acts") ? "listing_detail" : a.closest(".card") ? "card" : "other";
export default function Analytics() {
  const id = /^G-[A-Z0-9]{6,}$/.test(site.gaId || "") ? site.gaId : "";
  useEffect(() => {
    if (!id) return;
    const fn = e => {
      const a = e.target.closest && e.target.closest("a"); if (!a) return;
      const h = a.getAttribute("href") || "";
      const name = h.startsWith("tel:") ? "call_click" : h.includes("open.kakao.com") ? "kakao_click" : h.startsWith("/request") ? "request_click" : h.startsWith("/listing/") ? "listing_click" : "";
      if (name && window.gtag) window.gtag("event", name, { link_url: h, place: where(a), page_path: location.pathname });
    };
    document.addEventListener("click", fn);
    return () => document.removeEventListener("click", fn);
  }, [id]);
  if (!id) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${id}');`}</Script>
    </>
  );
}
