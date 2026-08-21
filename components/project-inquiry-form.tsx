"use client";

import React, { useState } from "react";

const SERVICES = [
  { id: "mobile-app", title: "Mobile App Development", desc: "iOS, Android Native & Cross-Platform (React Native, Flutter)", icon: "fa-mobile-screen-button" },
  { id: "website", title: "Website Development", desc: "High-Converting Corporate & Landing Pages", icon: "fa-laptop-code" },
  { id: "custom-software", title: "Custom Software Development", desc: "Enterprise Workflows, ERP & Backend Systems", icon: "fa-server" },
  { id: "web-app-saas", title: "Web Application / SaaS", desc: "Full-Stack Platforms, Cloud Portals & Dashboards", icon: "fa-layer-group" },
  { id: "app-web-software", title: "App + Website + Software", desc: "Complete End-to-End Digital Ecosystem", icon: "fa-cubes-stacked" },
  { id: "consultation", title: "Not Sure — Need Consultation", desc: "Strategy, Scope Definition & Architecture Guidance", icon: "fa-lightbulb" },
];

const CURRENCIES = [
  { code: "USD ($)", symbol: "$", label: "USD ($) - US Dollar" },
  { code: "INR (₹)", symbol: "₹", label: "INR (₹) - Indian Rupee" },
  { code: "EUR (€)", symbol: "€", label: "EUR (€) - Euro" },
  { code: "GBP (£)", symbol: "£", label: "GBP (£) - British Pound" },
  { code: "AED (AED)", symbol: "AED", label: "AED (AED) - UAE Dirham" },
  { code: "CAD (C$)", symbol: "C$", label: "CAD (C$) - Canadian Dollar" },
  { code: "AUD (A$)", symbol: "A$", label: "AUD (A$) - Australian Dollar" },
  { code: "SGD (S$)", symbol: "S$", label: "SGD (S$) - Singapore Dollar" },
];

const BUDGET_PRESETS = [
  "1,000 – 2,500",
  "2,500 – 5,000",
  "5,000 – 10,000",
  "10,000 – 25,000",
  "25,000+",
  "Flexible / Need Quote",
];

const TIMELINES = [
  { label: "ASAP", icon: "fa-bolt" },
  { label: "Within 30 days", icon: "fa-calendar-days" },
  { label: "1–3 months", icon: "fa-hourglass-half" },
  { label: "Just researching", icon: "fa-magnifying-glass" },
];

