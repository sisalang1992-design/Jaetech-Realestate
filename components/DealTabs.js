"use client";
import { useState } from "react";
import Card from "./Card";
export default function DealTabs({ groups }) {
  const [k, setK] = useState(groups[0].key);
  const cur = groups.find(g => g.key === k) || groups[0];
  return (
    <>
      <div className="tw"><div className="tabs" role="tablist">
        {groups.map(g => <button key={g.key} type="button" role="tab" aria-selected={g.key === k} className={g.key === k ? "on" : ""} onClick={() => setK(g.key)}>{g.key}</button>)}
      </div></div>
      <div className="grid">{cur.rows.map(l => <Card key={l.id} l={l} />)}</div>
    </>
  );
}
