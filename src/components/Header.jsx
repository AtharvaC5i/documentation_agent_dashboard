import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  PresentationIcon,
  Code2,
  Activity,
  Menu,
  X,
} from "lucide-react";

const ICON_MAP = {
  LayoutDashboard,
  FileText,
  Presentation: PresentationIcon,
  Code2,
};

function SystemStatusPill() {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-2)",
        backgroundColor: "var(--color-success-highlight)",
        border: "1px solid color-mix(in srgb, var(--color-success) 16%, transparent)",
        borderRadius: "var(--radius-full)",
        padding: "0.5rem 0.875rem",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          position: "relative",
          display: "inline-flex",
          width: 8,
          height: 8,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "9999px",
            backgroundColor: "var(--color-success)",
            opacity: 0.35,
            animation: "statusPing 1.6s cubic-bezier(0,0,0.2,1) infinite",
          }}
        />
        <span
          style={{
            position: "relative",
            display: "block",
            width: 8,
            height: 8,
            borderRadius: "9999px",
            backgroundColor: "var(--color-success)",
          }}
        />
      </span>

      <span
        style={{
          fontSize: "var(--text-xs)",
          fontWeight: 700,
          color: "var(--color-success)",
          lineHeight: 1,
        }}
      >
        System Online
      </span>
    </div>
  );
}

function BrandBlock() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        minWidth: 0,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.25rem",
          fontWeight: 800,
          letterSpacing: "-0.035em",
          color: "var(--color-text)",
          lineHeight: 1.1,
        }}
      >
        DocAgent Metrics
      </p>

      <p
        style={{
          fontSize: "var(--text-xs)",
          color: "var(--color-text-muted)",
          lineHeight: 1.4,
        }}
      >
        Enterprise Telemetry &amp; Performance
      </p>
    </div>
  );
}

function AgentTab({ agent, isActive, onClick }) {
  const Icon = ICON_MAP[agent.icon] ?? Activity;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      disabled={agent.disabled}
      onClick={() => !agent.disabled && onClick(agent.id)}
      className={`header-tab ${isActive ? "active" : ""}`}
      style={{
        opacity: agent.disabled ? 0.45 : 1,
        cursor: agent.disabled ? "not-allowed" : "pointer",
      }}
    >
      <Icon size={15} strokeWidth={isActive ? 2.1 : 1.8} />
      <span>{agent.name}</span>

      {agent.disabled && (
        <span
          className="badge badge-neutral"
          style={{
            fontSize: "10px",
            padding: "2px 6px",
            lineHeight: 1,
          }}
        >
          WIP
        </span>
      )}
    </button>
  );
}

function MobileMenu({ agents, activeAgent, onAgentChange, onClose }) {
  return (
    <div
      style={{
        borderTop: "1px solid var(--color-divider)",
        backgroundColor: "var(--color-surface)",
        padding: "var(--space-3) var(--space-5) var(--space-4)",
      }}
      className="header-mobile-menu"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
        }}
      >
        {agents.map((agent) => {
          const Icon = ICON_MAP[agent.icon] ?? Activity;
          const isActive = activeAgent === agent.id;

          return (
            <button
              key={agent.id}
              disabled={agent.disabled}
              onClick={() => {
                if (!agent.disabled) {
                  onAgentChange(agent.id);
                  onClose();
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "var(--space-3)",
                width: "100%",
                textAlign: "left",
                padding: "0.75rem 0.875rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: isActive
                  ? "var(--color-primary-highlight)"
                  : "transparent",
                color: isActive
                  ? "var(--color-primary)"
                  : "var(--color-text-muted)",
                border: "1px solid",
                borderColor: isActive ? "transparent" : "var(--color-divider)",
                opacity: agent.disabled ? 0.45 : 1,
                cursor: agent.disabled ? "not-allowed" : "pointer",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  minWidth: 0,
                }}
              >
                <Icon size={16} strokeWidth={isActive ? 2.1 : 1.8} />
                <span
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: isActive ? 600 : 500,
                    color: "inherit",
                  }}
                >
                  {agent.name}
                </span>
              </span>

              {agent.disabled && (
                <span
                  className="badge badge-neutral"
                  style={{
                    fontSize: "10px",
                    padding: "2px 6px",
                    lineHeight: 1,
                  }}
                >
                  WIP
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Header({ agents, activeAgent, onAgentChange }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--content-wide)",
          marginInline: "auto",
          paddingInline: "var(--space-5)",
          paddingTop: "var(--space-4)",
          paddingBottom: "var(--space-3)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-4)",
          }}
        >
          <BrandBlock />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              flexShrink: 0,
            }}
          >
            <div className="header-status-desktop">
              <SystemStatusPill />
            </div>

            <button
              className="btn btn-ghost btn-icon header-mobile-toggle"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <div
          className="header-nav-desktop"
          style={{
            marginTop: "var(--space-4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-4)",
          }}
        >
          <nav
            role="tablist"
            aria-label="Agent dashboards"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              minWidth: 0,
              flexWrap: "wrap",
              backgroundColor: "var(--color-surface-offset)",
              border: "1px solid var(--color-border)",
              borderRadius: "calc(var(--radius-md) + 4px)",
              padding: "4px",
            }}
          >
            {agents.map((agent) => (
              <AgentTab
                key={agent.id}
                agent={agent}
                isActive={activeAgent === agent.id}
                onClick={onAgentChange}
              />
            ))}
          </nav>
        </div>
      </div>

      {mobileMenuOpen && (
        <MobileMenu
          agents={agents}
          activeAgent={activeAgent}
          onAgentChange={onAgentChange}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}

      <style>{`
        @keyframes statusPing {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .header-tab {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          min-height: 2.25rem;
          padding: 0.45rem 0.85rem;
          border: 1px solid transparent;
          border-radius: var(--radius-md);
          background: transparent;
          color: var(--color-text-muted);
          font-size: var(--text-sm);
          font-weight: 500;
          white-space: nowrap;
          transition: all var(--transition-interactive);
        }

        .header-tab:hover {
          color: var(--color-primary);
          background-color: var(--color-surface);
        }

        .header-tab.active {
          color: var(--color-primary);
          background-color: var(--color-surface);
          border-color: var(--color-border);
          box-shadow: var(--shadow-sm);
          font-weight: 600;
        }

        .header-mobile-toggle {
          display: none;
        }

        .header-status-inline {
          display: none;
        }

        @media (max-width: 768px) {
          .header-nav-desktop {
            display: none !important;
          }

          .header-mobile-toggle {
            display: inline-flex !important;
          }

          .header-status-desktop {
            display: none !important;
          }

          .header-mobile-menu {
            display: block;
          }
        }

        @media (min-width: 769px) {
          .header-status-inline {
            display: inline-flex;
          }
        }
      `}</style>
    </header>
  );
}

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-divider)",
        backgroundColor: "transparent",
        marginTop: "var(--space-16)",
        padding: "var(--space-6) 0",
      }}
    >
      <div
        style={{
          maxWidth: "var(--content-wide)",
          marginInline: "auto",
          paddingInline: "var(--space-6)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-faint)",
            lineHeight: 1.5,
          }}
        >
          © {new Date().getFullYear()} Documentation Intelligence — Enterprise
          Telemetry Platform
        </p>
      </div>
    </footer>
  );
}
