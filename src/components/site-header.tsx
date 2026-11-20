"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Schedule", href: "/schedule" },
  { label: "About", href: "/about" },
  { label: "For agents", href: "/agents" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

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
          <Link className="brand" href="/" onClick={closeMenu} aria-label="Around the Block Realty home">
            <Image
              className="brand-logo"
              src="/images/around-the-block-logo.png"
              alt=""
              aria-hidden="true"
              width={400}
              height={269}
              sizes="56px"
            />
            <span className="brand-copy">
              <span className="brand-name">Around the Block</span>
              <span className="brand-location">REALTY · COLORADO SPRINGS</span>
            </span>
          </Link>

          <nav
            id="primary-navigation"
            className={`site-nav${menuOpen ? " is-open" : ""}`}
            aria-label="Main navigation"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
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
