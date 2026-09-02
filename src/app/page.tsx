"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";

interface SiteSettings {
  launchDate: string;
  contactEmail: string;
  whatsappNumber: string;
  websiteUrl: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    youtube: string;
  };
}

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function AnimatedVal({ value, className }: { value: string; className: string }) {
  const [displayVal, setDisplayVal] = useState(value);
  const [prevVal, setPrevVal] = useState(value);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (value !== displayVal) {
      setPrevVal(displayVal);
      setDisplayVal(value);
      setAnimating(true);
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 240);
      return () => clearTimeout(timer);
    }
  }, [value, displayVal]);

  return (
    <span className={`${className} cs-digit-box`}>
      {animating ? (
        <>
          <span className="cs-digit-old">{prevVal}</span>
          <span className="cs-digit-new">{displayVal}</span>
        </>
      ) : (
        <span className="cs-digit-static">{displayVal}</span>
      )}
    </span>
  );
}

export default function ComingSoonPage() {
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [countdown, setCountdown] = useState<CountdownTime>({ days: 7, hours: 15, minutes: 42, seconds: 18 });
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Desktop subtle mouse shift tracking
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) return;

    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const ox = (e.clientX - cx) * 0.004;
      const oy = (e.clientY - cy) * 0.004;
      setMouseOffset({
        x: Math.max(-3, Math.min(3, ox)),
        y: Math.max(-3, Math.min(3, oy)),
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Fetch site settings
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  // Countdown calculation
  const updateCountdown = useCallback(() => {
    if (!settings?.launchDate) return;
    const target = new Date(settings.launchDate).getTime();
    const now = Date.now();
    const diff = Math.max(0, target - now);

    setCountdown({
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    });
  }, [settings?.launchDate]);

  useEffect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [updateCountdown]);

  // Handle subscriber form submission with strict event prevention
  const handleSubscribe = async (e?: FormEvent | React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidationError(null);
    setFeedback(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setValidationError("Please fill out this field.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });
      const data = await res.json();

      if (res.ok) {
        setFeedback({ type: "success", message: data.message });
        setIsSuccess(true);
        setEmail("");
      } else {
        setFeedback({ type: "error", message: data.error || "Something went wrong" });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactEmail = settings?.contactEmail || "hello@forgestudio.in";
  const whatsappNumber = settings?.whatsappNumber || "+91 91489 31396";
  const websiteUrl = settings?.websiteUrl || "forgestudio.in";
  const cleanPhone = whatsappNumber.replace(/[^\d]/g, "");

  return (
    <>
      {/* ===== 1. APPROVED DESKTOP IMPLEMENTATION (>= 1024px) ===== */}
      <div className="cs-wrapper cs-desktop-only">
        <div className="cs-canvas-1820">
          {/* Decorative Right-Side Overlays for Ambient Glow & Logo Highlight */}
          <div className="cs-desktop-right-stage cs-entry-step-6">
            <div className="cs-platform-glow-overlay" />
            <div
              className="cs-cloth-logo-highlight"
              style={{
                transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
              }}
            />
          </div>

          {/* Static transparent PNG overlays with Entrance Reveal Steps */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/01_logo.png" alt="Forge Studio Logo" className="cs-asset-logo cs-entry-step-1" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/02_service_line.png" alt="SOFTWARE • WEB • DESIGN • MEDIA" className="cs-asset-service-line cs-entry-step-2" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/03_something_powerful.png" alt="SOMETHING POWERFUL IS" className="cs-asset-something-powerful cs-entry-step-2" />

          {/* COMING SOON asset with Sheen Sweep Overlay */}
          <div className="cs-coming-soon-wrapper cs-entry-step-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/04_coming_soon.png" alt="COMING SOON" className="cs-asset-coming-soon" />
            <div className="cs-sheen-overlay" />
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/05_forge_studio_hero.png" alt="FORGE STUDIO" className="cs-asset-forge-hero cs-entry-step-4" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/06_divider_description.png" alt="We are crafting digital experiences that lift brands to new heights." className="cs-asset-divider-description cs-entry-step-5" />

          {/* Real Dynamic DOM Countdown with Animated Digit Transitions */}
          <div className="cs-dynamic-countdown cs-entry-step-7">
            <div className="cs-countdown-col">
              <AnimatedVal value={pad(countdown.days)} className="cs-countdown-val" />
              <span className="cs-countdown-lbl">DAYS</span>
            </div>
            <div className="cs-countdown-col">
              <AnimatedVal value={pad(countdown.hours)} className="cs-countdown-val" />
              <span className="cs-countdown-lbl">HOURS</span>
            </div>
            <div className="cs-countdown-col">
              <AnimatedVal value={pad(countdown.minutes)} className="cs-countdown-val" />
              <span className="cs-countdown-lbl">MINUTES</span>
            </div>
            <div className="cs-countdown-col">
              <AnimatedVal value={pad(countdown.seconds)} className="cs-countdown-val" />
              <span className="cs-countdown-lbl">SECONDS</span>
            </div>
          </div>

          {/* Real Dynamic Subscription Form */}
          <div className="cs-dynamic-notify-form cs-entry-step-8">
            <div className="cs-notify-icon-group">
              <div className={`cs-notify-circle-icon ${isSuccess ? "cs-icon-plane-success" : ""}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </div>
              <span className="cs-notify-label-text">
                Be the first to know<br />when we launch.
              </span>
            </div>

            <form
              className="cs-notify-form-fields"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubscribe(e);
              }}
              noValidate
            >
              <div className="cs-input-wrapper">
                <input
                  type="email"
                  className={`cs-notify-email-input ${validationError ? "invalid" : ""}`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubscribe(e);
                    }
                  }}
                />
                {validationError && (
                  <div className="cs-custom-tooltip">
                    <div className="cs-tooltip-content">
                      <div className="cs-tooltip-icon-badge">!</div>
                      <span>{validationError}</span>
                    </div>
                    <div className="cs-tooltip-arrow" />
                  </div>
                )}
              </div>
              <button
                type="button"
                className={`cs-notify-submit-btn ${isSuccess ? "cs-btn-success" : ""}`}
                disabled={isSubmitting}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSubscribe(e);
                }}
              >
                <span className="cs-btn-text-wrap">
                  {isSubmitting ? "..." : isSuccess ? "YOU'RE ON THE LIST ✓" : "NOTIFY ME"}
                </span>
              </button>
            </form>

            {feedback && (
              <div style={{ position: "absolute", bottom: "-22px", right: "0", fontSize: "12.5px", fontWeight: 600, color: feedback.type === "success" ? "#0C8B68" : "#DC2626" }}>
                {feedback.message}
              </div>
            )}
          </div>

          {/* Real Dynamic Footer */}
          <footer className="cs-dynamic-footer cs-entry-step-9">
            <a href={`https://${websiteUrl}`} target="_blank" rel="noopener noreferrer" className="cs-footer-link-item">
              <svg className="cs-footer-icon-svg" viewBox="0 0 24 24" fill="none" stroke="#0C8B68" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>{websiteUrl}</span>
            </a>

            <a href={`mailto:${contactEmail}`} className="cs-footer-link-item">
              <svg className="cs-footer-icon-svg" viewBox="0 0 24 24" fill="none" stroke="#0C8B68" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>{contactEmail}</span>
            </a>

            <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noopener noreferrer" className="cs-footer-link-item">
              <svg className="cs-footer-icon-svg" viewBox="0 0 24 24" fill="none" stroke="#0C8B68" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <span>{whatsappNumber}</span>
            </a>

            <div className="cs-footer-social-section">
              <span className="cs-footer-follow-text">FOLLOW US</span>
              <a href={settings?.socialLinks?.instagram || "https://instagram.com/forgestudio"} target="_blank" rel="noopener noreferrer" className="cs-footer-social-btn" aria-label="Instagram">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0C8B68" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              <a
                href={settings?.socialLinks?.facebook || "https://facebook.com/forgestudio"}
                target="_blank"
                rel="noopener noreferrer"
                className="cs-footer-social-btn"
                aria-label="Facebook"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#0C8B68">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              <a href={settings?.socialLinks?.youtube || "https://youtube.com/@forgestudio"} target="_blank" rel="noopener noreferrer" className="cs-footer-social-btn" aria-label="YouTube">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#0C8B68">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </footer>
        </div>
      </div>

      {/* ===== 2. SEPARATE MOBILE COMPOSITION (<= 1023px) ===== */}
      <div className="cs-mobile-only cs-mobile-page">
        <div className="cs-mobile-content">
          {/* 1. Header Bar: Logo */}
          <div className="cs-mobile-header cs-entry-step-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/01_logo.png" alt="Forge Studio Logo" className="cs-mobile-logo-img" />
          </div>

          {/* 2. Hero Typography Image Stack */}
          <div className="cs-mobile-hero-stack">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/03_something_powerful.png" alt="SOMETHING POWERFUL IS" className="cs-mobile-hero-img cs-mobile-something-img cs-entry-step-2" />

            <div className="cs-coming-soon-wrapper cs-entry-step-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/04_coming_soon.png" alt="COMING SOON" className="cs-mobile-hero-img cs-mobile-coming-soon-img" />
              <div className="cs-sheen-overlay" />
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/05_forge_studio_hero.png" alt="FORGE STUDIO" className="cs-mobile-hero-img cs-mobile-forge-hero-img cs-entry-step-4" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/06_divider_description.png" alt="We are crafting digital experiences that lift brands to new heights." className="cs-mobile-hero-img cs-mobile-desc-img cs-entry-step-5" />
          </div>

          {/* 3. 3D Stage Reveal Section */}
          <div className="cs-mobile-reveal-wrap cs-entry-step-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/mobile-cloth-reveal.png" alt="SOFTWARE • WEB • DESIGN • MEDIA - Forge Studio 3D Stage Reveal" className="cs-mobile-reveal-img" />
          </div>

          {/* 4. Dynamic Single-Row HTML Countdown */}
          <div className="cs-mobile-countdown-container cs-entry-step-7">
            <div className="cs-mobile-countdown">
              <div className="cs-mobile-countdown-col">
                <AnimatedVal value={pad(countdown.days)} className="cs-mobile-countdown-val" />
                <span className="cs-mobile-countdown-lbl">DAYS</span>
              </div>
              <div className="cs-mobile-countdown-col">
                <AnimatedVal value={pad(countdown.hours)} className="cs-mobile-countdown-val" />
                <span className="cs-mobile-countdown-lbl">HOURS</span>
              </div>
              <div className="cs-mobile-countdown-col">
                <AnimatedVal value={pad(countdown.minutes)} className="cs-mobile-countdown-val" />
                <span className="cs-mobile-countdown-lbl">MINUTES</span>
              </div>
              <div className="cs-mobile-countdown-col">
                <AnimatedVal value={pad(countdown.seconds)} className="cs-mobile-countdown-val" />
                <span className="cs-mobile-countdown-lbl">SECONDS</span>
              </div>
            </div>
          </div>

          {/* Dynamic HTML Subscription Form */}
          <div className="cs-mobile-section-container cs-entry-step-8">
            <div className="cs-mobile-notify">
              <div className="cs-mobile-notify-header">
                <div className={`cs-mobile-circle-icon ${isSuccess ? "cs-icon-plane-success" : ""}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </div>
                <span className="cs-mobile-notify-text">Be the first to know when we launch.</span>
              </div>

              <form
                className="cs-mobile-notify-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSubscribe(e);
                }}
                noValidate
              >
                <div className="cs-input-wrapper cs-mobile-input-wrapper">
                  <input
                    type="email"
                    className={`cs-mobile-email-input ${validationError ? "invalid" : ""}`}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSubscribe(e);
                      }
                    }}
                  />
                  {validationError && (
                    <div className="cs-custom-tooltip cs-mobile-tooltip">
                      <div className="cs-tooltip-content">
                        <div className="cs-tooltip-icon-badge">!</div>
                        <span>{validationError}</span>
                      </div>
                      <div className="cs-tooltip-arrow" />
                    </div>
                  )}
                </div>

                {validationError && (
                  <div className="cs-mobile-validation-banner">
                    <div className="cs-tooltip-icon-badge">!</div>
                    <span>{validationError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className={`cs-mobile-submit-btn ${isSuccess ? "cs-btn-success" : ""}`}
                  disabled={isSubmitting}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSubscribe(e);
                  }}
                >
                  <span className="cs-btn-text-wrap">
                    {isSubmitting ? "..." : isSuccess ? "YOU'RE ON THE LIST ✓" : "NOTIFY ME"}
                  </span>
                </button>
              </form>

              {feedback && (
                <div style={{ marginTop: "8px", textAlign: "center", fontSize: "13px", fontWeight: 600, color: feedback.type === "success" ? "#0C8B68" : "#DC2626" }}>
                  {feedback.message}
                </div>
              )}
            </div>
          </div>

          {/* Dynamic HTML Mobile Footer Bar */}
          <div className="cs-mobile-section-container cs-entry-step-9">
            <footer className="cs-mobile-footer">
              <div className="cs-mobile-footer-links">
                <a href={`https://${websiteUrl}`} target="_blank" rel="noopener noreferrer" className="cs-mobile-footer-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0C8B68" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <span>{websiteUrl}</span>
                </a>

                <a href={`mailto:${contactEmail}`} className="cs-mobile-footer-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0C8B68" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>{contactEmail}</span>
                </a>

                <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noopener noreferrer" className="cs-mobile-footer-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0C8B68" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  <span>{whatsappNumber}</span>
                </a>
              </div>

              <div className="cs-mobile-social-bar">
                <span className="cs-mobile-follow-lbl">FOLLOW US</span>
                <div className="cs-mobile-social-icons">
                  <a href={settings?.socialLinks?.instagram || "https://instagram.com/forgestudio"} target="_blank" rel="noopener noreferrer" className="cs-mobile-social-link" aria-label="Instagram">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0C8B68" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>

                  <a href={settings?.socialLinks?.facebook || "https://facebook.com/forgestudio"} target="_blank" rel="noopener noreferrer" className="cs-mobile-social-link" aria-label="Facebook">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0C8B68">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>

                  <a href={settings?.socialLinks?.youtube || "https://youtube.com/@forgestudio"} target="_blank" rel="noopener noreferrer" className="cs-mobile-social-link" aria-label="YouTube">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#0C8B68">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
