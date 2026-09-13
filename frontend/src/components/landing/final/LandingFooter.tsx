import React from "react";
import { Link } from "react-router-dom";

export const LandingFooter: React.FC = () => {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full border-t border-white/[0.08] pt-12 pb-14 mt-20 lg:mt-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand Column */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-1.5 select-none">
            <span className="carbonflow-footer-brand text-xl font-bold text-white tracking-tight">
              CarbonFlow
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F4611E] shadow-[0_0_8px_#F4611E]" />
          </div>
          <p className="text-[12px] text-[#717077] tracking-normal font-normal">
            Autonomous CO₂ Routing & Physical Infrastructure
          </p>
        </div>

        {/* Navigation Links */}
        <nav
          aria-label="Footer Navigation"
          className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-3"
        >
          <a
            href="#section-02"
            onClick={(e) => scrollToSection(e, "section-02")}
            className="carbonflow-footer-link hover:text-white transition-colors select-none"
          >
            Product
          </a>
          <Link
            to="/app/marketplace"
            className="carbonflow-footer-link hover:text-white transition-colors select-none no-underline"
          >
            Marketplace
          </Link>
          <Link
            to="/app/maps"
            className="carbonflow-footer-link hover:text-white transition-colors select-none no-underline"
          >
            Maps
          </Link>
          <Link
            to="/app/logistics"
            className="carbonflow-footer-link hover:text-white transition-colors select-none no-underline"
          >
            Logistics
          </Link>
          <Link
            to="/app/contracts"
            className="carbonflow-footer-link hover:text-white transition-colors select-none no-underline"
          >
            Contracts
          </Link>
          <Link
            to="/app/impact"
            className="carbonflow-footer-link hover:text-white transition-colors select-none no-underline"
          >
            Impact
          </Link>
        </nav>

        {/* Legal & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center md:text-right">
          <div className="flex items-center gap-4 text-xs text-[#717077]">
            <a
              href="#privacy"
              onClick={(e) => e.preventDefault()}
              className="hover:text-[#A09FA6] transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-[#36353C]">•</span>
            <a
              href="#terms"
              onClick={(e) => e.preventDefault()}
              className="hover:text-[#A09FA6] transition-colors"
            >
              Terms of Service
            </a>
          </div>
          <span className="carbonflow-footer-legal text-[13px] text-[#636268]">
            © {new Date().getFullYear()} CarbonFlow. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
