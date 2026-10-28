import React from 'react';
import { X, MapPin, Calendar, CheckCircle2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { CropListing } from '../types';

interface ProduceDetailModalProps {
  crop: CropListing | null;
  onClose: () => void;
  onAddToCart: (crop: CropListing, quantityKg: number) => void;
  onCompareOffers: (crop: CropListing) => void;
}

export const ProduceDetailModal: React.FC<ProduceDetailModalProps> = ({
  crop,
  onClose,
  onAddToCart,
  onCompareOffers,
}) => {
  const [orderQty, setOrderQty] = React.useState<number>(10);

  React.useEffect(() => {
    if (crop) {
      setOrderQty(Math.min(10, crop.quantityKg));
    }
  }, [crop]);

  if (!crop) return null;

  const totalCost = orderQty * crop.askingPricePerKg;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF8] rounded-3xl max-w-2xl w-full border border-[#234735]/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#234735]/10 bg-[#F5F0E7]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#234735]/70 block">
              Produce Specification & Provenance
            </span>
            <h3 className="text-2xl font-bold text-[#172D24] font-serif-display">
              {crop.cropName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#252923]/60 hover:text-[#172D24] hover:bg-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            {/* Image */}
            <div className="sm:col-span-5 h-56 rounded-2xl overflow-hidden bg-slate-100 border border-[#234735]/10 shadow-xs">
              <img
                src={crop.imageUrl}
                alt={crop.cropName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="sm:col-span-7 space-y-3.5">
              <div className="flex items-center gap-1.5 text-xs text-[#234735] font-semibold">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{crop.farmerName} · {crop.farmName ? `${crop.farmName}, ` : ''}{crop.village}</span>
              </div>

              <div>
                <span className="text-3xl font-bold text-[#172D24] font-serif-display tabular-nums">
                  ₹{crop.askingPricePerKg}
                </span>
                <span className="text-xs text-[#252923]/70 font-normal ml-1">/ {crop.unit || 'kg'}</span>
              </div>

              <p className="text-xs text-[#252923]/80 leading-relaxed font-light">
                {crop.description}
              </p>

              {/* Metadata pill-free strip */}
              <div className="bg-[#F5F0E7] p-3.5 rounded-xl border border-[#234735]/10 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#252923]/70">Quality Grade:</span>
                  <span className="font-semibold text-[#172D24]">{crop.qualityGrade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#252923]/70">Harvest Window:</span>
                  <span className="font-semibold text-[#234735] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {crop.expectedHarvestDate}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#234735]/10 pt-2">
                  <span className="text-[#252923]/70">Available Lot Volume:</span>
                  <span className="font-bold text-[#234735] text-sm tabular-nums">
                    {crop.quantityKg} {crop.unit || 'kg'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Order / Purchase Request Box */}
          <div className="p-4 rounded-2xl bg-[#234735] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div>
              <div className="text-xs text-[#DCE4D5]/80">Select Quantity to Order</div>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  min="1"
                  max={crop.quantityKg}
                  value={orderQty}
                  onChange={(e) => setOrderQty(Math.max(1, Math.min(crop.quantityKg, Number(e.target.value))))}
                  className="w-20 px-2.5 py-1.5 text-xs font-bold bg-[#172D24] text-white border border-white/20 rounded-lg focus:outline-none tabular-nums"
                />
                <span className="text-xs text-[#DCE4D5]">kg</span>
                <span className="text-xs text-[#DCE4D5]/60">·</span>
                <span className="text-lg font-bold font-serif-display text-[#D9AA45] tabular-nums">
                  ₹{totalCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  onAddToCart(crop, orderQty);
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-3 bg-[#D9AA45] text-[#172D24] text-xs font-bold rounded-xl hover:bg-[#c99a37] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Order</span>
              </button>
            </div>
          </div>

          {/* Farmer compare bids shortcut */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[#252923]/70 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#234735]" />
              Verified grower listing with single-origin traceability
            </span>

            <button
              onClick={() => {
                onCompareOffers(crop);
                onClose();
              }}
              className="text-[#234735] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Wholesale Buyer Offers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
