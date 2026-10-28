import React from 'react';
import { CheckCircle2, Package, Calculator, Truck, FileCheck } from 'lucide-react';
import { ActiveTransaction } from '../types';

interface DemoFlowBarProps {
  transaction: ActiveTransaction;
  onNavigateToStep: (stepNumber: number) => void;
  onOpenTransactionModal: () => void;
}

export const DemoFlowBar: React.FC<DemoFlowBarProps> = ({
  transaction,
  onNavigateToStep,
  onOpenTransactionModal,
}) => {
  const steps = [
    {
      step: 1,
      title: 'Sell Harvest',
      desc: `${transaction.quantityKg} kg ${transaction.cropName}`,
      icon: Package,
      isCompleted: true,
      isActive: transaction.stage === 'listing',
    },
    {
      step: 2,
      title: 'Compare 3 Offers',
      desc: transaction.selectedOffer ? `${transaction.selectedOffer.buyerName.split(':')[0]} (₹${transaction.selectedOffer.offeredPricePerKg}/kg)` : 'Compare ₹20, ₹22, ₹21/kg',
      icon: Calculator,
      isCompleted: transaction.stage !== 'listing',
      isActive: transaction.stage === 'offer_selected',
    },
    {
      step: 3,
      title: 'Pool Transport',
      desc: 'Tata Ace Pooled Route',
      icon: Truck,
      isCompleted: transaction.stage === 'transport_pooled' || transaction.stage === 'delivery_confirmed',
      isActive: transaction.stage === 'transport_pooled',
    },
    {
      step: 4,
      title: 'Settlement Pass',
      desc: transaction.stage === 'delivery_confirmed' ? 'Receipt Confirmed' : 'Net Escrow Payout',
      icon: FileCheck,
      isCompleted: transaction.stage === 'delivery_confirmed',
      isActive: transaction.stage === 'delivery_confirmed',
    },
  ];

  return (
    <div className="bg-[#172D24] border-b border-[#234735] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D9AA45]"></span>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#D9AA45]">
              Marketplace Pipeline:
            </span>
            <span className="text-xs text-[#DCE4D5]/80 hidden sm:inline font-light">
              Follow the end-to-end journey from farmgate listing to fair net payout
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {steps.map((st) => {
              return (
                <button
                  key={st.step}
                  onClick={() => {
                    if (st.step === 4) {
                      onOpenTransactionModal();
                    } else {
                      onNavigateToStep(st.step);
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-left transition-all cursor-pointer ${
                    st.isActive
                      ? 'bg-[#234735] ring-1 ring-[#D9AA45] text-white'
                      : st.isCompleted
                      ? 'bg-[#234735]/60 hover:bg-[#234735] text-[#DCE4D5]'
                      : 'bg-[#234735]/30 hover:bg-[#234735]/50 text-[#DCE4D5]/70'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold bg-[#172D24]">
                    {st.isCompleted && st.step !== 4 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D9AA45]" />
                    ) : (
                      <span className="text-[10px] text-[#D9AA45]">{st.step}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold leading-none truncate flex items-center gap-1">
                      {st.title}
                    </p>
                    <p className="text-[10px] text-[#DCE4D5]/70 truncate mt-0.5 font-light">
                      {st.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
