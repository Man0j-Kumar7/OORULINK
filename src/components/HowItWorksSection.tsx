import React from 'react';
import { Sprout, Users, Truck, CheckCircle2 } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'LIST',
      summary: 'Farmers share crop availability',
      desc: 'Publish lot quantity, variety, expected harvest window, and asking price directly from your field.',
      icon: Sprout,
    },
    {
      num: '02',
      title: 'CONNECT',
      summary: 'Buyers compare listings and submit offers',
      desc: 'Multiple verified regional buyers submit offers. Compare transparent net yield after freight deductions.',
      icon: Users,
    },
    {
      num: '03',
      title: 'COORDINATE',
      summary: 'Farmers organize shared deliveries',
      desc: 'Neighboring village growers pool space in one delivery vehicle to save up to 60% on transport.',
      icon: Truck,
    },
    {
      num: '04',
      title: 'COMPLETE',
      summary: 'The transaction status is updated',
      desc: 'Produce is weighed at receiving bay and escrow funds are credited instantly via direct bank UPI.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FFFDF8] border-b border-[#234735]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#234735]/80 block mb-2">
            The OoruLink Operating Model
          </span>
          <h2 className="text-3xl sm:text-5xl text-[#172D24] font-serif-display tracking-tight">
            How OoruLink Works.
          </h2>
          <p className="text-xs sm:text-sm text-[#252923]/75 mt-2 font-light">
            Four coordinated steps transforming fragmented smallholder farming into an organized, high-yield rural economy.
          </p>
        </div>

        {/* Desktop Horizontal 4-Step Grid with connecting track */}
        <div className="relative">
          <div className="hidden lg:block absolute top-1/4 left-16 right-16 h-0.5 bg-[#234735]/15 -z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.num}
                  className="bg-[#F5F0E7]/70 hover:bg-[#F5F0E7] p-6 rounded-3xl border border-[#234735]/12 transition-all duration-300 hover:shadow-lg flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold font-serif-display text-[#234735]/30 group-hover:text-[#234735] transition-colors">
                        {st.num}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-[#234735] text-[#D9AA45] flex items-center justify-center shadow-xs">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#234735] mb-1">
                        {st.title}
                      </h3>
                      <h4 className="text-base font-bold text-[#172D24] font-serif-display leading-snug">
                        {st.summary}
                      </h4>
                    </div>

                    <p className="text-xs text-[#252923]/80 leading-relaxed font-light">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
