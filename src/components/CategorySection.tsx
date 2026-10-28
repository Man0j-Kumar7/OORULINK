import React from 'react';
import { ArrowUpRight, ShoppingBag, Users, Truck, Wrench, Briefcase } from 'lucide-react';
import { ASSET_IMAGES } from '../data/initialData';
import { AppView } from './Header';

interface CategorySectionProps {
  onSelectCategory: (targetView: AppView) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ onSelectCategory }) => {
  const categories: {
    id: AppView;
    title: string;
    tagline: string;
    description: string;
    image: string;
    icon: any;
    cta: string;
  }[] = [
    {
      id: 'produce',
      title: 'Fresh Produce',
      tagline: 'Direct Farm Harvests',
      description: 'Discover field-fresh vegetables, pulses, and heritage grains directly from local village growers.',
      image: ASSET_IMAGES.tomatoes,
      icon: ShoppingBag,
      cta: 'Discover Produce',
    },
    {
      id: 'offers',
      title: 'Buyer Offers',
      tagline: 'Transparent Bidding',
      description: 'Compare wholesale co-ops, aggregators, and organic mandi offers with true net deductions.',
      image: ASSET_IMAGES.wheatGrains,
      icon: Users,
      cta: 'Compare Offers',
    },
    {
      id: 'transport',
      title: 'Shared Transport',
      tagline: 'Pooled Village Freight',
      description: 'Coordinate pickup routes and share vehicle capacity with nearby farmers to slash delivery costs by 60%.',
      image: ASSET_IMAGES.transport,
      icon: Truck,
      cta: 'View Freight Routes',
    },
    {
      id: 'equipment',
      title: 'Farm Equipment',
      tagline: 'Shared Machinery Bank',
      description: 'Rent tractors, power tillers, solar pumps, and precision seeders by the day from local collectives.',
      image: ASSET_IMAGES.tractor,
      icon: Wrench,
      cta: 'Rent Machinery',
    },
    {
      id: 'opportunities',
      title: 'Local Opportunities',
      tagline: 'Skills & Micro-Enterprises',
      description: 'Hire skilled seasonal harvest crews, traditional oil mills, bamboo artisans, and on-farm repair mechanics.',
      image: ASSET_IMAGES.heroFarmer,
      icon: Briefcase,
      cta: 'Explore Local Skills',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FFFDF8] border-b border-[#234735]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#234735]/80 block mb-2">
              Integrated Rural Corridors
            </span>
            <h2 className="text-3xl sm:text-5xl text-[#172D24] font-serif-display tracking-tight">
              Everything a Village Needs to Grow.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#252923]/75 max-w-md font-light">
            OoruLink unifies agricultural commerce, logistics pooling, equipment sharing, and village talent into one transparent ecosystem.
          </p>
        </div>

        {/* 5-Card Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 3).map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="group relative bg-[#F5F0E7]/70 hover:bg-[#F5F0E7] rounded-3xl p-6 border border-[#234735]/12 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between cursor-pointer overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="h-48 w-full rounded-2xl overflow-hidden bg-slate-100 relative">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs p-2 rounded-xl text-[#234735] shadow-xs">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#234735]/75 mb-1">
                      {cat.tagline}
                    </div>
                    <h3 className="text-xl font-bold text-[#172D24] font-serif-display group-hover:text-[#234735] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-[#252923]/80 mt-2 leading-relaxed font-light">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-[#234735]/10 flex items-center justify-between text-xs font-bold text-[#234735] group-hover:text-[#172D24]">
                  <span>{cat.cta}</span>
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-xs group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom 2 wider cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {categories.slice(3).map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="group relative bg-[#F5F0E7]/70 hover:bg-[#F5F0E7] rounded-3xl p-6 border border-[#234735]/12 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col sm:flex-row gap-6 items-center cursor-pointer overflow-hidden"
              >
                <div className="h-44 w-full sm:w-52 shrink-0 rounded-2xl overflow-hidden bg-slate-100 relative">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs p-2 rounded-xl text-[#234735]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between h-full space-y-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#234735]/75 mb-1">
                      {cat.tagline}
                    </div>
                    <h3 className="text-xl font-bold text-[#172D24] font-serif-display group-hover:text-[#234735] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-[#252923]/80 mt-1.5 leading-relaxed font-light">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#234735] group-hover:text-[#172D24]">
                    <span>{cat.cta}</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
