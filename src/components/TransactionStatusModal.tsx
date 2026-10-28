import React from 'react';
import { X, CheckCircle2, MapPin, Truck, Calendar, ShieldCheck, Printer } from 'lucide-react';
import { ActiveTransaction } from '../types';

interface TransactionStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: ActiveTransaction;
}

export const TransactionStatusModal: React.FC<TransactionStatusModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  if (!isOpen) return null;

  const offer = transaction.selectedOffer;
  const quantity = transaction.quantityKg || 100;
  const offeredPrice = offer?.offeredPricePerKg || 21;
  const transportDeductionPerKg = offer?.transportDeductionPerKg || 2.0;

  const grossVal = quantity * offeredPrice;
  const transportCost = quantity * transportDeductionPerKg;
  const netTakeHome = grossVal - transportCost;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF8] rounded-3xl max-w-2xl w-full border border-[#234735]/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#234735]/10 bg-[#234735] text-white">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D9AA45] block">
              Digital Settlement Pass
            </span>
            <h3 className="text-xl font-bold font-serif-display">
              Transaction #{transaction.id}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Status Badge Strip */}
          <div className="bg-[#F5F0E7] p-4.5 rounded-2xl border border-[#234735]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#234735] text-[#D9AA45] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#234735]/70 block">
                  Current Status
                </span>
                <span className="text-sm font-bold text-[#172D24]">
                  {transaction.stage === 'delivery_confirmed' || transaction.stage === 'transport_pooled'
                    ? 'Shared Delivery Confirmed · Escrow Funded'
                    : 'Offer Selected · Awaiting Route Dispatch'}
                </span>
              </div>
            </div>

            <div className="text-right sm:border-l border-[#234735]/15 sm:pl-4">
              <span className="text-[11px] text-[#252923]/60 block font-light">Scheduled Pickup</span>
              <span className="text-xs font-bold text-[#172D24]">
                Tomorrow, 06:30 AM
              </span>
            </div>
          </div>

          {/* Stepper Journey */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#234735]">
              Audit Trail & Verification Corridor
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#234735]/12">
                <span className="text-[#234735] font-bold block mb-0.5">1. Harvest Listed</span>
                <span className="text-[#252923]/80 block font-medium truncate">{quantity} kg {transaction.cropName}</span>
                <span className="text-[10px] text-[#252923]/60 font-light truncate">{transaction.village}</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#234735]/12">
                <span className="text-[#234735] font-bold block mb-0.5">2. Offer Accepted</span>
                <span className="text-[#252923]/80 block font-medium truncate">{offer?.buyerName.split(':')[0] || 'Buyer C'}</span>
                <span className="text-[10px] text-[#252923]/60 font-light">₹{offeredPrice}/kg gross</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#234735]/12">
                <span className="text-[#234735] font-bold block mb-0.5">3. Freight Pooled</span>
                <span className="text-[#252923]/80 block font-medium truncate">Tata Ace 'Chhota Hathi'</span>
                <span className="text-[10px] text-[#252923]/60 font-light">₹{transportDeductionPerKg.toFixed(2)}/kg shared</span>
              </div>

              <div className="p-3 bg-[#234735]/5 rounded-xl border border-[#234735]/25">
                <span className="text-[#234735] font-bold block mb-0.5">4. Net Payout</span>
                <span className="text-[#172D24] text-sm font-bold block tabular-nums">
                  ₹{netTakeHome.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-[#234735] font-semibold">Direct UPI Release</span>
              </div>
            </div>
          </div>

          {/* Itemized Payout Breakdown */}
          <div className="bg-[#FFFDF8] rounded-2xl border border-[#234735]/15 overflow-hidden">
            <div className="bg-[#F5F0E7] px-4 py-2.5 text-xs font-bold text-[#172D24] border-b border-[#234735]/10 flex justify-between items-center">
              <span>Financial Payout Breakdown</span>
              <span className="text-[11px] font-normal text-[#252923]/70">Zero middleman cuts</span>
            </div>

            <div className="p-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#252923]">
                <span>Gross Produce Value ({quantity} kg × ₹{offeredPrice}):</span>
                <span className="font-semibold tabular-nums">₹{grossVal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#C85B45]">
                <span>Shared Transport Deduction ({quantity} kg × ₹{transportDeductionPerKg.toFixed(2)}):</span>
                <span className="font-semibold tabular-nums">- ₹{transportCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#252923]/70">
                <span>Platform Commission:</span>
                <span className="font-semibold text-[#234735]">₹0.00 (Community Free Access)</span>
              </div>
              <div className="pt-2 border-t border-[#234735]/10 flex justify-between items-baseline text-sm font-bold">
                <span className="text-[#172D24]">Farmer Direct Net Receipt:</span>
                <span className="text-xl font-bold font-serif-display text-[#234735] tabular-nums">
                  ₹{netTakeHome.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Guarantee */}
          <div className="p-3.5 bg-[#F5F0E7] rounded-xl border border-[#234735]/10 flex items-start gap-2.5 text-xs text-[#252923]/80">
            <ShieldCheck className="w-4 h-4 text-[#234735] shrink-0 mt-0.5" />
            <span className="font-light">
              <strong>Escrow Guarantee:</strong> Payment is held in secure banking escrow upon vehicle departure and released instantly to the grower upon weighing at the collection hub.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#234735]/10 bg-white flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="text-xs font-semibold text-[#234735] hover:text-[#172D24] flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-[#172D24] bg-[#D9AA45] rounded-xl hover:bg-[#c99a37] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
