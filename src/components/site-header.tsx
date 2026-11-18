"use client";

import { useState } from "react";

const navigation = [
  { label: "Services", href: "#services" },
  { label: "Schedule", href: "#schedule" },
  { label: "About", href: "#about" },

  { label: "For agents", href: "#agents" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <div className="site-header-inner">
          <a className="brand" href="#top" onClick={closeMenu} aria-label="Around the Block Realty home">
            <span className="brand-mark" aria-hidden="true">
              ATB
            </span>
            <span className="brand-copy">
              <span className="brand-name">Around the Block</span>
              <span className="brand-location">REALTY · COLORADO SPRINGS</span>
            </span>
          </a>

          <nav
            id="primary-navigation"
            className={`site-nav${menuOpen ? " is-open" : ""}`}
            aria-label="Main navigation"
          >
            {navigation.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMenu}>
                {item.label}
              </a>
            ))}
            <a className="nav-contact" href="tel:+17194229702" onClick={closeMenu}>
              Call Mike <span aria-hidden="true">↗</span>
            </a>
          </nav>

          <button
            className={`menu-toggle${menuOpen ? " is-open" : ""}`}
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-controls="primary-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </header>
    </>
  );
}
