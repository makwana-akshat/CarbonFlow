import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ChevronUp,
  Check,
  Send,
  ShieldCheck,
} from "lucide-react";

export const LandingFooter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().includes("@")) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
      }, 2500);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#07060A] text-white pt-16 md:pt-20 pb-12 mt-24 lg:mt-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Top Intelligence Dispatch / Newsletter Strip */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 md:p-10 mb-16 relative overflow-hidden backdrop-blur-sm">
          <div
            className="pointer-events-none absolute -right-20 -bottom-20 w-80 h-80 rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, rgba(244,97,30,0.35) 0%, rgba(244,97,30,0) 70%)",
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#F4611E] shadow-[0_0_8px_#F4611E]" />
                <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.1em] text-[#F4611E]">
                  Carbon Intelligence Dispatch
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2 font-['Poppins']">
                Stay Ahead of Global CO₂ Corridors
              </h3>
              <p className="text-[14px] md:text-[15px] text-[#8E8D95] max-w-xl leading-relaxed">
                Bi-weekly analytics on industrial point-source emissions, off-take market clearing prices, pipeline network developments, and regulatory frameworks.
              </p>
            </div>

            <div className="lg:col-span-5">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your enterprise email..."
                  required
                  className="flex-1 h-12 px-4 rounded-xl bg-white/[0.04] border border-white/[0.12] text-[14px] text-white placeholder-[#68676E] focus:outline-none focus:border-[#F4611E] transition-colors"
                />
                <button
                  type="submit"
                  disabled={subscribed}
                  className="h-12 px-6 rounded-xl bg-[#F4611E] hover:bg-[#ff7232] text-white font-medium text-[14px] flex items-center justify-center gap-2 transition-all duration-200 shrink-0 shadow-[0_2px_14px_rgba(244,97,30,0.35)] disabled:opacity-80"
                >
                  {subscribed ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Subscribed</span>
                    </>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
              <div className="flex items-center gap-4 mt-3 text-[11px] text-[#63626A]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8A8992]" /> No spam ever
                </span>
                <span>•</span>
                <span>Unsubscribe at any time</span>
                <span>•</span>
                <span>Institutional grade data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main 5-Column Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-16 border-b border-white/[0.08]">
          {/* Brand & Ecosystem Summary Column (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-6">
            <div className="flex items-center gap-2 mb-4 select-none">
              <span className="text-2xl font-bold tracking-tight text-white font-['Poppins']">
                CarbonFlow
              </span>
              <span className="w-2 h-2 rounded-full bg-[#F4611E] shadow-[0_0_10px_#F4611E]" />
            </div>

            <p className="text-[14px] text-[#8E8D95] leading-relaxed mb-6">
              The autonomous orchestration network for industrial carbon capture, algorithmic purity matching, pipeline dispatch, and physical utilization.
            </p>

            {/* Network Health Status Pill */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[12px] font-mono text-[#A2A1A8]">
                Network Operational · v2.4.0
              </span>
            </div>

            {/* Operational Stats */}
            <div className="grid grid-cols-2 gap-4 w-full p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-6">
              <div>
                <span className="block text-[11px] font-mono text-[#6E6D75] uppercase">
                  Routed Volume
                </span>
                <span className="text-[16px] font-bold text-white font-mono">
                  2.41M tCO₂
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-mono text-[#6E6D75] uppercase">
                  Avg Match Time
                </span>
                <span className="text-[16px] font-bold text-white font-mono">
                  142 ms
                </span>
              </div>
            </div>

            {/* Social & Community Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="CarbonFlow GitHub"
                className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#8E8D95] hover:text-white hover:border-white/20 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="CarbonFlow on X"
                className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#8E8D95] hover:text-white hover:border-white/20 transition-all"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="CarbonFlow LinkedIn"
                className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#8E8D95] hover:text-white hover:border-white/20 transition-all"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 1: Platform & Modules (2 cols) */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="text-[13px] font-mono font-semibold uppercase tracking-[0.08em] text-[#FFFFFF] mb-5">
              Platform
            </h4>
            <ul className="space-y-3 text-[14px]">
              <li>
                <Link
                  to="/app/marketplace"
                  className="text-[#8E8D95] hover:text-white transition-colors no-underline inline-flex items-center gap-1 group"
                >
                  <span>CO₂ Marketplace</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  to="/app/maps"
                  className="text-[#8E8D95] hover:text-white transition-colors no-underline inline-flex items-center gap-1 group"
                >
                  <span>Pipeline Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  to="/app/logistics"
                  className="text-[#8E8D95] hover:text-white transition-colors no-underline inline-flex items-center gap-1 group"
                >
                  <span>Fleet Logistics</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  to="/app/contracts"
                  className="text-[#8E8D95] hover:text-white transition-colors no-underline inline-flex items-center gap-1 group"
                >
                  <span>Smart Contracts</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  to="/app/impact"
                  className="text-[#8E8D95] hover:text-white transition-colors no-underline inline-flex items-center gap-1 group"
                >
                  <span>LCA & Impact</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all" />
                </Link>
              </li>
              <li>
                <a
                  href="#section-02"
                  onClick={(e) => scrollToSection(e, "section-02")}
                  className="text-[#8E8D95] hover:text-white transition-colors"
                >
                  Capabilities Grid
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Industrial Sectors (2 cols) */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="text-[13px] font-mono font-semibold uppercase tracking-[0.08em] text-[#FFFFFF] mb-5">
              Sectors
            </h4>
            <ul className="space-y-3 text-[14px]">
              <li>
                <span className="text-[#8E8D95] hover:text-white transition-colors cursor-pointer">
                  Direct Air Capture (DAC)
                </span>
              </li>
              <li>
                <span className="text-[#8E8D95] hover:text-white transition-colors cursor-pointer">
                  Concrete Mineralization
                </span>
              </li>
              <li>
                <span className="text-[#8E8D95] hover:text-white transition-colors cursor-pointer">
                  Cement & Heavy Industry
                </span>
              </li>
              <li>
                <span className="text-[#8E8D95] hover:text-white transition-colors cursor-pointer">
                  Sustainable Aviation (e-SAF)
                </span>
              </li>
              <li>
                <span className="text-[#8E8D95] hover:text-white transition-colors cursor-pointer">
                  Geologic Sequestration
                </span>
              </li>
              <li>
                <span className="text-[#8E8D95] hover:text-white transition-colors cursor-pointer">
                  Commercial Greenhouses
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Architecture & Protocol (2 cols) */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="text-[13px] font-mono font-semibold uppercase tracking-[0.08em] text-[#FFFFFF] mb-5">
              Protocol
            </h4>
            <ul className="space-y-3 text-[14px]">
              <li>
                <a
                  href="#section-03"
                  onClick={(e) => scrollToSection(e, "section-03")}
                  className="text-[#8E8D95] hover:text-white transition-colors"
                >
                  System Architecture
                </a>
              </li>
              <li>
                <span className="text-[#8E8D95] hover:text-white transition-colors cursor-pointer">
                  Purity Verification Oracles
                </span>
              </li>
              <li>
                <span className="text-[#8E8D95] hover:text-white transition-colors cursor-pointer">
                  Multi-Party Settlement
                </span>
              </li>
              <li>
                <span className="text-[#8E8D95] hover:text-white transition-colors cursor-pointer">
                  API Documentation
                </span>
              </li>
              <li>
                <span className="text-[#8E8D95] hover:text-white transition-colors cursor-pointer">
                  ISO 14064 Compliance
                </span>
              </li>
              <li>
                <span className="text-[#8E8D95] hover:text-white transition-colors cursor-pointer">
                  Security Framework
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Organization & Legal (2 cols) */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="text-[13px] font-mono font-semibold uppercase tracking-[0.08em] text-[#FFFFFF] mb-5">
              Organization
            </h4>
            <ul className="space-y-3 text-[14px]">
              <li>
                <span className="text-[#8E8D95] hover:text-white transition-colors cursor-pointer">
                  About CarbonFlow
                </span>
              </li>
              <li>
                <div className="inline-flex items-center gap-2">
                  <span className="text-[#8E8D95] hover:text-white transition-colors cursor-pointer">
                    Careers
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#F4611E]/20 text-[#F4611E] rounded-md border border-[#F4611E]/30">
                    Hiring
                  </span>
                </div>
              </li>
              <li>
                <span className="text-[#8E8D95] hover:text-white transition-colors cursor-pointer">
                  Research Papers
                </span>
              </li>
              <li>
                <span className="text-[#8E8D95] hover:text-white transition-colors cursor-pointer">
                  Press & Media Kit
                </span>
              </li>
              <li>
                <span className="text-[#8E8D95] hover:text-white transition-colors cursor-pointer">
                  Contact Engineering
                </span>
              </li>
              <li>
                <span className="text-[#8E8D95] hover:text-white transition-colors cursor-pointer">
                  Status Page
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Copyright & Entity */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <span className="text-[13px] text-[#68676E]">
              © {new Date().getFullYear()} CarbonFlow Technologies Inc. All rights reserved.
            </span>
            <span className="hidden sm:inline text-[#36353C]">•</span>
            <span className="text-[12px] text-[#55545B]">
              Autonomous Industrial Carbon Infrastructure
            </span>
          </div>

          {/* Compliance Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-[#6A6972]">
            <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06]">
              ISO 14064-1
            </span>
            <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06]">
              VERRA ALIGNED
            </span>
            <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06]">
              SOC2 TYPE II
            </span>
          </div>

          {/* Legal Links & Back to Top */}
          <div className="flex items-center gap-5 text-[13px] text-[#7E7D86]">
            <a
              href="#privacy"
              onClick={(e) => e.preventDefault()}
              className="hover:text-white transition-colors"
            >
              Privacy
            </a>
            <span className="text-[#36353C]">•</span>
            <a
              href="#terms"
              onClick={(e) => e.preventDefault()}
              className="hover:text-white transition-colors"
            >
              Terms
            </a>
            <span className="text-[#36353C]">•</span>
            <a
              href="#security"
              onClick={(e) => e.preventDefault()}
              className="hover:text-white transition-colors"
            >
              Security
            </a>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              aria-label="Scroll back to top"
              className="ml-2 w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.1] hover:border-white/30 flex items-center justify-center text-[#8E8D95] hover:text-white transition-colors"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
