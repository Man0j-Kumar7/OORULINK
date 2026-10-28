import React from 'react';
import { Target, Clock, BarChart3, TrendingDown, Scale, MapPin } from 'lucide-react';

export const ImpactPilotSection: React.FC = () => {
  const pilotTargets = [
    { label: 'Participating Farmers', targetValue: '20', tag: 'INITIAL COHORT', desc: 'Rampur village cluster collective' },
    { label: 'Verified Regional Buyers', targetValue: '5', tag: 'DEMAND PARTNERS', desc: 'Urban organic co-ops & wholesale mandi buyers' },
    { label: 'Shared Freight Corridors', targetValue: '3', tag: 'ACTIVE ROUTES', desc: 'Village collection point to taluk and APMC mandi' },
  ];

  const measurementMetrics = [
    {
      title: 'Transport Cost per Kilogram',
      benchmark: 'Baseline: ₹4.50 – ₹6.00/kg (Solo mini-truck)',
      status: 'Awaiting pilot data',
      icon: TrendingDown,
      hypothesis: 'Target: 40%–60% reduction via scheduled route pooling',
    },
    {
      title: 'Time Taken to Find a Buyer',
      benchmark: 'Baseline: 18 – 36 hours at middleman mandi gate',
      status: 'Awaiting pilot data',
      icon: Clock,
      hypothesis: 'Target: Under 4 hours with digital pre-harvest broadcasting',
    },
    {
      title: 'Percentage of Listed Produce Sold',
      benchmark: 'Baseline: Volatile, weather & distress sales dependent',
      status: 'Awaiting pilot data',
      icon: BarChart3,
      hypothesis: 'Target: 85%+ clearance via verified multi-buyer visibility',
    },
    {
      title: 'Produce Loss Before Sale',
      benchmark: 'Baseline: 15% – 25% post-harvest spoilage on farm',
      status: 'Awaiting pilot data',
      icon: Scale,
      hypothesis: 'Target: Sub-5% waste through synchronized morning dispatches',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#F5F0E7] border-b border-[#234735]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#234735] mb-2">
            <Target className="w-4 h-4 text-[#D9AA45]" />
            <span>Operational Measurement Framework</span>
          </div>
          <h2 className="text-3xl sm:text-5xl text-[#172D24] font-serif-display tracking-tight">
            Small Connections. Meaningful Rural Impact.
          </h2>
          <p className="text-sm sm:text-base text-[#252923]/80 mt-2 font-light leading-relaxed">
            Real rural transformation begins with honest metrics. Rather than claiming premature or exaggerated figures, OoruLink measures real rupees saved through transparent market access and pooled freight.
          </p>
        </div>

        {/* 3 Target Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {pilotTargets.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FFFDF8] rounded-3xl p-6 border border-[#234735]/12 shadow-sm space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider text-[#172D24] bg-[#DCE4D5] px-2.5 py-0.5 rounded-md">
                  {item.tag}
                </span>
                <span className="text-xs text-[#252923]/60">Phase 1</span>
              </div>

              <div>
                <div className="text-4xl sm:text-5xl font-bold font-serif-display text-[#172D24] tabular-nums">
                  {item.targetValue}
                </div>
                <h3 className="text-base font-bold text-[#172D24] mt-1">
                  {item.label}
                </h3>
              </div>

              <p className="text-xs text-[#252923]/75 pt-2 border-t border-[#234735]/10 font-light">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 4 Measurement Cards */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#172D24] font-serif-display">
              Field Measurement Indicators
            </h3>
            <span className="text-xs text-[#234735] font-semibold">
              Ground Validation Track
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {measurementMetrics.map((met, i) => {
              const Icon = met.icon;
              return (
                <div
                  key={i}
                  className="bg-[#FFFDF8] rounded-2xl p-5 border border-[#234735]/12 space-y-3 flex flex-col justify-between shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-[#234735]/10 text-[#234735] flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-[#172D24] leading-snug">
                      {met.title}
                    </h4>
                    <p className="text-[11px] text-[#252923]/70 font-light">
                      {met.benchmark}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#234735]/10 space-y-2">
                    <div className="bg-[#F5F0E7] px-2.5 py-1.5 rounded-xl text-center">
                      <span className="text-xs font-bold text-[#234735] tracking-wide">
                        {met.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#252923]/70 italic">
                      {met.hypothesis}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cluster Roadmap */}
        <div className="mt-10 bg-[#234735] text-white p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs text-[#D9AA45] font-semibold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Deployment Corridor: Rampur Village Cluster</span>
            </div>
            <h4 className="text-2xl font-bold font-serif-display">
              Starting with One Village Cluster, Expanding with Discipline.
            </h4>
            <p className="text-xs text-[#DCE4D5]/90 leading-relaxed font-light">
              We validate high-density shared morning transport and transparent direct bidding with 20 certified local growers before opening adjacent corridors.
            </p>
          </div>

          <div className="bg-[#172D24] p-4.5 rounded-2xl border border-white/10 shrink-0 text-center sm:text-left">
            <span className="text-xs text-[#DCE4D5]/80 block">Operational Model</span>
            <span className="text-sm font-bold text-[#D9AA45] block mt-0.5">Direct Farmgate Corridor</span>
            <span className="text-[11px] text-[#DCE4D5]/60 block mt-1">Verified Logistics & Escrow</span>
          </div>
        </div>
      </div>
    </section>
  );
};
