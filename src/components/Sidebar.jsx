import { NavLink } from "react-router-dom";

const C = {
  primary: "#79553D",    // Walnut
  primaryBg: "#FAF6F3",  // Extremely subtle warm gray/beige
  bg: "#FFFFFF",         // Pure professional white
  border: "#E8E2DD",     // Border line
  textDark: "#2B2420",   // Dark Charcoal
  textMuted: "#8A817A",  // Earthy Muted Gray
};

// ── Simple Minimalist Icon Set ───────────────────────────────
const DashIcon = () => (
  <svg className="w-[16px] h-[16px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const CustomerIcon = () => (
  <svg className="w-[16px] h-[16px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const HistoryIcon = () => (
  <svg className="w-[16px] h-[16px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
    <rect x="9" y="3" width="6" height="4" rx="1"/>
    <line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>
  </svg>
);

const MemberIcon = () => (
  <svg className="w-[16px] h-[16px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

const ServiceIcon = () => (
  <svg className="w-[16px] h-[16px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);

const ConsultIcon = () => (
  <svg className="w-[16px] h-[16px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const PromoIcon = () => (
  <svg className="w-[16px] h-[16px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <rect x="3" y="8" width="18" height="12" rx="2" ry="2" />
    <path d="M12 5V3H7v2" />
    <path d="M12 5H7a4 4 0 0 0-4 4v0" />
    <path d="M12 5V3h5v2" />
    <path d="M12 5h5a4 4 0 0 1 4 4v0" />
    <line x1="12" y1="5" x2="12" y2="20" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-[16px] h-[16px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const ProjectIcon = () => (
  <svg className="w-[16px] h-[16px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path d="M3 3h18v18H3z"/>
    <path d="M21 9H3M21 15H3M12 3v18"/>
  </svg>
);

// ── Sub-components ────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.12em] px-3 mb-2 mt-5 first:mt-0" style={{ color: C.textMuted }}>
      {children}
    </p>
  );
}

function NavItem({ to, end, icon, label, badge }) {
  return (
    <NavLink
      to={to}
      end={end}
      className="flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-semibold mb-0.5 transition-all duration-150 no-underline"
      style={({ isActive }) => ({
        background: isActive ? C.primaryBg : "transparent",
        color: isActive ? C.primary : C.textMuted,
      })}
      onMouseEnter={e => {
        if (!e.currentTarget.classList.contains("active")) {
          e.currentTarget.style.background = "#F9FAFB";
          e.currentTarget.style.color = C.textDark;
        }
      }}
      onMouseLeave={e => {
        if (!e.currentTarget.classList.contains("active")) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = C.textMuted;
        }
      }}
    >
      {({ isActive }) => (
        <>
          <span style={{ color: isActive ? C.primary : C.textMuted }}>{icon}</span>
          <span className="flex-1">{label}</span>
          {badge && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.2 rounded-full"
              style={{
                background: isActive ? C.primary : "#F3F4F6",
                color: isActive ? "#FFF" : C.textMuted,
              }}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

// ── Main Sidebar ──────────────────────────────────────────────
export default function Sidebar() {
  return (
    <aside
      className="w-64 h-screen flex-shrink-0 flex flex-col justify-between px-4 py-6 sticky top-0 z-40 hidden lg:flex"
      style={{ 
        background: C.bg, 
        borderRight: `1px solid ${C.border}`,
        fontFamily: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif"
      }}
    >
      <div className="overflow-y-auto pr-1 select-none scrollbar-thin">
        {/* Brand Header (Minimal & Plain) */}
        <div className="flex items-center gap-2 px-3 mb-6">
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
              CRM System
            </span>
          </div>
        </div>

        {/* Core */}
        <div className="mb-4">
          <SectionLabel>Core</SectionLabel>
          <NavItem to="/" end icon={<DashIcon />} label="Dashboard" />
          <NavItem to="/purchase-history" icon={<HistoryIcon />} label="Purchase History" />
          <NavItem to="/custom-projects" icon={<ProjectIcon />} label="Custom Projects" />
        </div>

        {/* CRM */}
        <div className="mb-4">
          <SectionLabel>CRM</SectionLabel>
          <NavItem to="/customers" icon={<CustomerIcon />} label="Customers" />
          <NavItem to="/memberships" icon={<MemberIcon />} label="Membership" />
          <NavItem to="/product-consultation" icon={<ConsultIcon />} label="Consultation" />
          <NavItem to="/customer-service" icon={<ServiceIcon />} label="Customer Service" />
        </div>

        {/* Marketing */}
        <div className="mb-4">
          <SectionLabel>Marketing</SectionLabel>
          <NavItem to="/promotions" icon={<PromoIcon />} label="Promotions" />
          <NavItem to="/notifications" icon={<BellIcon />} label="Notifications" badge="3" />
        </div>
      </div>

      {/* Footer (Minimal & Flat) */}
      <div className="pt-4 border-t border-[#E8E2DD] px-3">
        <p className="text-[10px] font-semibold text-[#8A817A] uppercase tracking-wider">TimberCraft Studio</p>
        <p className="text-[9px] text-[#8A817A]/70 mt-0.5">© 2026 Admin Portal</p>
      </div>
    </aside>
  );
}