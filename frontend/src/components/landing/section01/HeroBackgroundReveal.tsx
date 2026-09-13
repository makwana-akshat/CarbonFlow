import React from 'react';

// Replace with final CarbonFlow hero product image supplied by project owner.
const PRODUCT_IMAGE_SRC = '/images/carbonflow/hero-product.webp';

interface HeroBackgroundRevealProps {
  revealImgRef?: React.RefObject<HTMLImageElement | null>;
}

export const HeroBackgroundReveal: React.FC<HeroBackgroundRevealProps> = ({ revealImgRef }) => {
  return (
    <>
      {/* =================================================================== */}
      {/* 1. Whole-Background Base Product Image Layer (Layer 1)              */}
      {/* Dimly visible across the entire section background behind the beam  */}
      {/* =================================================================== */}
      <div className="carbonflow-layer-bg-image absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none">
        {/* Replace with final CarbonFlow hero product image supplied by project owner. */}
        <img
          src={PRODUCT_IMAGE_SRC}
          alt=""
          className="w-full h-full object-cover object-top opacity-15 filter contrast-125 brightness-75"
          loading="eager"
        />
        {/* Vignette gradients to smoothly blend into the near-black canvas */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#03000a]/50 via-transparent to-[#03000a]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#03000a]/60 via-transparent to-[#03000a]/60" />
      </div>

      {/* =================================================================== */}
      {/* 2. Smooth Interactive Cursor Reveal Effect (Layer 2)                */}
      {/* Restrained 130px radius with smooth multi-stop feathering           */}
      {/* =================================================================== */}
      <img
        ref={revealImgRef}
        src={PRODUCT_IMAGE_SRC}
        alt="Reveal effect"
        className="carbonflow-layer-reveal select-none"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top',
          zIndex: 2,
          mixBlendMode: 'lighten',
          opacity: 'calc(var(--reveal-opacity, 0) * 0.35)',
          transition: 'opacity 0.35s ease-out',
          pointerEvents: 'none',
          '--mx': '-9999px',
          '--my': '-9999px',
          WebkitMaskImage:
            'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.9) 30px, rgba(255,255,255,0.55) 65px, rgba(255,255,255,0.18) 100px, rgba(255,255,255,0) 130px)',
          maskImage:
            'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.9) 30px, rgba(255,255,255,0.55) 65px, rgba(255,255,255,0.18) 100px, rgba(255,255,255,0) 130px)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat'
        } as React.CSSProperties}
      />
    </>
  );
};

export default HeroBackgroundReveal;
