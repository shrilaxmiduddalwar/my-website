"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function PrivacyPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Header Navigation */}
      <header id="site-header">
        <div className="nav-container">
          <Link href="/#about" className="brand">
            <img src="/ignito.png" alt="Ignito Corporation Logo" width={44} height={44} />
            <span className="brand-text">
              Ignito <span>Corporation</span>
            </span>
          </Link>

          <button
            className="mobile-menu-btn"
            id="mobile-toggle"
            aria-label="Toggle Navigation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>

          <nav className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`} id="nav-menu">
            <Link href="/#about" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="/#services" onClick={() => setMobileMenuOpen(false)}>
              Services
            </Link>
            <Link href="/#project" onClick={() => setMobileMenuOpen(false)}>
              Project
            </Link>
            <Link href="/#clients" onClick={() => setMobileMenuOpen(false)}>
              Clients
            </Link>
            <Link href="/privacy" className="active" onClick={() => setMobileMenuOpen(false)}>
              Privacy
            </Link>
            <a href="/PORTFOLIOO.pdf" download className="nav-cta" onClick={() => setMobileMenuOpen(false)}>
              <i className="fas fa-download"></i> Portfolio
            </a>
          </nav>
        </div>
      </header>

      <main className="section-container py-12 px-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-card border border-slate-200">
          <div className="section-tag mb-4">
            <i className="fas fa-shield-alt"></i> LEGAL & COMPLIANCE
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
            Terms & Conditions & Privacy Policy
          </h1>
          <p className="text-sm text-slate-500 mb-8">Last Updated: June 2025 | Ignito Corporation</p>

          <div className="space-y-6 text-slate-700 leading-relaxed text-base">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing and using any website, software, or mobile applications developed by Ignito Corporation, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-2">2. Scope of Services</h2>
              <p>
                Ignito Corporation provides enterprise digital solutions including custom software engineering, mobile application development, cloud automation, and distribution management systems.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-2">3. Privacy & Data Protection</h2>
              <p>
                We respect your personal privacy. We collect only necessary information to operate, provide customer support, and enhance our services. We do not sell or rent personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-2">4. Payment & Refund Policy</h2>
              <p>
                Custom digital development and software deliveries are subject to contract agreements signed between Ignito Corporation and the respective clients. All advance payments and phase deliverables are strictly non-refundable once development has commenced.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-2">5. Contact Information</h2>
              <p>
                For questions regarding our privacy policies or terms of service, reach out to us at:
                <br />
                <strong>Email:</strong>{" "}
                <a href="mailto:support@ignitocorporation.live" className="text-blue-600 font-semibold">
                  support@ignitocorporation.live
                </a>
                <br />
                <strong>Location:</strong> Bhagirathpura, Indore, Madhya Pradesh, India
              </p>
            </section>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-200">
            <Link href="/" className="btn btn-primary">
              <i className="fas fa-arrow-left"></i> Return to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-bottom">
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
    </>
  );
}