export const ProjectInquiryForm: React.FC = () => {
  const [currency, setCurrency] = useState("USD ($)");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [formData, setFormData] = useState({
    service: "",
    timeline: "",
    description: "",
    name: "",
    company: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState("");

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.service) {
      newErrors.service = "Please select what you are looking to build.";
    }
    if (!budgetAmount.trim()) {
      newErrors.budget = "Please enter or select your estimated project budget.";
    }
    if (!formData.timeline) {
      newErrors.timeline = "Please select your target start timeline.";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Please tell us briefly about your project.";
    } else if (formData.description.trim().length < 8) {
      newErrors.description = "Please provide a bit more detail (at least 8 characters).";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Please enter your full name.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your WhatsApp or phone number.";
    } else if (formData.phone.trim().length < 7) {
      newErrors.phone = "Please enter a valid phone or WhatsApp number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      const firstErrorEl = document.querySelector(".form-error-msg, .input-error");
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const fullBudget = `${currency} ${budgetAmount.trim()}`;

    const message = `Hi, I just submitted a project inquiry through your website.

Project Type: ${formData.service}
Estimated Budget: ${fullBudget}
Timeline: ${formData.timeline}

Name: ${formData.name.trim()}
Company: ${formData.company.trim() || "N/A"}
Email: ${formData.email.trim()}
WhatsApp/Phone: ${formData.phone.trim()}

Project Details:
${formData.description.trim()}

I'm interested in discussing my project and getting a quote.`;

    const whatsappUrl = `https://wa.me/916232480899?text=${encodeURIComponent(message)}`;
    setLastWhatsAppUrl(whatsappUrl);
    setIsSubmitted(true);

    if (typeof window !== "undefined" && (window as any).gtag_report_conversion) {
      try {
        (window as any).gtag_report_conversion(whatsappUrl);
      } catch (err) {
        // ignore
      }
    }

    // Open WhatsApp in new window
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleReset = () => {
    setFormData({
      service: "",
      timeline: "",
      description: "",
      name: "",
      company: "",
      email: "",
      phone: "",
    });
    setBudgetAmount("");
    setCurrency("USD ($)");
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <section id="inquiry" className="relative z-10 py-10 md:py-14 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section Header - Clean compact gap */}
        <div className="text-center mb-6 md:mb-8 fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-blue-600 bg-white/95 border border-blue-200 shadow-sm mb-2.5">
            <i className="fas fa-clipboard-check"></i> PROJECT QUALIFICATION
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Tell Us About <span className="marker-yellow">Your Project</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-700 font-medium max-w-xl mx-auto leading-relaxed">
            Tell us a few details about your project and our team will get back to you shortly.
          </p>
        </div>

        {/* Form Container */}
        <div>
          {isSubmitted ? (
            /* Success State */
            <div className="glass-card rounded-3xl p-6 sm:p-10 text-center fade-up shadow-2xl border border-white/80 bg-white/95">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
                <i className="fas fa-check"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
                Thank you, {formData.name || "there"}!
              </h3>
              <p className="text-base text-slate-700 font-medium mb-6 max-w-md mx-auto">
                Thank you! Your project details are ready to send on WhatsApp.
              </p>
              <div className="p-4 bg-blue-50/80 border border-blue-100 rounded-2xl max-w-md mx-auto mb-6 text-sm text-slate-700 text-left space-y-1">
                <div><strong>Service:</strong> {formData.service}</div>
                <div><strong>Budget:</strong> {currency} {budgetAmount}</div>
                <div><strong>Timeline:</strong> {formData.timeline}</div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={lastWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto text-sm sm:text-base py-3 px-6"
                >
                  <i className="fab fa-whatsapp text-lg"></i> Open WhatsApp Chat Now
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-secondary w-full sm:w-auto text-sm sm:text-base py-3 px-6"
                >
                  <i className="fas fa-rotate-left"></i> Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            /* Active Qualification Form */
            <form
              onSubmit={handleSubmit}
              noValidate
              className="glass-card rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl border border-white/85 backdrop-blur-xl bg-white/92 fade-up"
            >
              {/* FIELD 1: WHAT ARE YOU LOOKING TO BUILD? */}
              <div className="mb-8">
                <label className="block font-heading text-base sm:text-lg font-bold text-slate-900 mb-1">
                  1. What are you looking to build? <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-500 mb-3">Select the service that best describes your needs.</p>

                {errors.service && (
                  <div className="form-error-msg text-xs sm:text-sm font-semibold text-red-600 mb-2.5 flex items-center gap-1.5">
                    <i className="fas fa-circle-exclamation"></i> {errors.service}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                  {SERVICES.map((item) => {
                    const isSelected = formData.service === item.title;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => {
                          setFormData({ ...formData, service: item.title });
                          if (errors.service) setErrors({ ...errors, service: "" });
                        }}
                        className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? "bg-blue-50/95 border-blue-600 ring-2 ring-blue-500/40 shadow-sm transform -translate-y-0.5"
                            : "bg-white/90 border-slate-200/90 hover:border-blue-300 hover:bg-slate-50/80"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs sm:text-sm ${
                              isSelected ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"
                            }`}>
                              <i className={`fas ${item.icon}`}></i>
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? "border-blue-600 bg-blue-600 text-white text-[10px]" : "border-slate-300"
                            }`}>
                              {isSelected && <i className="fas fa-check"></i>}
                            </div>
                          </div>
                          <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 mb-0.5 leading-snug">
                            {item.title}
                          </h4>
                          <p className="text-[11px] sm:text-xs text-slate-500 leading-normal">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FIELD 2: BUDGET WITH CURRENCY SELECTOR */}
              <div className="mb-8 pt-5 border-t border-slate-200/80">
                <label className="block font-heading text-base sm:text-lg font-bold text-slate-900 mb-1">
                  2. What is your estimated project budget? <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-500 mb-3">
                  Select your preferred currency and enter your target amount or pick a preset.
                </p>

                {errors.budget && (
                  <div className="form-error-msg text-xs sm:text-sm font-semibold text-red-600 mb-2.5 flex items-center gap-1.5">
                    <i className="fas fa-circle-exclamation"></i> {errors.budget}
                  </div>
                )}

                {/* Unified Currency + Budget Input Box */}
                <div className="flex flex-col sm:flex-row gap-2.5 mb-3">
                  {/* Currency Selector Mode */}
                  <div className="relative sm:w-48 flex-shrink-0">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full h-12 rounded-xl px-3.5 pr-8 text-sm font-bold bg-white text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer appearance-none shadow-sm"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                      <i className="fas fa-chevron-down text-xs"></i>
                    </div>
                  </div>

                  {/* Budget Text Input */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={budgetAmount}
                      onChange={(e) => {
                        setBudgetAmount(e.target.value);
                        if (errors.budget) setErrors({ ...errors, budget: "" });
                      }}
                      placeholder="e.g. 2,500 – 5,000 or Enter Custom Amount / Flexible"
                      className={`w-full h-12 rounded-xl px-4 text-sm font-medium text-slate-900 border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm ${
                        errors.budget ? "border-red-500 ring-1 ring-red-500" : "border-slate-200 focus:border-blue-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Quick 1-Tap Budget Presets */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-[11px] font-semibold text-slate-500 mr-1">Quick Select:</span>
                  {BUDGET_PRESETS.map((preset) => {
                    const isSelected = budgetAmount === preset;
                    return (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => {
                          setBudgetAmount(preset);
                          if (errors.budget) setErrors({ ...errors, budget: "" });
                        }}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white/80 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                        }`}
                      >
                        {preset}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FIELD 3: TIMELINE */}
              <div className="mb-8 pt-5 border-t border-slate-200/80">
                <label className="block font-heading text-base sm:text-lg font-bold text-slate-900 mb-1">
                  3. When are you looking to start? <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-500 mb-3">Target kickoff timeframe.</p>

                {errors.timeline && (
                  <div className="form-error-msg text-xs sm:text-sm font-semibold text-red-600 mb-2.5 flex items-center gap-1.5">
                    <i className="fas fa-circle-exclamation"></i> {errors.timeline}
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  {TIMELINES.map((item) => {
                    const isSelected = formData.timeline === item.label;
                    return (
                      <button
                        type="button"
                        key={item.label}
                        onClick={() => {
                          setFormData({ ...formData, timeline: item.label });
                          if (errors.timeline) setErrors({ ...errors, timeline: "" });
                        }}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-heading font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/25 transform -translate-y-0.5"
                            : "bg-white/90 text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                        }`}
                      >
                        <i className={`fas ${item.icon} text-xs ${isSelected ? "text-white" : "text-blue-600"}`}></i>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FIELD 4: PROJECT DESCRIPTION */}
              <div className="mb-8 pt-5 border-t border-slate-200/80">
                <label htmlFor="project-desc" className="block font-heading text-base sm:text-lg font-bold text-slate-900 mb-1">
                  4. Tell us briefly about your project <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-500 mb-2.5">
                  Briefly outline what you want to build, the main features you need, or the problem you want to solve.
                </p>

                {errors.description && (
                  <div className="form-error-msg text-xs sm:text-sm font-semibold text-red-600 mb-2 flex items-center gap-1.5">
                    <i className="fas fa-circle-exclamation"></i> {errors.description}
                  </div>
                )}

                <textarea
                  id="project-desc"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (errors.description) setErrors({ ...errors, description: "" });
                  }}
                  placeholder="Tell us what you want to build, the main features you need, or the problem you want to solve."
                  className={`w-full rounded-xl p-3.5 text-sm text-slate-900 border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.description ? "border-red-500 ring-1 ring-red-500" : "border-slate-200 focus:border-blue-500"
                  }`}
                />
              </div>

              {/* FIELD 5-8: CONTACT DETAILS */}
              <div className="mb-6 pt-5 border-t border-slate-200/80">
                <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 mb-1">
                  5. Your Contact Information
                </h3>
                <p className="text-xs text-slate-500 mb-3.5">
                  Where should we send your preliminary scope review and quote?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="user-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="user-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: "" });
                      }}
                      placeholder="e.g. John Doe"
                      className={`w-full rounded-xl px-3.5 py-2.5 text-sm text-slate-900 border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.name ? "border-red-500 ring-1 ring-red-500" : "border-slate-200 focus:border-blue-500"
                      }`}
                    />
                    {errors.name && (
                      <span className="text-xs text-red-600 font-medium mt-1 block">{errors.name}</span>
                    )}
                  </div>

                  {/* Company Name */}
                  <div>
                    <label htmlFor="company-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Company Name <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      id="company-name"
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Acme Tech Inc."
                      className="w-full rounded-xl px-3.5 py-2.5 text-sm text-slate-900 border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label htmlFor="user-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="user-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: "" });
                      }}
                      placeholder="e.g. john@company.com"
                      className={`w-full rounded-xl px-3.5 py-2.5 text-sm text-slate-900 border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.email ? "border-red-500 ring-1 ring-red-500" : "border-slate-200 focus:border-blue-500"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-xs text-red-600 font-medium mt-1 block">{errors.email}</span>
                    )}
                  </div>

                  {/* WhatsApp / Phone Number */}
                  <div>
                    <label htmlFor="user-phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      WhatsApp / Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="user-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: "" });
                      }}
                      placeholder="e.g. +1 (555) 234-5678"
                      className={`w-full rounded-xl px-3.5 py-2.5 text-sm text-slate-900 border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.phone ? "border-red-500 ring-1 ring-red-500" : "border-slate-200 focus:border-blue-500"
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-xs text-red-600 font-medium mt-1 block">{errors.phone}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON & TRUST BADGES */}
              <div className="pt-5 border-t border-slate-200/80">
                <button
                  type="submit"
                  className="btn btn-primary w-full py-3.5 text-sm sm:text-base font-bold shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <i className="fab fa-whatsapp text-lg sm:text-xl"></i>
                  <span>Get My Free Consultation</span>
                  <i className="fas fa-arrow-right text-xs"></i>
                </button>

                <div className="mt-3.5 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-slate-600 font-medium text-center">
                  <span className="flex items-center gap-1">
                    <i className="fas fa-lock text-emerald-600"></i> 100% Confidential
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <i className="fas fa-bolt text-amber-500"></i> Instant WhatsApp Pre-Filled Chat
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <i className="fas fa-clock text-blue-600"></i> Reply &lt;2 Hours
                  </span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
