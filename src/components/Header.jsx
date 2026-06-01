import { useState } from "react";

const C = {
  primary: "#79553D",
  border: "#E8E2DD",
  textDark: "#2B2420",
  textMuted: "#8A817A",
};

function IconBtn({ children, title }) {
  return (
    <button
      title={title}
      style={{
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "6px",
        border: "1px solid transparent",
        background: "transparent",
        color: C.textMuted,
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "#F9FAFB";
        e.currentTarget.style.borderColor = C.border;
        e.currentTarget.style.color = C.textDark;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.borderColor = "transparent";
        e.currentTarget.style.color = C.textMuted;
      }}
    >
      {children}
    </button>
  );
}

export default function Header() {
  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      height: 64,
      gap: 24,
      background: "#FFFFFF",
      borderBottom: `1px solid ${C.border}`,
      fontFamily: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
    }}>
      
      {/* Brand Logo / Text */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: "0.15em",
            color: C.textDark,
            textTransform: "uppercase"
          }}>
            TimberCraft
          </span>
          <span style={{
            fontSize: 9,
            fontWeight: 600,
            color: C.textMuted,
            letterSpacing: "0.08em",
            textTransform: "uppercase"
          }}>
            CRM Portal
          </span>
        </div>
      </div>

      {/* Clean Minimalist Search Bar */}
      <div style={{ position: "relative", flex: 1, maxWidth: 420 }}>
        <svg style={{
          position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
          width: 15, height: 15, color: C.textMuted, pointerEvents: "none",
        }} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Cari data pelanggan, transaksi..."
          style={{
            width: "100%",
            height: 36,
            paddingLeft: 36,
            paddingRight: 16,
            borderRadius: "6px",
            background: "#F9FAFB",
            border: `1px solid ${C.border}`,
            color: C.textDark,
            fontSize: 13,
            outline: "none",
            transition: "all 0.15s",
          }}
          onFocus={e => {
            e.target.style.background = "#FFFFFF";
            e.target.style.borderColor = C.primary;
          }}
          onBlur={e => {
            e.target.style.background = "#F9FAFB";
            e.target.style.borderColor = C.border;
          }}
        />
      </div>

      {/* Clean Right Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        
        {/* Simple Plain Icons */}
        <IconBtn title="Settings">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </IconBtn>

        <IconBtn title="Notifications">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </IconBtn>

        <div style={{ width: 1, height: 20, background: C.border, margin: "0 4px" }} />

        {/* Profile (Clean & Plain) */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: C.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            color: "#FFFFFF",
          }}>
            AR
          </div>
          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.textDark, lineHeight: 1.2 }}>Ahmad Reza</span>
            <span style={{ fontSize: 10, color: C.textMuted, mt: 1 }}>Store Manager</span>
          </div>
        </div>

      </div>
    </header>
  );
}