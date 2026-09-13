import React from 'react';
import { HeroBackgroundReveal } from './HeroBackgroundReveal';
import { HeroProductStage } from './HeroProductStage';

export { HeroBackgroundReveal, HeroProductStage };

/**
 * Backward compatibility wrapper if imported directly.
 */
export const HeroProductReveal: React.FC = () => {
  return (
    <>
      <HeroBackgroundReveal />
      <HeroProductStage />
    </>
  );
};

export default HeroProductReveal;
