import React, { useState } from 'react';
import { Wrench, CheckCircle2, Calendar, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { EquipmentListing, EquipmentBooking } from '../types';
import { INITIAL_EQUIPMENT } from '../data/initialData';
import { EquipmentBookingModal } from './EquipmentBookingModal';

interface EquipmentSectionProps {
  onShowToast: (message: string) => void;
}

export const EquipmentSection: React.FC<EquipmentSectionProps> = ({ onShowToast }) => {
  const [equipmentList] = useState<EquipmentListing[]>(INITIAL_EQUIPMENT);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItemForBooking, setSelectedItemForBooking] = useState<EquipmentListing | null>(null);

  const [bookings, setBookings] = useState<EquipmentBooking[]>(() => {
    try {
      const saved = localStorage.getItem('oorulink_equipment_bookings');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const categories = [
    { id: 'all', label: 'All Machinery' },
    { id: 'Tractor', label: 'Tractors' },
    { id: 'Tiller', label: 'Power Tillers' },
    { id: 'Pumping', label: 'Solar Pumps' },
    { id: 'Seeding', label: 'Precision Seeders' },
    { id: 'Sprayer', label: 'Battery Sprayers' },
  ];

  const filteredEquipment = selectedCategory === 'all'
    ? equipmentList
    : equipmentList.filter((item) => item.category === selectedCategory);

  const handleConfirmBooking = (newBooking: EquipmentBooking) => {
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    try {
      localStorage.setItem('oorulink_equipment_bookings', JSON.stringify(updated));
    } catch {
      // ignore
    }
    onShowToast(`Equipment booked: ${newBooking.equipmentName} (${newBooking.days} days · ₹${newBooking.totalCost.toLocaleString('en-IN')})`);
  };

  return (
    <section id="equipment" className="py-16 sm:py-24 bg-[#FFFDF8] border-b border-[#234735]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#234735]/80 mb-2">
              <Wrench className="w-4 h-4 text-[#D9AA45]" />
              <span>Capital Machinery Sharing</span>
            </div>
            <h2 className="text-3xl sm:text-5xl text-[#172D24] font-serif-display tracking-tight">
              Farm Equipment Sharing.
            </h2>
            <p className="text-sm sm:text-base text-[#252923]/80 mt-2 max-w-xl font-light">
              Avoid high machinery loans by renting tractors, tillers, solar pumps, and precision seeders on-demand from local village collectives.
            </p>
          </div>

          {bookings.length > 0 && (
            <div className="p-3 bg-[#F5F0E7] rounded-2xl border border-[#234735]/15 text-xs text-[#172D24] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#234735]" />
              <span>You have <strong>{bookings.length}</strong> active machinery reservation(s)</span>
            </div>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#234735] text-white shadow-xs'
                  : 'text-[#252923]/80 hover:text-[#172D24] bg-[#F5F0E7] hover:bg-[#EAE2D2]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Machinery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((item) => {
            const isBookedByUser = bookings.some((b) => b.equipmentId === item.id);

            return (
              <div
                key={item.id}
                className="bg-[#FFFDF8] rounded-3xl border border-[#234735]/12 hover:border-[#234735]/30 overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[#234735] px-2.5 py-1 rounded-md text-[11px] font-bold shadow-xs">
                      {isBookedByUser ? 'Your Booking Active' : item.availability}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-[#234735] font-semibold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.ownerName} · {item.ownerVillage}</span>
                    </div>

                    <h3 className="text-xl font-bold text-[#172D24] font-serif-display group-hover:text-[#234735] transition-colors leading-tight">
                      {item.name}
                    </h3>

                    <div className="p-2.5 bg-[#F5F0E7] rounded-xl border border-[#234735]/8 text-xs font-medium text-[#172D24]">
                      {item.powerSpec}
                    </div>

                    <p className="text-xs text-[#252923]/75 leading-relaxed font-light line-clamp-2">
                      {item.description}
                    </p>

                    <div className="pt-2 flex items-baseline justify-between border-t border-[#234735]/10">
                      <div>
                        <span className="text-2xl font-bold text-[#172D24] font-serif-display tabular-nums">
                          ₹{item.dailyRate.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-[#252923]/70 ml-1">/ day</span>
                      </div>
                      <span className="text-[11px] text-[#234735] font-semibold">
                        Field inspected
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 pt-0">
                  <button
                    onClick={() => setSelectedItemForBooking(item)}
                    className="w-full py-3 text-xs font-bold text-[#172D24] bg-[#D9AA45] hover:bg-[#c99a37] rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>View Calendar & Reserve</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <EquipmentBookingModal
        equipment={selectedItemForBooking}
        existingBookings={bookings}
        onClose={() => setSelectedItemForBooking(null)}
        onConfirmBooking={handleConfirmBooking}
      />
    </section>
  );
};
