const S = { width: 56, height: 56, viewBox: "0 0 56 56", "aria-hidden": true, flex: "none" };
const l = { stroke: "#5C3D1E", strokeWidth: 2.5, strokeLinejoin: "round" };
export const IconOffice = () => (
  <svg {...S}><rect x="10" y="8" width="26" height="40" rx="3" fill="#F3D58A" {...l} /><rect x="38" y="24" width="10" height="24" rx="2" fill="#fff" {...l} />
    <g fill="#5C3D1E"><rect x="16" y="14" width="5" height="5" /><rect x="25" y="14" width="5" height="5" /><rect x="16" y="24" width="5" height="5" /><rect x="25" y="24" width="5" height="5" /><rect x="19" y="36" width="8" height="12" /></g></svg>
);
export const IconStore = () => (
  <svg {...S}><path d="M7 22 11 9h34l4 13Z" fill="#F3D58A" {...l} /><rect x="9" y="22" width="38" height="26" fill="#fff" {...l} /><rect x="22" y="31" width="12" height="17" fill="#5C3D1E" />
    <path d="M7 22q4.7 6 9.4 0 4.7 6 9.4 0 4.7 6 9.4 0 4.7 6 9.4 0" fill="none" {...l} /></svg>
);
export const IconBuilding = () => (
  <svg {...S}><rect x="6" y="18" width="20" height="30" rx="2" fill="#fff" {...l} /><rect x="22" y="6" width="28" height="42" rx="2" fill="#F3D58A" {...l} />
    <g fill="#5C3D1E"><rect x="28" y="12" width="5" height="5" /><rect x="39" y="12" width="5" height="5" /><rect x="28" y="23" width="5" height="5" /><rect x="39" y="23" width="5" height="5" /><rect x="28" y="34" width="5" height="5" /><rect x="39" y="34" width="5" height="5" /><rect x="11" y="25" width="4" height="4" /><rect x="11" y="35" width="4" height="4" /></g></svg>
);
export const IconRequest = () => (
  <svg {...S}><rect x="9" y="6" width="30" height="40" rx="3" fill="#fff" stroke="#FFE2A8" strokeWidth="2.5" /><g stroke="#FFE2A8" strokeWidth="2.5" strokeLinecap="round"><path d="M16 16h16M16 24h16M16 32h9" /></g>
    <path d="m34 44 13-13 4 4-13 13-6 2Z" fill="#E9B949" stroke="#FFE2A8" strokeWidth="2" strokeLinejoin="round" /></svg>
);
const sv = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "#4B3A10", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
export const MailIc = () => <svg {...sv}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
export const PhoneIc = () => <svg {...sv}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>;
export const PinIc = () => <svg {...sv}><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
