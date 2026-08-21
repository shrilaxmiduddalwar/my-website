"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { CloudShader } from "@/components/ui/cloud-shader";
import { PaperPlanesWind } from "@/components/paper-planes-wind";
import { ProjectInquiryForm } from "@/components/project-inquiry-form";
import { GrasshopperMascot } from "@/components/grasshopper-mascot";
import { RainWeatherFX } from "@/components/rain-weather-fx";

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [isRaining, setIsRaining] = useState(false);
  const clientTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Fade-up observer
    const observerOptions = {
      threshold: 0.08,
      rootMargin: "0px 0px -30px 0px",
    };

    const scrollObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const fadeElements = document.querySelectorAll(".fade-up");
    fadeElements.forEach((el) => scrollObserver.observe(el));

    // Fallback timer to ensure elements are visible
    const timer = setTimeout(() => {
      fadeElements.forEach((el) => el.classList.add("is-visible"));
    }, 300);

    // Section scrollspy
    const sections = document.querySelectorAll("main section[id]");
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            if (id) setActiveSection(id);
          }
        });
      },
      { threshold: 0.25 }
    );
    sections.forEach((sec) => spyObserver.observe(sec));

    // Auto-scroll client track
    const clientTrack = clientTrackRef.current;
    let interval: NodeJS.Timeout | null = null;
    if (clientTrack) {
      let scrollPos = 0;
      interval = setInterval(() => {
        if (clientTrack.matches(":hover")) return;
        const maxScroll = clientTrack.scrollWidth - clientTrack.clientWidth;
        scrollPos += 320;
        if (scrollPos > maxScroll) scrollPos = 0;
        clientTrack.scrollTo({ left: scrollPos, behavior: "smooth" });
      }, 5000);
    }

    // Spontaneous sudden rain cycle
    let rainTimeout: NodeJS.Timeout | null = null;
    const scheduleSpontaneousRain = () => {
      rainTimeout = setTimeout(() => {
        setIsRaining(true);
        setTimeout(() => {
          setIsRaining(false);
          scheduleSpontaneousRain();
        }, 20000); // 20s rain shower
      }, 35000); // every 35s
    };
    scheduleSpontaneousRain();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      scrollObserver.disconnect();
      spyObserver.disconnect();
      clearTimeout(timer);
      if (interval) clearInterval(interval);
      if (rainTimeout) clearTimeout(rainTimeout);
    };
  }, []);

  const handleTrackConversion = (url: string) => {
    if (typeof window !== "undefined" && (window as any).gtag_report_conversion) {
      return (window as any).gtag_report_conversion(url);
    }
    return true;
  };

  return (
    <>
      {/* 1. FIXED FULLPAGE CLOUD SHADER (TRANSITIONS INTO MOODY STORM CLOUDS DURING RAIN) */}
      <div className="fullpage-cloud-bg" aria-hidden="true">
        <CloudShader
          className="h-full w-full opacity-90 pointer-events-none transition-colors duration-1000"
          speed={isRaining ? 1.2 : 0.7}
          count={isRaining ? 8 : 6}
          cloudColor={isRaining ? "#94a3b8" : "#ffffff"}
          skyTopColor={isRaining ? "#0f172a" : "#1d4ed8"}
          skyBottomColor={isRaining ? "#334155" : "#dbeafe"}
        />
      </div>

      {/* 2. DYNAMIC RAIN WEATHER FX (RAINDROPS, SPLASHES & LIGHTNING) */}
      <RainWeatherFX isRaining={isRaining} onToggleRain={() => setIsRaining((prev) => !prev)} />

      {/* 3. ANIMATED WIND BREEZE & FLOATING PAPER PLANES */}
      <PaperPlanesWind />

      {/* 4. INTERACTIVE 3D BABYCO MASCOT (WITH POP-UP 3D UMBRELLA IN RAIN) */}
      <GrasshopperMascot isRaining={isRaining} />



      {/* Header Navigation with Frosted Blur Glass */}
      <header id="site-header" className={`relative z-20 ${isScrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          <a href="#about" className="brand">
            <img src="/ignito.png" alt="Ignito Corporation Logo" width={44} height={44} />
            <span className="brand-text">
              Ignito <span>Corporation</span>
            </span>
          </a>

          <button
            className="mobile-menu-btn"
            id="mobile-toggle"
            aria-label="Toggle Navigation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>

          <nav className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`} id="nav-menu">
            <a
              href="#about"
              className={activeSection === "about" ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#services"
              className={activeSection === "services" ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </a>
            <a
              href="#project"
              className={activeSection === "project" ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              Project
            </a>
            <a
              href="#inquiry"
              className={activeSection === "inquiry" ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              Inquiry
            </a>
            <a
              href="#clients"
              className={activeSection === "clients" ? "active" : ""}
              onClick={() => setMobileMenuOpen(false)}
            >
              Clients
            </a>
            <Link href="/privacy" onClick={() => setMobileMenuOpen(false)}>
              Privacy
            </Link>
            <a
              href="/PORTFOLIOO.pdf"
              download
              className="nav-cta"
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-download"></i> Portfolio
            </a>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative pt-6 pb-20">
          <div className="hero">
            <div className="hero-grid">
              <div className="hero-content fade-up">
                <div className="hero-badge bg-white/90 backdrop-blur-md border border-blue-200 shadow-sm">
                  <i className="fas fa-sparkles"></i> Enterprise Digital Solutions
                </div>
                <h1 className="hero-title text-slate-900 drop-shadow-sm">
                  All your enterprise digital solutions on{" "}
                  <span className="marker-highlight">one platform</span>,{" "}
                  <span className="wavy-underline">affordable!</span>
                </h1>
                <p className="hero-subtitle text-slate-800 font-medium drop-shadow-sm">
                  Ignito Corporation builds enterprise websites, mobile applications, data automation, and cloud-ready systems for distributors, partners, and modern businesses.
                </p>
                <div className="hero-actions-wrapper">
                  <div className="hero-actions">
                    <a className="btn btn-primary shadow-lg" href="/PORTFOLIOO.pdf" download>
                      <i className="fas fa-file-arrow-down"></i> Download Portfolio
                    </a>
                    <a className="btn btn-secondary bg-white/90 backdrop-blur-md" href="#services">
                      <i className="fas fa-layer-group"></i> Explore Services
                    </a>
                  </div>
                  <div className="hero-pricing-note">
                    <svg
                      className="handwritten-arrow"
                      viewBox="0 0 50 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 8 C 16 28, 32 36, 43 20 M 34 18 L 44 20 L 41 29"
                        stroke="currentColor"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="handwritten-text text-blue-900 font-bold drop-shadow-sm">
                      Transparent pricing &bull; 0% hidden fees!
                    </span>
                  </div>
                </div>
                <div className="hero-stats-grid">
                  <div className="mini-stat-card glass-card shadow-sm">
                    <div className="mini-stat-num">8+ Years</div>
                    <div className="mini-stat-label">Combined delivery experience across platforms</div>
                  </div>
                  <div className="mini-stat-card glass-card shadow-sm">
                    <div className="mini-stat-num">100%</div>
                    <div className="mini-stat-label">Custom enterprise workflows & product launches</div>
                  </div>
                </div>
              </div>

              <aside className="hero-card-panel fade-up delay-2 glass-card shadow-xl">
                <div className="hero-card-header">
                  <div className="hero-card-title">
                    <i className="fas fa-shield-halved" style={{ color: "var(--primary)" }}></i> Corporate Standard
                  </div>
                  <div className="status-tag">
                    <span className="status-dot"></span> Active Systems
                  </div>
                </div>
                <p className="hero-card-desc">
                  We design seamless digital systems that look polished, behave consistently, and build trust. Our technology review process and client communication are tailored for enterprise reliability.
                </p>
                <div className="hero-stats-grid">
                  <div className="mini-stat-card bg-slate-50/90 border border-slate-200">
                    <div style={{ color: "var(--primary)", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.3rem" }}>
                      Brand-First UI
                    </div>
                    <div className="mini-stat-label">Modern visual identity aligned to global SaaS standards.</div>
                  </div>
                  <div className="mini-stat-card bg-slate-50/90 border border-slate-200">
                    <div style={{ color: "var(--teal)", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.3rem" }}>
                      Security Focus
                    </div>
                    <div className="mini-stat-label">Secure deployment workflows and data-aware architecture.</div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="section-block glass-section-light">
          <div className="section-container">
            <div className="section-header fade-up">
              <div className="section-tag bg-white/90 shadow-sm border border-blue-200">
                <i className="fas fa-building-user"></i> ABOUT IGNITO
              </div>
              <h2 className="section-title">
                Built for <span className="marker-yellow">Enterprise Excellence</span>
              </h2>
              <p className="section-subtitle">
                A registered <span className="doodle-circle">MSME</span> from Indore, Ignito Corporation delivers digital excellence for businesses that need polished products with enterprise appeal.
                <br />
                <span className="doodle-note" style={{ marginTop: "0.5rem" }}>
                  ✨ 100% Client Satisfaction &bull; Built with passion!
                </span>
              </p>
            </div>

            <div className="cards-grid-3">
              <article className="enterprise-card glass-card fade-up delay-1">
                <div className="icon-box icon-blue">
                  <i className="fas fa-bullseye"></i>
                </div>
                <h3 className="card-title">Trusted Digital Delivery</h3>
                <p className="card-text">
                  We combine reliability, UX clarity, and powerful workflows to create software solutions that feel as good as they perform.
                </p>
              </article>

              <article className="enterprise-card glass-card fade-up delay-2">
                <div className="icon-box icon-purple">
                  <i className="fas fa-layer-group"></i>
                </div>
                <h3 className="card-title">End-to-End Services</h3>
                <p className="card-text">
                  Web, mobile, cloud, analytics, deployment, and ongoing support — all engineered to work together seamlessly for business growth.
                </p>
              </article>

              <article className="enterprise-card glass-card fade-up delay-3">
                <div className="icon-box icon-teal">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3 className="card-title">Business-First Thinking</h3>
                <p className="card-text">
                  Every feature is validated for operational efficiency, user clarity, and measurable business performance metrics.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="section-block glass-section-alt">
          <div className="section-container">
            <div className="section-header fade-up">
              <div className="section-tag bg-white/90 shadow-sm border border-blue-200">
                <i className="fas fa-sliders"></i> OUR CAPABILITIES
              </div>
              <h2 className="section-title">
                Everything to <span className="marker-teal">scale your business</span>{" "}
                <span className="wavy-underline">fast!</span>
              </h2>
              <p className="section-subtitle">
                We deliver professional software products with modern aesthetics, streamlined processes, and enterprise-ready execution.
                <br />
                <span className="doodle-note" style={{ marginTop: "0.4rem" }}>
                  🎨 Custom tailored for your specific industry!
                </span>
              </p>
            </div>

            <div className="cards-grid-3">
              <article className="enterprise-card glass-card fade-up delay-1">
                <div className="icon-box icon-blue">
                  <i className="fas fa-laptop-code"></i>
                </div>
                <h3 className="card-title">Corporate Websites</h3>
                <p className="card-text">
                  Responsive websites built for brand authority, conversions, and speed, with strong accessibility standards and SEO optimization.
                </p>
              </article>

              <article className="enterprise-card glass-card fade-up delay-2">
                <div className="icon-box icon-purple">
                  <i className="fas fa-mobile-screen-button"></i>
                </div>
                <h3 className="card-title">Mobile & Web Apps</h3>
                <p className="card-text">
                  Scalable mobile applications with clean user interfaces, intuitive workflows, and robust backend integrations.
                </p>
              </article>

              <article className="enterprise-card glass-card fade-up delay-3">
                <div className="icon-box icon-cyan">
                  <i className="fas fa-server"></i>
                </div>
                <h3 className="card-title">API & Backend Systems</h3>
                <p className="card-text">
                  Secure data systems, cloud-connected microservices, and custom API integrations designed for enterprise scale.
                </p>
              </article>

              <article className="enterprise-card glass-card fade-up delay-1">
                <div className="icon-box icon-amber">
                  <i className="fas fa-chart-pie"></i>
                </div>
                <h3 className="card-title">Automation & Analytics</h3>
                <p className="card-text">
                  Data-driven dashboards, automated reporting pipelines, and operational intelligence to help teams decide faster.
                </p>
              </article>

              <article className="enterprise-card glass-card fade-up delay-2">
                <div className="icon-box icon-teal">
                  <i className="fas fa-cubes-stacked"></i>
                </div>
                <h3 className="card-title">Cloud & Deployment</h3>
                <p className="card-text">
                  Managed cloud deployments, containerized infrastructure, and CI/CD pipelines tailored for maximum uptime.
                </p>
              </article>

              <article className="enterprise-card glass-card fade-up delay-3">
                <div className="icon-box icon-rose">
                  <i className="fas fa-headset"></i>
                </div>
                <h3 className="card-title">Support & Maintenance</h3>
                <p className="card-text">
                  Continuous monitoring, security updates, feature enhancements, and dedicated technical support for your ecosystem.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Flagship Product Showcase */}
        <section id="project" className="section-block glass-section-light">
          <div className="section-container">
            <div className="section-header fade-up">
              <div className="section-tag bg-white/90 shadow-sm border border-blue-200">
                <i className="fas fa-fire-flame-curved"></i> FLAGSHIP PRODUCT
              </div>
              <h2 className="section-title">
                Smart LPG Distribution <span className="marker-pink">in action!</span>
              </h2>
              <p className="section-subtitle">
                A comprehensive software suite built to streamline gas distribution, real-time delivery tracking, inventory management, and logistics operations.
              </p>
            </div>

            <div className="showcase-wrapper glass-card fade-up delay-1">
              <div className="showcase-grid">
                <div className="showcase-info">
                  <h3>Modern Logistics Software for LPG Distributors</h3>
                  <p>
                    The Smart LPG Distribution App empowers distributors, managers, and field delivery agents with digital order workflows, automated dispatching, and role-based operational controls.
                  </p>

                  <div className="pill-features">
                    <div className="pill-badge bg-white/90 border border-slate-200">
                      <i className="fas fa-circle-check"></i> Live Delivery Tracking
                    </div>
                    <div className="pill-badge bg-white/90 border border-slate-200">
                      <i className="fas fa-circle-check"></i> Stock Analytics
                    </div>
                    <div className="pill-badge bg-white/90 border border-slate-200">
                      <i className="fas fa-circle-check"></i> Role-Based Access
                    </div>
                    <div className="pill-badge bg-white/90 border border-slate-200">
                      <i className="fas fa-circle-check"></i> Digital Invoicing
                    </div>
                    <div className="pill-badge bg-white/90 border border-slate-200">
                      <i className="fas fa-circle-check"></i> Secure Data Vault
                    </div>
                  </div>

                  <div style={{ marginTop: "1.5rem" }}>
                    <a
                      href="https://play.google.com/store/apps/details?id=com.ignito.smartDistributorApp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-cta"
                    >
                      <i className="fab fa-google-play"></i> View Smart LPG App on Google Play
                    </a>
                  </div>
                </div>

                <div className="highlight-stack">
                  <div className="highlight-item bg-white/80 border border-slate-200">
                    <h5>
                      <i className="fas fa-bolt"></i> Rapid Engineering
                    </h5>
                    <p>
                      Engineered in just 30 days by an 8-member distributed team, demonstrating rapid delivery capabilities.
                    </p>
                  </div>

                  <div className="highlight-item bg-white/80 border border-slate-200">
                    <h5>
                      <i className="fas fa-chart-line"></i> Direct ROI
                    </h5>
                    <p>
                      Reduces manual entry errors by up to 90% and accelerates order-to-delivery reporting for distributors.
                    </p>
                  </div>

                  <div className="highlight-item bg-white/80 border border-slate-200">
                    <h5>
                      <i className="fas fa-handshake"></i> Trusted Partner Deployment
                    </h5>
                    <p>
                      Actively deployed across major LPG supply chains and regional logistics networks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lead Generation & Qualification Form Section */}
        <ProjectInquiryForm />

        {/* Clients & Client Stores Section */}
        <section id="clients" className="section-block glass-section-alt">
          <div className="section-container">
            <div className="section-header fade-up">
              <div className="section-tag bg-white/90 shadow-sm border border-blue-200">
                <i className="fas fa-store"></i> CLIENT STORIES & STORES
              </div>
              <h2 className="section-title">
                Loved by <span className="doodle-underline-orange">real business leaders & client stores</span>
              </h2>
              <p className="section-subtitle">
                Here is what our enterprise partners, client stores, and businesses say about working with Ignito Corporation.
                <br />
                <span className="doodle-note" style={{ marginTop: "0.4rem" }}>
                  ⭐⭐⭐⭐⭐ 5.0 Rating from client stores & enterprise partners
                </span>
              </p>
            </div>

            <div className="client-track-container fade-up delay-1" id="client-container" ref={clientTrackRef}>
              <div className="client-track" id="clients-track">
                <a
                  href="https://play.google.com/store/apps/details?id=com.ignito.filedockuser"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="client-card glass-card"
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                      <i className="fas fa-quote-left client-quote-icon" style={{ marginBottom: 0 }}></i>
                      <span className="store-badge">
                        <i className="fab fa-google-play"></i> Google Play
                      </span>
                    </div>
                    <p className="client-quote">"Best and fast service for application development."</p>
                  </div>
                  <div className="client-profile">
                    <img src="/filedoc.jpeg" alt="FileDoc Client Store" className="client-avatar" />
                    <div>
                      <div className="client-name">
                        FILEDOC <i className="fas fa-arrow-up-right-from-square" style={{ fontSize: "0.75rem", color: "var(--primary)", marginLeft: "0.3rem" }}></i>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>Application Development</div>
                    </div>
                  </div>
                </a>

                <a
                  href="https://play.google.com/store/apps/details?id=com.fixkar.android"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="client-card glass-card"
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                      <i className="fas fa-quote-left client-quote-icon" style={{ marginBottom: 0 }}></i>
                      <span className="store-badge">
                        <i className="fab fa-google-play"></i> Google Play
                      </span>
                    </div>
                    <p className="client-quote">"Exceptional work delivered application on time."</p>
                  </div>
                  <div className="client-profile">
                    <img src="/fixkar.jpeg" alt="Fixkar Client Store" className="client-avatar" />
                    <div>
                      <div className="client-name">
                        FIXKAR <i className="fas fa-arrow-up-right-from-square" style={{ fontSize: "0.75rem", color: "var(--primary)", marginLeft: "0.3rem" }}></i>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>Service & Retail Client</div>
                    </div>
                  </div>
                </a>

                <a
                  href="https://play.google.com/store/apps/details?id=com.uawauto.uaw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="client-card glass-card"
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                      <i className="fas fa-quote-left client-quote-icon" style={{ marginBottom: 0 }}></i>
                      <span className="store-badge">
                        <i className="fab fa-google-play"></i> Google Play
                      </span>
                    </div>
                    <p className="client-quote">"Fully automated our business with application, thanks to all Ignito team!"</p>
                  </div>
                  <div className="client-profile">
                    <img src="/uaw auto.jpeg" alt="UAW Auto Client Store" className="client-avatar" />
                    <div>
                      <div className="client-name">
                        UAW AUTO <i className="fas fa-arrow-up-right-from-square" style={{ fontSize: "0.75rem", color: "var(--primary)", marginLeft: "0.3rem" }}></i>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>Automotive & Enterprise Client</div>
                    </div>
                  </div>
                </a>

                <a
                  href="https://play.google.com/store/apps/details?id=com.bainadabroothers.user"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="client-card glass-card"
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                      <i className="fas fa-quote-left client-quote-icon" style={{ marginBottom: 0 }}></i>
                      <span className="store-badge">
                        <i className="fab fa-google-play"></i> Google Play
                      </span>
                    </div>
                    <p className="client-quote">"The e-commerce app built by Ignito transformed our shopping experience—super smooth checkout, fast catalog browsing, and reliable performance."</p>
                  </div>
                  <div className="client-profile">
                    <img src="/bainada.jpeg" alt="Bainada Brothers Client Store" className="client-avatar" />
                    <div>
                      <div className="client-name">
                        BAINADA BROTHERS <i className="fas fa-arrow-up-right-from-square" style={{ fontSize: "0.75rem", color: "var(--primary)", marginLeft: "0.3rem" }}></i>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>E-Commerce & Retail App</div>
                    </div>
                  </div>
                </a>

                <a
                  href="https://www.vetalproductionhouse.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="client-card glass-card"
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                      <i className="fas fa-quote-left client-quote-icon" style={{ marginBottom: 0 }}></i>
                      <span className="store-badge">
                        <i className="fas fa-globe"></i> Live Website
                      </span>
                    </div>
                    <p className="client-quote">"Ignito crafted a stunning, cinematic digital web platform for our production house. The performance, visual depth, and client showcase experience are extraordinary!"</p>
                  </div>
                  <div className="client-profile">
                    <img src="/vetal.jpg" alt="Vetal Production House" className="client-avatar" />
                    <div>
                      <div className="client-name">
                        VETAL PRODUCTION HOUSE <i className="fas fa-arrow-up-right-from-square" style={{ fontSize: "0.75rem", color: "var(--primary)", marginLeft: "0.3rem" }}></i>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>Film & Media Production</div>
                    </div>
                  </div>
                </a>

                <article className="client-card glass-card">
                  <div>
                    <i className="fas fa-quote-left client-quote-icon"></i>
                    <p className="client-quote">"User-friendly system and exceptionally fast execution. Highly satisfied with the results."</p>
                  </div>
                  <div className="client-profile">
                    <img src="/matru.jpeg" alt="Matruchaya Corporation" className="client-avatar" />
                    <div>
                      <div className="client-name">MATRUCHAYA CORPORATION</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>LPG Distributor</div>
                    </div>
                  </div>
                </article>

                <article className="client-card glass-card">
                  <div>
                    <i className="fas fa-quote-left client-quote-icon"></i>
                    <p className="client-quote">"Streamlined distribution and significantly better reporting transparency across our operational teams."</p>
                  </div>
                  <div className="client-profile">
                    <img src="/salasar.jpeg" alt="Salasar Logistics" className="client-avatar" />
                    <div>
                      <div className="client-name">SALASAR LOGISTICS</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>Logistics & Supply</div>
                    </div>
                  </div>
                </article>

                <a
                  href="https://play.google.com/store/apps/details?id=com.ignito.smartDistributorApp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="client-card glass-card"
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                      <i className="fas fa-quote-left client-quote-icon" style={{ marginBottom: 0 }}></i>
                      <span className="store-badge">
                        <i className="fab fa-google-play"></i> Google Play
                      </span>
                    </div>
                    <p className="client-quote">"Delivery tracking became reliable overnight, and operational reports are available instantly."</p>
                  </div>
                  <div className="client-profile">
                    <img src="/lpg.jpeg" alt="Smart LPG Distribution App" className="client-avatar" />
                    <div>
                      <div className="client-name">
                        SMART LPG DISTRIBUTION <i className="fas fa-arrow-up-right-from-square" style={{ fontSize: "0.75rem", color: "var(--primary)", marginLeft: "0.3rem" }}></i>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>HPCL | BPCL | GOGAS Network</div>
                    </div>
                  </div>
                </a>

                <article className="client-card glass-card">
                  <div>
                    <i className="fas fa-quote-left client-quote-icon"></i>
                    <p className="client-quote">"Ignito helped us go digital in less than a month with a clean, stable, and intuitive mobile application."</p>
                  </div>
                  <div className="client-profile">
                    <img src="/mahaveer.jpeg" alt="Mahaveer Oils" className="client-avatar" />
                    <div>
                      <div className="client-name">MAHAVEER OILS</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>Industrial Client</div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="section-block glass-section-light">
          <div className="section-container">
            <div className="section-header fade-up">
              <div className="section-tag bg-white/90 shadow-sm border border-blue-200">
                <i className="fas fa-paper-plane"></i> GET IN TOUCH
              </div>
              <h2 className="section-title">
                Let's <span className="marker-cyan">build something great</span> together!
              </h2>
              <p className="section-subtitle">
                Connect with our team to discuss software development, enterprise integration, or digital product strategy.
                <br />
                <span className="doodle-note" style={{ marginTop: "0.4rem" }}>
                  ⚡ Direct support &bull; Fast response in &lt;24 hours!
                </span>
              </p>
            </div>

            <div className="contact-grid">
              <div className="contact-info-card glass-card fade-up delay-1">
                <h3>Ignito Corporation HQ</h3>
                <p>
                  Bhagirathpura, Indore, Madhya Pradesh, India
                  <br />
                  <strong>Official Email:</strong>{" "}
                  <a
                    href="mailto:support@ignitocorporation.live"
                    style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}
                  >
                    support@ignitocorporation.live
                  </a>
                  <br />
                  <strong>Call Support:</strong>{" "}
                  <a
                    href="tel:+916232480899"
                    onClick={() => handleTrackConversion("tel:+916232480899")}
                    style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}
                  >
                    +91 6232480899
                  </a>
                </p>

                <div style={{ marginBottom: "1.8rem", borderTop: "1px solid var(--border-light)", paddingTop: "1.4rem" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      marginBottom: "0.8rem",
                      color: "var(--text-main)",
                    }}
                  >
                    Direct Channels
                  </div>
                  <div className="social-strip">
                    <a
                      className="social-btn bg-white/90"
                      href="https://wa.me/916232480899"
                      aria-label="WhatsApp"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleTrackConversion("https://wa.me/916232480899")}
                    >
                      <i className="fab fa-whatsapp"></i>
                    </a>
                    <a
                      className="social-btn bg-white/90"
                      href="tel:+916232480899"
                      aria-label="Call Directly"
                      onClick={() => handleTrackConversion("tel:+916232480899")}
                    >
                      <i className="fas fa-phone-alt"></i>
                    </a>
                    <a className="social-btn bg-white/90" href="mailto:support@ignitocorporation.live" aria-label="Email">
                      <i className="fas fa-envelope"></i>
                    </a>
                    <a
                      className="social-btn bg-white/90"
                      href="https://x.com/Ignito485001"
                      aria-label="X Twitter"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-x-twitter"></i>
                    </a>
                    <a
                      className="social-btn bg-white/90"
                      href="https://www.linkedin.com/company/ignito-corporation/about/"
                      aria-label="LinkedIn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
              </div>

              <div className="map-card glass-card fade-up delay-2">
                <iframe
                  loading="lazy"
                  title="Ignito Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7359.055946004716!2d75.85446499183443!3d22.745779567474788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396302826b4d4fb9%3A0xd77fbc01a65120d3!2sBhagirathpura%2C%20Indore%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1749893351999!5m2!1sen!2sin"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer with Frosted Blur Glass */}
      <footer className="site-footer glass-section-alt relative z-10">
        <div className="footer-container">
          <div className="footer-bottom" style={{ borderTop: "none" }}>
            <div>
              © 2025-2026 <strong>Ignito Corporation</strong>. All rights reserved. &bull;{" "}
              <Link href="/privacy" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
                Privacy Policy & Terms
              </Link>
            </div>
            <div>
              Official Enquiries:{" "}
              <a href="mailto:support@ignitocorporation.live">support@ignitocorporation.live</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Contact Button */}
      <a
        href="https://wa.me/916232480899?text=Hello%20Ignito%20Corporation,%20I%20would%20like%20to%20inquire%20about%20your%20services."
        className="whatsapp-float-btn"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        id="whatsapp-chat-button"
        onClick={() =>
          handleTrackConversion(
            "https://wa.me/916232480899?text=Hello%20Ignito%20Corporation,%20I%20would%20like%20to%20inquire%20about%20your%20services."
          )
        }
      >
        <span className="whatsapp-pulse" aria-hidden="true"></span>
        <span className="wa-icon">
          <i className="fab fa-whatsapp"></i>
        </span>
        <span className="wa-text">Chat with us</span>
      </a>
    </>
  );
}
