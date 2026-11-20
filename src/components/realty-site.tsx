import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { AppointmentScheduler } from "@/components/appointment-scheduler";

const services = [
  {
    number: "01",
    title: "Buying a home",
    description:
      "Find a home that fits your life, with local guidance from the first conversation to the final signature.",
  },
  {
    number: "02",
    title: "Selling a property",
    description:
      "Thoughtful, one-on-one support to help you plan your sale and move forward with confidence.",
  },
  {
    number: "03",
    title: "Property management",
    description:
      "A local point of contact for owners looking for help managing their Colorado Springs property.",
  },
  {
    number: "04",
    title: "Agent opportunities",
    description:
      "A chance to connect with an independent, family-operated brokerage rooted in the community.",
  },
];

function SiteMain({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" className="site-main" tabIndex={-1}>
      {children}
    </main>
  );
}

export function HomePageContent() {
  return (
    <SiteMain>
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-image" aria-hidden="true">
          <Image
            src="/images/colorado-springs-home.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero-photo"
          />
        </div>
        <div className="hero-content page-shell">
          <p className="eyebrow hero-eyebrow">
            <span className="eyebrow-mark" aria-hidden="true" />
            Colorado Springs, Colorado
          </p>
          <h1 id="hero-title">
            A more local way
            <br />
            to <em>move.</em>
          </h1>
          <p className="hero-description">
            Buying, selling, or managing a property? Talk with a local brokerage
            that keeps the focus on people. No crystal ball required—just local
            know-how and a very practical key ring.
          </p>
          <div className="hero-actions">
            <a className="button button-light" href="/schedule">
              Schedule a meeting <span aria-hidden="true">↗</span>
            </a>
            <a className="text-link text-link-light" href="/services">
              Explore our services <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className="hero-caption page-shell">
          <span>Independent · Veteran-owned · Family-operated</span>
          <span className="hero-caption-right">Real estate sales since 2013</span>
        </div>
      </section>
    </SiteMain>
  );
}

export function ServicesPageContent() {
  return (
    <SiteMain>
      <h1 className="sr-only">Real estate services</h1>
      <section className="services-section section-pad" id="services" aria-labelledby="services-title">
        <div className="page-shell">
          <div className="section-intro">
            <div>
              <p className="eyebrow eyebrow-dark">Here for the whole journey</p>
              <h2 id="services-title">
                Real estate is personal.
                <br />
                <em>We keep it that way.</em>
              </h2>
            </div>
            <p className="section-summary">
              From a first home to a property that needs a steady hand, get
              straightforward help from people who know the neighborhood. We
              can&apos;t pack the boxes, but we can help with the plan.
            </p>
          </div>

          <div className="services-grid">
            {services.map((service) => (
              <article className="service-card" key={service.number}>
                <div className="service-card-top">
                  <span className="service-number" aria-hidden="true">
                    {service.number}
                  </span>
                  <span className="service-rule" aria-hidden="true" />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <a className="service-link" href="/contact" aria-label={`Contact Mike about ${service.title}`}>
                  Let&apos;s talk <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteMain>
  );
}

export function SchedulePageContent() {
  return (
    <SiteMain>
      <h1 className="sr-only">Schedule a meeting</h1>
      <AppointmentScheduler />
    </SiteMain>
  );
}

export function AboutPageContent() {
  return (
    <SiteMain>
      <h1 className="sr-only">About Around the Block Realty</h1>
      <section className="about-section section-pad" id="about" aria-labelledby="about-title">
        <div className="about-layout page-shell">
          <div className="about-copy">
            <p className="eyebrow eyebrow-dark">Good people. Local roots.</p>
            <h2 id="about-title">
              More than a transaction.
              <br />
              <em>A neighbor you can call.</em>
            </h2>
            <p>
              Around the Block Realty is an independent, veteran-owned,
              family-operated brokerage serving Colorado Springs. Owner and
              broker Mike Morris brings a personal approach to every real
              estate conversation. We keep the jargon plain enough to
              understand before your coffee gets cold.
            </p>
            <a className="text-link text-link-dark" href="/contact">
              Contact Mike <span aria-hidden="true">↗</span>
            </a>
          </div>
          <aside className="experience-card" aria-label="Real estate sales since 2013">
            <span className="experience-kicker">Colorado Springs real estate</span>
            <strong>Since</strong>
            <span className="experience-year">2013</span>
            <span className="experience-divider" aria-hidden="true" />
            <span className="experience-caption">A local perspective, built over time.</span>
          </aside>
        </div>
      </section>
    </SiteMain>
  );
}

export function AgentsPageContent() {
  return (
    <SiteMain>
      <h1 className="sr-only">For real estate professionals</h1>
      <section className="agents-section" id="agents" aria-labelledby="agents-title">
        <div className="agents-inner page-shell">
          <div>
            <p className="eyebrow eyebrow-light">For real estate professionals</p>
            <h2 id="agents-title">
              Find your place
              <br />
              <em>with our team.</em>
            </h2>
          </div>
          <div className="agents-copy">
            <p>
              Interested in working with an independent local brokerage? Start
              with a conversation and see if Around the Block Realty feels like
              the right fit. We keep the team meetings light on buzzword bingo.
            </p>
            <a
              className="button button-outline-light"
              href="mailto:mike@mjpropertypros.com?subject=Agent%20opportunities"
            >
              Ask about agent opportunities <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
    </SiteMain>
  );
}

export function ContactPageContent() {
  return (
    <SiteMain>
      <h1 className="sr-only">Contact Around the Block Realty</h1>
      <section className="contact-section section-pad" id="contact" aria-labelledby="contact-title">
        <div className="contact-inner page-shell">
          <div className="contact-copy">
            <p className="eyebrow eyebrow-dark">Start with a conversation</p>
            <h2 id="contact-title">
              What can we help
              <br />
              you <em>move toward?</em>
            </h2>
            <p>No pressure or secret handshake—just a good place to start with Mike.</p>
          </div>
          <div className="contact-options">
            <a className="contact-option" href="tel:+17194229702">
              <span className="contact-label">Call Mike Morris</span>
              <span className="contact-value">(719) 422-9702</span>
              <span className="contact-arrow" aria-hidden="true">↗</span>
            </a>
            <a className="contact-option" href="mailto:mike@mjpropertypros.com">
              <span className="contact-label">Send an email</span>
              <span className="contact-value">mike@mjpropertypros.com</span>
              <span className="contact-arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
    </SiteMain>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner page-shell">
        <Link className="footer-brand" href="/">Around the Block Realty</Link>
        <p>Colorado Springs, Colorado</p>
        <nav className="footer-socials" aria-label="Social media links">
          <a href="https://www.facebook.com/michael.w.morris1" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <Image src="/images/facebook.svg" alt="" aria-hidden="true" width={24} height={24} className="footer-social-icon" />
          </a>
          <a href="https://www.linkedin.com/in/mikemorris3/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Image src="/images/linkedin.svg" alt="" aria-hidden="true" width={24} height={24} className="footer-social-icon" />
          </a>
          <a href="https://www.zillow.com/profile/MichaelMorris719/" target="_blank" rel="noopener noreferrer" aria-label="Zillow profile, reviews, and listings">
            <Image src="/images/zillow.svg" alt="" aria-hidden="true" width={24} height={24} className="footer-social-icon" />
          </a>
        </nav>
        <a href="https://www.atbrealestate.org" target="_blank" rel="noopener noreferrer">
          Current website <span aria-hidden="true">↗</span>
        </a>
      </div>
    </footer>
  );
}
