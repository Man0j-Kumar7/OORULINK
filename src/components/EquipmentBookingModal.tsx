import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, Wrench, ShieldCheck, MapPin, AlertCircle } from 'lucide-react';
import { EquipmentListing, EquipmentBooking } from '../types';

interface EquipmentBookingModalProps {
  equipment: EquipmentListing | null;
  onClose: () => void;
  existingBookings: EquipmentBooking[];
  onConfirmBooking: (newBooking: EquipmentBooking) => void;
}

export const EquipmentBookingModal: React.FC<EquipmentBookingModalProps> = ({
  equipment,
  onClose,
  existingBookings,
  onConfirmBooking,
}) => {
  const [farmerName, setFarmerName] = useState('Rameshwar Patel');
  const [village, setVillage] = useState('Rampur Village, Chikkaballapur');
  const [startDate, setStartDate] = useState('2026-11-01');
  const [days, setDays] = useState<number>(2);
  const [needOperator, setNeedOperator] = useState(true);
  const [conflictError, setConflictError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!equipment) return null;

  const baseTotal = equipment.dailyRate * days;
  const operatorFee = needOperator ? 300 * days : 0;
  const total = baseTotal + operatorFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError('');

    // Check for duplicate / conflicting bookings
    const hasConflict = existingBookings.some((b) => {
      if (b.equipmentId !== equipment.id) return false;
      return b.startDate === startDate;
    });

    // Also check preset bookedDates
    const isPresetBooked = equipment.bookedDates && equipment.bookedDates.includes(startDate);

    if (hasConflict || isPresetBooked) {
      setConflictError(
        `This equipment is already reserved on ${startDate}. Please select an alternate start date to avoid double-booking.`
      );
      return;
    }

    const booking: EquipmentBooking = {
      id: `equip-book-${Date.now()}`,
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      farmerName: farmerName.trim(),
      village: village.trim(),
      startDate,
      days,
      totalCost: total,
      withOperator: needOperator,
      status: 'Confirmed',
      createdAt: new Date().toLocaleDateString('en-IN'),
    };

    onConfirmBooking(booking);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF8] rounded-3xl max-w-lg w-full border border-[#234735]/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#234735]/10 bg-[#F5F0E7]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#234735] text-[#D9AA45] flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#234735]/70 block">
                Machinery Sharing Bank
              </span>
              <h3 className="text-xl font-bold text-[#172D24] font-serif-display">
                {equipment.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#252923]/60 hover:text-[#172D24] hover:bg-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-[#234735] text-[#D9AA45] rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-2xl font-bold text-[#172D24] font-serif-display">
                Equipment Booking Confirmed!
              </h4>
              <p className="text-xs text-[#252923]/80 max-w-sm mx-auto font-light">
                Your reservation for <strong>{equipment.name}</strong> ({days} days from {startDate}) has been locked. The owner <strong>{equipment.ownerName}</strong> has been notified for machinery prep.
              </p>
            </div>

            <div className="bg-[#F5F0E7] p-4 rounded-2xl border border-[#234735]/10 text-left text-xs space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-[#252923]/70">Duration:</span>
                <span className="font-semibold text-[#172D24]">{days} Day(s) starting {startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#252923]/70">Operator Included:</span>
                <span className="font-semibold text-[#172D24]">{needOperator ? 'Yes (+₹300/day)' : 'Self-operated'}</span>
              </div>
              <div className="flex justify-between border-t border-[#234735]/10 pt-2 font-bold text-sm">
                <span className="text-[#172D24]">Rental Total:</span>
                <span className="text-[#234735] tabular-nums">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#D9AA45] text-[#172D24] text-xs font-bold rounded-xl hover:bg-[#c99a37] transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {conflictError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{conflictError}</span>
              </div>
            )}

            {/* Spec strip */}
            <div className="p-3.5 bg-[#F5F0E7] rounded-2xl border border-[#234735]/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-[#252923]/60 block text-[11px]">Daily Rental Rate:</span>
                <span className="text-lg font-bold text-[#172D24] tabular-nums">
                  ₹{equipment.dailyRate.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-[#252923]/60"> / day</span>
              </div>
              <div className="text-right">
                <span className="text-[#252923]/60 block text-[11px]">Owner / Location:</span>
                <span className="font-semibold text-[#234735] flex items-center gap-1 justify-end">
                  <MapPin className="w-3 h-3" />
                  {equipment.ownerVillage}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#172D24] mb-1">
                  Farmer Name *
                </label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F5F0E7]/50 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172D24] mb-1">
                  Farm Village *
                </label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F5F0E7]/50 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#172D24] mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F5F0E7]/50 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172D24] mb-1">
                  Duration (Days) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  required
                  value={days}
                  onChange={(e) => setDays(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-xs bg-[#F5F0E7]/50 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923] tabular-nums"
                />
              </div>
            </div>

            {/* Operator Checkbox */}
            <div className="p-3 bg-white rounded-xl border border-[#234735]/15 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-[#172D24] block">Include Trained Local Operator</span>
                <span className="text-[11px] text-[#252923]/70 font-light">Recommended for heavy machinery (+₹300/day)</span>
              </div>
              <input
                type="checkbox"
                checked={needOperator}
                onChange={(e) => setNeedOperator(e.target.checked)}
                className="w-4 h-4 text-[#234735] rounded focus:ring-0 cursor-pointer"
              />
            </div>

            {/* Total Calculation */}
            <div className="bg-[#234735] text-white p-4.5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#DCE4D5]/80 block">Estimated Rental Payout:</span>
                <span className="text-2xl font-bold font-serif-display text-[#D9AA45] tabular-nums">
                  ₹{total.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-[#DCE4D5]/70 block font-light">for {days} day(s) of field use</span>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-[#D9AA45] text-[#172D24] text-xs font-bold rounded-xl hover:bg-[#c99a37] transition-all cursor-pointer shadow-sm active:scale-95"
              >
                Confirm Reservation
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#252923]/60 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#234735]" />
              <span>Inspection on delivery. Escrow settles upon verified machine handover.</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
