import React from 'react';

export type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface SiriOrbProps {
  state?: OrbState;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

export const SiriOrb: React.FC<SiriOrbProps> = ({
  state = 'idle',
  size = 'md',
  className = '',
  onClick,
  ariaLabel = 'CarbonFlow AI Assistant',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-13 h-13',
    lg: 'w-16 h-16',
  };

  const getGradientTheme = () => {
    switch (state) {
      case 'listening':
        // Fast pulse + warm/orange palette
        return {
          core: 'from-[#F4611E] via-[#FF8A48] to-[#FFC59E]',
          glow: 'rgba(244, 97, 30, 0.45)',
          aura: 'rgba(244, 97, 30, 0.25)',
          ringColor: 'border-[#F4611E]/40',
          animationSpeed: 'duration-700 animate-pulse',
        };
      case 'thinking':
        // Faster cool/blue processing state
        return {
          core: 'from-[#2563EB] via-[#06B6D4] to-[#818CF8]',
          glow: 'rgba(37, 99, 235, 0.45)',
          aura: 'rgba(6, 182, 212, 0.25)',
          ringColor: 'border-[#06B6D4]/40',
          animationSpeed: 'duration-500 animate-spin',
        };
      case 'speaking':
        // Green response state
        return {
          core: 'from-[#10B981] via-[#34D399] to-[#6EE7B7]',
          glow: 'rgba(16, 185, 129, 0.45)',
          aura: 'rgba(52, 211, 153, 0.25)',
          ringColor: 'border-[#10B981]/40',
          animationSpeed: 'duration-1000 animate-pulse',
        };
      case 'idle':
      default:
        // Slow rotation + calm warm ink/orange tones
        return {
          core: 'from-[#111418] via-[#2A2E35] to-[#F4611E]',
          glow: 'rgba(244, 97, 30, 0.25)',
          aura: 'rgba(17, 20, 24, 0.15)',
          ringColor: 'border-[var(--border-subtle)]',
          animationSpeed: 'duration-3000',
        };
    }
  };

  const theme = getGradientTheme();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`relative group shrink-0 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 transition-transform hover:scale-105 active:scale-95 motion-reduce:transform-none ${sizeClasses[size]} ${className}`}
    >
      {/* Outer ambient aura glow */}
      <div
        className="absolute inset-0 rounded-full blur-md opacity-80 transition-all duration-500 motion-reduce:animate-none"
        style={{
          backgroundColor: theme.aura,
          boxShadow: `0 0 16px ${theme.glow}`,
        }}
      />

      {/* Orbiting thin ring */}
      <div
        className={`absolute -inset-1 rounded-full border border-dashed transition-all duration-700 motion-reduce:animate-none ${theme.ringColor} ${
          state === 'listening' ? 'animate-spin' : state === 'thinking' ? 'animate-spin' : ''
        }`}
        style={{
          animationDuration: state === 'thinking' ? '2s' : state === 'listening' ? '4s' : '16s',
        }}
      />

      {/* Siri-style multi-sphere fluid orb core */}
      <div
        className={`relative w-full h-full rounded-full overflow-hidden shadow-lg transition-all duration-500 bg-gradient-to-tr ${theme.core}`}
      >
        {/* Inner animated glass reflection layer */}
        <div
          className={`absolute inset-0 opacity-60 mix-blend-overlay bg-gradient-to-b from-white via-transparent to-black transition-transform motion-reduce:animate-none ${
            state === 'thinking'
              ? 'animate-spin'
              : state === 'listening'
                ? 'animate-pulse'
                : 'animate-spin'
          }`}
          style={{
            animationDuration: state === 'thinking' ? '1.5s' : '12s',
          }}
        />

        {/* Center glowing focal highlight */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-tl from-white/30 via-transparent to-transparent pointer-events-none" />

        {/* State icon hint for smaller size */}
        {size === 'sm' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                state === 'listening'
                  ? 'bg-white animate-ping'
                  : state === 'speaking'
                    ? 'bg-white animate-pulse'
                    : 'bg-white/80'
              }`}
            />
          </div>
        )}
      </div>

      {/* Status indicator badge dot (for larger orb) */}
      {size !== 'sm' && (
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white transition-colors ${
            state === 'listening'
              ? 'bg-[#F4611E] animate-ping'
              : state === 'thinking'
                ? 'bg-[#06B6D4] animate-pulse'
                : state === 'speaking'
                  ? 'bg-[#10B981]'
                  : 'bg-emerald-500'
          }`}
        />
      )}
    </button>
  );
};
