import React, { useState, useEffect } from 'react';
import { ArrowRight, PlusCircle, CheckCircle2, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { ASSET_IMAGES } from '../data/initialData';

interface HeroSectionProps {
  onExplore: () => void;
  onSellHarvest: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExplore,
  onSellHarvest,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((clientY - rect.top) / rect.height - 0.5) * 16;
    setMousePos({ x, y });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative bg-[#F5F0E7] overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#234735]/10"
    >
      {/* Editorial Watermark Glow (restrained organic ambient) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D9AA45]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#234735]/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Editorial Prose */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Editorial Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#234735]">
              <span className="w-2 h-2 rounded-full bg-[#234735]"></span>
              <span>Direct Agricultural Marketplace & Logistics</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-[4.25rem] font-normal text-[#172D24] font-serif-display leading-[1.08] tracking-tight text-balance">
              From Farm to <span className="italic font-serif">Fair Market</span>.
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-[#252923]/90 leading-relaxed max-w-xl font-light">
              Fresh harvests. Better connections. Stronger rural communities.
            </p>

            {/* Primary & Secondary Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={onExplore}
                className="px-8 py-4 text-sm font-bold text-[#172D24] bg-[#D9AA45] rounded-xl hover:bg-[#c99a37] transition-all shadow-md shadow-[#D9AA45]/20 flex items-center justify-center gap-2 cursor-pointer group active:scale-[0.98]"
              >
                <span>Explore Produce</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onSellHarvest}
                className="px-7 py-4 text-sm font-semibold text-[#234735] bg-white border border-[#234735]/20 rounded-xl hover:bg-[#FFFDF8] hover:border-[#234735]/40 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <PlusCircle className="w-4 h-4 text-[#234735]" />
                <span>Sell Your Harvest</span>
              </button>
            </div>

            {/* Understated Trust Indicators */}
            <div className="pt-6 sm:pt-8 border-t border-[#234735]/12">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#234735] shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-[#252923]/85 leading-snug">
                    Direct farmgate connection
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#234735] shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-[#252923]/85 leading-snug">
                    Pooled shared freight
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#234735] shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-[#252923]/85 leading-snug">
                    Transparent net earnings
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Art-Directed Still-Life Vegetable Composition */}
          <div className="lg:col-span-5 relative">
            <div
              style={{
                transform: `perspective(1000px) rotateY(${mousePos.x * 0.4}deg) rotateX(${-mousePos.y * 0.4}deg)`,
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#234735]/20 border border-[#234735]/12 bg-[#FFFDF8]"
            >
              <div className="aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] w-full overflow-hidden relative">
                <img
                  src={ASSET_IMAGES.heroStillLife}
                  alt="Art directed fresh organic vegetables still life with vine tomatoes, carrots, radishes, eggplant, and cucumbers"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                {/* Subtle scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#172D24]/80 via-transparent to-transparent pointer-events-none" />

                {/* Overlaid Editorial Provenance Card */}
                <div className="absolute bottom-4 left-4 right-4 text-white p-4 rounded-2xl bg-[#172D24]/85 backdrop-blur-md border border-white/15">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="flex items-center gap-1.5 font-medium text-[#D9AA45]">
                      <MapPin className="w-3.5 h-3.5" />
                      Village Harvest Collection
                    </span>
                    <span className="text-[11px] text-white/70">Single-Origin Produce</span>
                  </div>
                  <p className="text-xs text-white/95 leading-relaxed font-light">
                    Directly sourced from regional village growers, graded at dawn, and coordinated with shared delivery.
                  </p>
                </div>
              </div>
            </div>

            {/* Restrained Accent Tag */}
            <div
              style={{
                transform: `translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px)`,
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-2 bg-[#FFFDF8] px-4 py-2.5 rounded-xl border border-[#234735]/15 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-[#D9AA45]" />
              <span className="text-xs font-semibold text-[#172D24]">100% Traceable Farmgate Lots</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
