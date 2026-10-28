import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  PhoneCall,
  MapPin,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  Clock,
} from 'lucide-react';
import { LocalOpportunity, OpportunityApplication } from '../types';
import { INITIAL_OPPORTUNITIES } from '../data/initialData';
import { OpportunityEnquiryModal } from './OpportunityEnquiryModal';

interface LocalOpportunitiesSectionProps {
  onShowToast: (msg: string) => void;
}

export const LocalOpportunitiesSection: React.FC<LocalOpportunitiesSectionProps> = ({
  onShowToast,
}) => {
  const [opportunities] = useState<LocalOpportunity[]>(INITIAL_OPPORTUNITIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOppForEnquiry, setSelectedOppForEnquiry] = useState<LocalOpportunity | null>(null);

  const [applications, setApplications] = useState<OpportunityApplication[]>(() => {
    try {
      const saved = localStorage.getItem('oorulink_opportunity_applications');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const categories = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'Harvest & Packing', label: 'Harvest & Packing Crews' },
    { id: 'Food Producers', label: 'Artisanal Food Milling' },
    { id: 'Rural Artisans', label: 'Crafts & Bamboo Crates' },
    { id: 'Repair & Maintenance', label: 'Mechanics & Solar Repairs' },
  ];

  const filtered = opportunities.filter((opp) => {
    const matchesCat = selectedCategory === 'all' || opp.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleApplicationSubmitted = (app: OpportunityApplication) => {
    const updated = [app, ...applications];
    setApplications(updated);
    try {
      localStorage.setItem('oorulink_opportunity_applications', JSON.stringify(updated));
    } catch {
      // ignore
    }
    onShowToast(`Application submitted to ${app.opportunityTitle}!`);
  };

  return (
    <section id="opportunities" className="py-16 sm:py-24 bg-[#F5F0E7]/60 border-b border-[#234735]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#234735]/80 mb-2">
              <Briefcase className="w-4 h-4 text-[#D9AA45]" />
              <span>Village Micro-Enterprises</span>
            </div>
            <h2 className="text-3xl sm:text-5xl text-[#172D24] font-serif-display tracking-tight">
              Local Skills. Local Opportunities.
            </h2>
            <p className="text-sm sm:text-base text-[#252923]/80 mt-2 max-w-xl font-light">
              Connect with skilled harvest collectives, traditional oil presses, bamboo crate artisans, and agro-mechanics in your village block.
            </p>
          </div>

          {/* Assisted Access Banner */}
          <div className="bg-[#234735] text-white p-4.5 rounded-3xl max-w-md shadow-md flex items-start gap-3">
            <HeartHandshake className="w-5 h-5 text-[#D9AA45] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-[#D9AA45]">Assisted Access Available</span>
              <p className="text-[#DCE4D5]/85 leading-snug font-light">
                Need phone guidance? Village digital facilitators assist elders and non-literate members with zero service charge.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Categories */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#234735] text-white shadow-xs'
                    : 'text-[#252923]/80 hover:text-[#172D24] bg-white border border-[#234735]/10 hover:bg-[#F5F0E7]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative sm:w-72">
            <Search className="w-4 h-4 text-[#252923]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skills, services or crafts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-[#234735]/15 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923]"
            />
          </div>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((opp) => {
            const hasApplied = applications.some((a) => a.opportunityId === opp.id);

            return (
              <div
                key={opp.id}
                className="bg-[#FFFDF8] rounded-3xl border border-[#234735]/12 hover:border-[#234735]/30 p-6 transition-all duration-300 hover:shadow-xl flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-[#234735] uppercase tracking-wider">
                      {opp.category}
                    </span>
                    {hasApplied ? (
                      <span className="text-[10px] font-bold text-[#234735] bg-[#DCE4D5] px-2.5 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#234735]" />
                        Application Sent
                      </span>
                    ) : opp.assistedAccessAvailable ? (
                      <span className="text-[10px] font-semibold text-[#172D24] bg-[#F5F0E7] px-2 py-0.5 rounded-md">
                        Facilitator Supported
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#172D24] font-serif-display group-hover:text-[#234735] transition-colors leading-tight">
                      {opp.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#252923]/70 mt-1.5 font-light">
                      <MapPin className="w-3.5 h-3.5 text-[#234735]" />
                      <span>{opp.providerName} · {opp.location}</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#F5F0E7] rounded-2xl border border-[#234735]/8 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[#252923]/70">Rate / Terms:</span>
                      <span className="font-bold text-[#234735]">{opp.dailyRateOrPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#252923]/70">Field Experience:</span>
                      <span className="font-medium text-[#172D24]">{opp.experience}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#252923]/80 leading-relaxed font-light">
                    {opp.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-[#234735]/10 space-y-3">
                  <div className="text-[11px] text-[#252923]/70 flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-[#234735]" />
                    <span>{opp.contactMasked}</span>
                  </div>

                  <button
                    onClick={() => setSelectedOppForEnquiry(opp)}
                    className="w-full py-3 bg-[#D9AA45] hover:bg-[#c99a37] text-[#172D24] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <span>{hasApplied ? 'Send Follow-Up Message' : 'Connect / Apply Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <OpportunityEnquiryModal
        opportunity={selectedOppForEnquiry}
        onClose={() => setSelectedOppForEnquiry(null)}
        onSubmitApplication={handleApplicationSubmitted}
      />
    </section>
  );
};
