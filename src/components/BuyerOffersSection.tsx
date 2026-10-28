import React, { useState } from 'react';
import {
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  Building2,
  Store,
  Factory,
  Info,
  Sparkles,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { BuyerOffer, CropListing } from '../types';
import { SAMPLE_BUYER_OFFERS } from '../data/initialData';

interface BuyerOffersSectionProps {
  currentCrop: CropListing;
  selectedOffer: BuyerOffer | null;
  onSelectOffer: (offer: BuyerOffer) => void;
  onProceedToTransport: () => void;
  onRejectOffer?: (offerId: string) => void;
}

export const BuyerOffersSection: React.FC<BuyerOffersSectionProps> = ({
  currentCrop,
  selectedOffer,
  onSelectOffer,
  onProceedToTransport,
  onRejectOffer,
}) => {
  const [lotQuantity, setLotQuantity] = useState<number>(currentCrop.quantityKg || 100);
  const [offersList, setOffersList] = useState<BuyerOffer[]>(SAMPLE_BUYER_OFFERS);
  const [rejectedOfferIds, setRejectedOfferIds] = useState<string[]>([]);

  React.useEffect(() => {
    if (currentCrop.quantityKg) {
      setLotQuantity(currentCrop.quantityKg);
    }
  }, [currentCrop.quantityKg]);

  const handleAccept = (offer: BuyerOffer) => {
    onSelectOffer(offer);
  };

  const handleReject = (offerId: string) => {
    setRejectedOfferIds((prev) => [...prev, offerId]);
    if (onRejectOffer) {
      onRejectOffer(offerId);
    }
  };

  const getBuyerIcon = (type: BuyerOffer['buyerType']) => {
    switch (type) {
      case 'Urban Organic Co-op':
        return Store;
      case 'Wholesale Mandi Buyer':
        return Building2;
      case 'Food Processing Aggregator':
        return Factory;
      default:
        return Building2;
    }
  };

  return (
    <section id="buyer-offers" className="py-16 sm:py-24 bg-[#FFFDF8] border-b border-[#234735]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#234735]/80 mb-2">
              <span>Wholesale Offer Comparison</span>
              <span className="text-[#234735]/40">·</span>
              <span>Transparent Net Farmer Yield</span>
            </div>
            <h2 className="text-3xl sm:text-5xl text-[#172D24] font-serif-display tracking-tight">
              Buyer Offers.
            </h2>
            <p className="text-sm sm:text-base text-[#252923]/80 mt-2 max-w-2xl font-light">
              Compare wholesale offers side-by-side. Calculate true net earnings after transport deductions to keep more profit in your pocket.
            </p>
          </div>

          {/* Active Crop Context Card */}
          <div className="bg-[#F5F0E7] p-4.5 rounded-2xl border border-[#234735]/15 flex flex-col sm:flex-row sm:items-center gap-4 shrink-0 shadow-xs">
            <div>
              <div className="text-[11px] font-semibold text-[#234735] uppercase tracking-wider">
                Active Crop Listing
              </div>
              <div className="text-sm font-bold text-[#172D24] flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#234735]" />
                <span>{currentCrop.cropName}</span>
                <span className="text-[#252923]/60 font-normal">({currentCrop.village})</span>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-[#234735]/15 pt-2 sm:pt-0 sm:pl-4">
              <label htmlFor="lot-qty" className="text-xs text-[#252923]/70 whitespace-nowrap">
                Lot Volume:
              </label>
              <input
                id="lot-qty"
                type="number"
                min="10"
                step="10"
                value={lotQuantity}
                onChange={(e) => setLotQuantity(Math.max(1, Number(e.target.value)))}
                className="w-20 px-2.5 py-1.5 text-xs font-bold bg-white border border-[#234735]/20 rounded-lg text-[#172D24] focus:outline-none focus:ring-1 focus:ring-[#234735] tabular-nums"
              />
              <span className="text-xs font-semibold text-[#172D24]">{currentCrop.unit || 'kg'}</span>
            </div>
          </div>
        </div>

        {/* Real Economic Math Banner */}
        <div className="mb-8 p-4.5 rounded-2xl bg-[#F5F0E7] border border-[#234735]/15 flex items-start gap-3">
          <Info className="w-4 h-4 text-[#234735] shrink-0 mt-0.5" />
          <div className="text-xs text-[#252923] space-y-1">
            <span className="font-bold text-[#172D24]">Understanding Net Farmer Earnings:</span>
            <p className="text-[#252923]/80 leading-relaxed font-light">
              Notice that <strong>Buyer B offers ₹22/kg gross</strong>, but demands delivery to Central City APMC with a ₹3.20/kg transport cost, yielding <strong>₹18.80/kg net (₹{Math.round(lotQuantity * 18.80).toLocaleString('en-IN')})</strong>. 
              Meanwhile, <strong>Buyer C offers ₹21/kg gross</strong> with a lower ₹2.00/kg transit cost to the rural hub, yielding <strong>₹19.00/kg net (₹{Math.round(lotQuantity * 19.00).toLocaleString('en-IN')})</strong> — a higher take-home amount!
            </p>
          </div>
        </div>

        {/* 3 Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {offersList.map((offer) => {
            const isRejected = rejectedOfferIds.includes(offer.id);
            const isSelected = selectedOffer?.id === offer.id;
            const grossValue = lotQuantity * offer.offeredPricePerKg;
            const transportDeduction = lotQuantity * offer.transportDeductionPerKg;
            const netAmount = grossValue - transportDeduction;
            const netPerKg = offer.offeredPricePerKg - offer.transportDeductionPerKg;
            const Icon = getBuyerIcon(offer.buyerType);
            const isBestNet = offer.id === 'offer-buyer-c';

            if (isRejected) {
              return (
                <div
                  key={offer.id}
                  className="rounded-2xl p-6 border border-dashed border-[#234735]/20 bg-[#F5F0E7]/40 flex flex-col justify-between opacity-60 text-center space-y-4"
                >
                  <div className="py-8 space-y-2">
                    <span className="text-xs text-[#252923]/60 line-through block">
                      {offer.buyerName}
                    </span>
                    <span className="text-xs font-semibold text-red-700 block">Offer Declined</span>
                  </div>
                  <button
                    onClick={() => setRejectedOfferIds((prev) => prev.filter((id) => id !== offer.id))}
                    className="text-xs text-[#234735] underline cursor-pointer"
                  >
                    Undo decline
                  </button>
                </div>
              );
            }

            return (
              <div
                key={offer.id}
                className={`relative rounded-3xl p-6 transition-all duration-300 border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#F5F0E7] border-[#234735] ring-2 ring-[#234735] shadow-xl -translate-y-1'
                    : 'bg-[#FFFDF8] border-[#234735]/15 hover:border-[#234735]/35 hover:shadow-lg'
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-[#234735] font-semibold">
                    <Icon className="w-4 h-4" />
                    <span>{offer.buyerType}</span>
                  </div>

                  {isBestNet && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#172D24] bg-[#D9AA45] px-2 py-0.5 rounded-md shadow-xs">
                      <Sparkles className="w-3 h-3" />
                      Highest Net Yield
                    </span>
                  )}
                </div>

                {/* Offer Title & Pricing */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#172D24] font-serif-display">
                      {offer.buyerName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[#252923]/70 mt-1">
                      <span>Rating {offer.rating} ★</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-[#234735]">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Buyer
                      </span>
                    </div>
                  </div>

                  {/* Calculated Payout Container */}
                  <div className="bg-white p-4.5 rounded-2xl border border-[#234735]/10 space-y-2.5 text-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[#252923]/70">Offered Price:</span>
                      <span className="text-lg font-bold text-[#172D24] tabular-nums">
                        ₹{offer.offeredPricePerKg.toFixed(2)} <span className="text-[11px] font-normal text-[#252923]/60">/ kg</span>
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline">
                      <span className="text-[#252923]/70">Gross Value ({lotQuantity} kg):</span>
                      <span className="font-semibold text-[#172D24] tabular-nums">
                        ₹{grossValue.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline text-[#C85B45]">
                      <span>Est. Transport Deduction:</span>
                      <span className="font-semibold tabular-nums">
                        - ₹{transportDeduction.toLocaleString('en-IN')} (₹{offer.transportDeductionPerKg.toFixed(2)}/kg)
                      </span>
                    </div>

                    {/* Net Payout */}
                    <div className="pt-2.5 border-t border-[#234735]/15 flex justify-between items-baseline">
                      <span className="font-bold text-[#172D24]">Estimated Net Payout:</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold font-serif-display text-[#234735] tabular-nums">
                          ₹{netAmount.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-[#234735] font-semibold tabular-nums">
                          ₹{netPerKg.toFixed(2)} / kg net take-home
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="space-y-2 text-xs text-[#252923]/80">
                    <div className="p-2.5 rounded-xl bg-[#F5F0E7]/60 border border-[#234735]/8">
                      <span className="font-semibold text-[#172D24] block mb-0.5">Delivery Requirement:</span>
                      <span className="text-[11px] leading-relaxed block">{offer.deliveryRequirement}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F5F0E7]/60 border border-[#234735]/8">
                      <span className="font-semibold text-[#172D24] block mb-0.5">Payment Terms:</span>
                      <span className="text-[11px] leading-relaxed block">{offer.paymentTerms}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-5 mt-5 border-t border-[#234735]/10 grid grid-cols-4 gap-2">
                  <button
                    onClick={() => handleReject(offer.id)}
                    className="col-span-1 py-2.5 text-xs font-semibold text-[#C85B45] hover:bg-red-50 border border-red-200 rounded-xl transition-colors cursor-pointer flex items-center justify-center"
                    title="Decline this offer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleAccept(offer)}
                    className={`col-span-3 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
                      isSelected
                        ? 'bg-[#234735] text-white'
                        : 'bg-[#D9AA45] hover:bg-[#c99a37] text-[#172D24]'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4 text-[#D9AA45]" />
                        <span>Accepted Offer</span>
                      </>
                    ) : (
                      <span>Accept & Confirm</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Offer Sticky Action Box */}
        {selectedOffer && (
          <div className="p-6 rounded-3xl bg-[#234735] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl animate-in fade-in duration-300">
            <div className="space-y-1">
              <div className="text-xs text-[#D9AA45] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmed Selection: {selectedOffer.buyerName}</span>
              </div>
              <h4 className="text-2xl font-bold font-serif-display">
                Estimated Net Take-Home: ₹{(lotQuantity * (selectedOffer.offeredPricePerKg - selectedOffer.transportDeductionPerKg)).toLocaleString('en-IN')}
              </h4>
              <p className="text-xs text-[#DCE4D5]/80 font-light">
                Coordinate pickup with neighboring farmers on this shared route to lock in your transport rate.
              </p>
            </div>

            <button
              onClick={onProceedToTransport}
              className="px-7 py-3.5 bg-[#D9AA45] text-[#172D24] font-bold text-xs rounded-xl hover:bg-[#c99a37] transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
            >
              <span>Coordinate Shared Transport</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
