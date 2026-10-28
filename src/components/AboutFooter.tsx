import React from 'react';
import { Sprout, RotateCcw, ShieldCheck, Heart, MapPin, ArrowUpRight } from 'lucide-react';
import { AppView } from './Header';

interface AboutFooterProps {
  onNavigate: (view: AppView) => void;
  onResetData: () => void;
}

export const AboutFooter: React.FC<AboutFooterProps> = ({
  onNavigate,
  onResetData,
}) => {
  return (
    <footer id="about" className="bg-[#172D24] text-[#F5F0E7] pt-16 pb-12 border-t border-[#234735]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Brand & Vision Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16 border-b border-white/10">
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#234735] flex items-center justify-center text-[#D9AA45]">
                <Sprout className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-2xl font-bold font-serif-display text-white tracking-tight">
                OoruLink
              </span>
            </div>

            <p className="text-2xl sm:text-3xl font-normal font-serif-display text-white text-balance leading-snug">
              “Better Connections. Stronger Villages. Brighter Futures.”
            </p>

            <p className="text-xs text-[#DCE4D5]/80 leading-relaxed max-w-lg font-light">
              OoruLink is a decentralized rural marketplace uniting farmgate harvests, wholesale buyer bidding, shared logistics pooling, farm machinery banks, and village micro-enterprises into one transparent digital corridor.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
            <div className="space-y-3">
              <span className="font-bold text-[#D9AA45] uppercase tracking-wider block">
                Produce & Trade
              </span>
              <ul className="space-y-2 text-[#DCE4D5]/80 font-light">
                <li>
                  <button onClick={() => onNavigate('produce')} className="hover:text-white transition-colors cursor-pointer">
                    Discover Produce
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('sell')} className="hover:text-white transition-colors cursor-pointer">
                    Sell Your Harvest
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('offers')} className="hover:text-white transition-colors cursor-pointer">
                    Buyer Offer Engine
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('cart')} className="hover:text-white transition-colors cursor-pointer">
                    Cart & Order Summary
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="font-bold text-[#D9AA45] uppercase tracking-wider block">
                Rural Logistics & Tools
              </span>
              <ul className="space-y-2 text-[#DCE4D5]/80 font-light">
                <li>
                  <button onClick={() => onNavigate('transport')} className="hover:text-white transition-colors cursor-pointer">
                    Shared Transport
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('equipment')} className="hover:text-white transition-colors cursor-pointer">
                    Machinery Rental Bank
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('opportunities')} className="hover:text-white transition-colors cursor-pointer">
                    Local Skills & Services
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('orders')} className="hover:text-white transition-colors cursor-pointer">
                    Order Tracking
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3 col-span-2 sm:col-span-1">
              <span className="font-bold text-[#D9AA45] uppercase tracking-wider block">
                Sample Data Management
              </span>
              <p className="text-[11px] text-[#DCE4D5]/70 leading-relaxed font-light">
                Restore sample data state across listings, bookings, and bids.
              </p>
              <button
                onClick={onResetData}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#234735] text-xs font-semibold text-[#D9AA45] hover:bg-[#234735]/80 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Sample Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#DCE4D5]/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D9AA45] shrink-0" />
            <span>
              <strong>Marketplace Transparency Notice:</strong> All initial product records, offers, and route estimates are illustrative demonstration records. Real transactions settle directly between verified buyers and local farm collectives.
            </span>
          </div>

          <div className="text-[11px]">
            OoruLink Agricultural Marketplace © 2026 · All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
};
