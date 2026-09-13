import React, { useRef, useEffect, useState } from "react";

export interface BentoFeature {
  id: string;
  title: string;
  description: string;
  video: string;
  size: "small" | "large";
}

interface BentoFeatureCardProps {
  feature: BentoFeature;
  className?: string;
}

export const BentoFeatureCard: React.FC<BentoFeatureCardProps> = ({
  feature,
  className = "",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideoError, setHasVideoError] = useState(false);

  // Performance: Play video when visible, pause when outside viewport
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isIntersecting = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Browser autoplay policy or pending media fallback
            });
          }
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={`${feature.title} capability`}
      className={`group relative overflow-hidden rounded-[20px] border border-neutral-800/80 bg-[#121214] shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 ease-out hover:border-neutral-600/90 hover:shadow-[0_8px_32px_rgba(0,0,0,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 ${className}`}
    >
      {/* Dark neutral surface with subtle ambient lighting fallback (no fake UI/charts) */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_40%,#1e1e23_0%,#111113_100%)] opacity-90"
        aria-hidden="true"
      />

      {/* Real continuous looping ambient product capability video */}
      {/* Replace with final CarbonFlow capability video. */}
      {!hasVideoError && (
        <video
          ref={videoRef}
          src={feature.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          onError={() => setHasVideoError(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.025]"
        />
      )}

      {/* Subtle darkening vignette overlay for pristine text contrast without washing out video */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15 pointer-events-none transition-colors duration-300 group-hover:from-black/90 group-hover:via-black/40"
        aria-hidden="true"
      />

      {/* Text layer positioned bottom-left over the video with elegant micro-lift on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10 flex flex-col justify-end text-left transition-transform duration-300 ease-out group-hover:-translate-y-1">
        <h3 className="font-['Poppins',sans-serif] text-[20px] md:text-[22px] lg:text-[24px] font-semibold text-white tracking-[-0.02em] leading-tight select-none">
          {feature.title}
        </h3>
        <p className="font-['Roboto',sans-serif] text-[14px] md:text-[15px] lg:text-[16px] font-normal text-white/75 leading-[1.55] tracking-[-0.01em] mt-2 max-w-[480px] select-none">
          {feature.description}
        </p>
      </div>
    </div>
  );
};

export default BentoFeatureCard;
