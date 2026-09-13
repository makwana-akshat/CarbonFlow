import React, { useRef, useCallback, useEffect, useState } from 'react';
import LaserFlow from '../../ui/LaserFlow';
import { HeroNavigation } from './HeroNavigation';
import { HeroContent } from './HeroContent';
import { HeroBackgroundReveal } from './HeroBackgroundReveal';
import { HeroProductStage } from './HeroProductStage';
import './Section01.css';

export const Section01: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const revealImgRef = useRef<HTMLImageElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const [beamYOffset, setBeamYOffset] = useState(-0.25);

  const mouseTarget = useRef({ x: -9999, y: -9999, active: false });
  const mouseCurrent = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number | null>(null);

  // Dynamically connects the laser beam flare directly to the top rim of the bottom product box
  const updateBeamOffset = useCallback(() => {
    if (!sectionRef.current || !stageRef.current) return;
    const sectionRect = sectionRef.current.getBoundingClientRect();
    const stageRect = stageRef.current.getBoundingClientRect();
    const boxTop = stageRect.top - sectionRect.top;
    const containerH = window.innerHeight * 0.95;

    // Y_flare = containerH * (0.5 - verticalBeamOffset) = boxTop
    // Therefore: verticalBeamOffset = 0.5 - (boxTop / containerH)
    if (containerH > 0) {
      const calculatedOffset = 0.5 - (boxTop / containerH);
      setBeamYOffset(calculatedOffset);
    }
  }, []);

  useEffect(() => {
    updateBeamOffset();
    window.addEventListener('resize', updateBeamOffset);
    const timer = setTimeout(updateBeamOffset, 120);
    return () => {
      window.removeEventListener('resize', updateBeamOffset);
      clearTimeout(timer);
    };
  }, [updateBeamOffset]);

  // Smooth lerp cursor tracking loop for fluid, premium spotlight movement
  useEffect(() => {
    const updateCursor = () => {
      const el = revealImgRef.current;
      if (el) {
        if (!mouseTarget.current.active) {
          el.style.setProperty('--reveal-opacity', '0');
        } else {
          el.style.setProperty('--reveal-opacity', '1');
          if (mouseCurrent.current.x === -9999) {
            mouseCurrent.current.x = mouseTarget.current.x;
            mouseCurrent.current.y = mouseTarget.current.y;
          } else {
            const ease = 0.18;
            mouseCurrent.current.x += (mouseTarget.current.x - mouseCurrent.current.x) * ease;
            mouseCurrent.current.y += (mouseTarget.current.y - mouseCurrent.current.y) * ease;
          }
          el.style.setProperty('--mx', `${mouseCurrent.current.x.toFixed(1)}px`);
          el.style.setProperty('--my', `${mouseCurrent.current.y.toFixed(1)}px`);
        }
      }
      rafRef.current = requestAnimationFrame(updateCursor);
    };

    rafRef.current = requestAnimationFrame(updateCursor);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseTarget.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseTarget.current.active = false;
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="carbonflow-hero-section select-none"
      id="section-01"
      aria-label="CarbonFlow Hero and Product Reveal"
    >
      {/* =================================================================== */}
      {/* Layer 0: Dark Base Canvas                                           */}
      {/* =================================================================== */}
      <div
        className="carbonflow-layer-bg absolute inset-0 bg-[#03000a]"
        aria-hidden="true"
      />

      {/* =================================================================== */}
      {/* Layer 1 & 2: Background Image & Smooth Interactive Reveal Layer     */}
      {/* Covers whole background behind the LaserFlow beam                   */}
      {/* =================================================================== */}
      <HeroBackgroundReveal revealImgRef={revealImgRef} />

      {/* =================================================================== */}
      {/* Layer 3: LaserFlow WebGL Beam & Volumetric Fog                      */}
      {/* Emerges continuously from the very top, terminates on product card  */}
      {/* =================================================================== */}
      <div
        className="carbonflow-layer-laserflow absolute top-0 left-0 right-0 w-full h-[95vh] pointer-events-none"
        aria-hidden="true"
      >
        <LaserFlow
          horizontalBeamOffset={0.1}
          verticalBeamOffset={beamYOffset}
          color="#8EA5FF"
          horizontalSizing={0.46}
          verticalSizing={5}
          wispDensity={5}
          wispSpeed={21.5}
          wispIntensity={20}
          flowSpeed={0.59}
          flowStrength={0.39}
          fogIntensity={1}
          fogScale={0.2}
          fogFallSpeed={0.55}
          decay={3}
          falloffStart={2.66}
        />
      </div>

      {/* =================================================================== */}
      {/* Layer 4: Transparent Navigation                                     */}
      {/* Sits directly on top of scene with nav links shifted left of beam   */}
      {/* =================================================================== */}
      <HeroNavigation />

      {/* =================================================================== */}
      {/* PART 1 (VIEW 1): Hero Content (Solid Poppins H1 + Body + CTAs)      */}
      {/* =================================================================== */}
      <HeroContent />

      {/* =================================================================== */}
      {/* PART 2 (VIEW 2): Product Stage (Connected Card + Capabilities)      */}
      {/* Laser beam terminates directly on top rim of stageRef card          */}
      {/* =================================================================== */}
      <HeroProductStage stageRef={stageRef} />
    </section>
  );
};

export default Section01;
