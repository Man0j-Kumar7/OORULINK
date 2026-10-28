import React, { useState } from 'react';
import { X, Sprout, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { CropListing, CropCategory } from '../types';
import { ASSET_IMAGES } from '../data/initialData';

interface ListHarvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCrop: (newCrop: CropListing) => void;
  onProceedToOffers: (crop: CropListing) => void;
}

export const ListHarvestModal: React.FC<ListHarvestModalProps> = ({
  isOpen,
  onClose,
  onSubmitCrop,
  onProceedToOffers,
}) => {
  const [farmerName, setFarmerName] = useState('Rameshwar Patel');
  const [village, setVillage] = useState('Sample Village (Rampur)');
  const [cropName, setCropName] = useState('Desi Organic Tomatoes');
  const [category, setCategory] = useState<CropCategory>('vegetables');
  const [quantityKg, setQuantityKg] = useState<number>(100);
  const [askingPricePerKg, setAskingPricePerKg] = useState<number>(20);
  const [expectedHarvestDate, setExpectedHarvestDate] = useState('Tomorrow Morning');
  const [qualityGrade, setQualityGrade] = useState<CropListing['qualityGrade']>('Grade A (Export / Premium)');
  const [description, setDescription] = useState('Vine-ripened organic tomatoes plucked at early break stage for optimal transport shelf-life.');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdCrop, setCreatedCrop] = useState<CropListing | null>(null);

  if (!isOpen) return null;

  const validate = () => {
    const err: Record<string, string> = {};
    if (!farmerName.trim()) err.farmerName = 'Farmer name is required';
    if (!village.trim()) err.village = 'Village / location is required';
    if (!cropName.trim()) err.cropName = 'Crop name is required';
    if (!quantityKg || quantityKg <= 0) err.quantityKg = 'Quantity must be greater than 0 kg';
    if (!askingPricePerKg || askingPricePerKg <= 0) err.askingPricePerKg = 'Asking price must be greater than ₹0';
    if (!expectedHarvestDate.trim()) err.expectedHarvestDate = 'Harvest date is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Determine appropriate image based on crop
    let img = ASSET_IMAGES.tomatoes;
    if (cropName.toLowerCase().includes('wheat') || cropName.toLowerCase().includes('grain') || cropName.toLowerCase().includes('rice')) {
      img = ASSET_IMAGES.wheatGrains;
    } else if (cropName.toLowerCase().includes('onion')) {
      img = ASSET_IMAGES.redOnions;
    } else if (cropName.toLowerCase().includes('potato')) {
      img = ASSET_IMAGES.potatoes;
    } else {
      img = ASSET_IMAGES.heroStillLife;
    }

    const newCrop: CropListing = {
      id: `crop-${Date.now()}`,
      cropName: cropName.trim(),
      category,
      farmerName: farmerName.trim(),
      village: village.trim(),
      quantityKg: Number(quantityKg),
      askingPricePerKg: Number(askingPricePerKg),
      expectedHarvestDate: expectedHarvestDate.trim(),
      qualityGrade,
      description: description.trim() || 'Harvested directly from certified chemical-free local farm plots.',
      imageUrl: img,
      isCustom: true,
    };

    onSubmitCrop(newCrop);
    setCreatedCrop(newCrop);
    setIsSuccess(true);
  };

  const estimatedGross = (Number(quantityKg) || 0) * (Number(askingPricePerKg) || 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF8] rounded-2xl max-w-xl w-full border border-[#254832]/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#254832]/10 bg-[#F7F0E3]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#254832] text-[#F5CD45] flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#254832]/70 block">
                Farmer Interface
              </span>
              <h3 className="text-xl font-bold text-[#193525] font-serif-display">
                List Your Harvest
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#34372F]/60 hover:text-[#193525] hover:bg-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess && createdCrop ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-[#DCE5D5] text-[#254832] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-[#193525] font-serif-display">
                Harvest Successfully Listed!
              </h4>
              <p className="text-xs text-[#34372F]/80 max-w-sm mx-auto">
                <strong>{createdCrop.quantityKg} kg of {createdCrop.cropName}</strong> is now broadcast to the regional buyer network. Three interested buyers have submitted sample quotes.
              </p>
            </div>

            {/* Quick Summary Card */}
            <div className="bg-[#F7F0E3] p-4 rounded-xl border border-[#254832]/10 text-left max-w-md mx-auto text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#34372F]/70">Farmer & Village:</span>
                <span className="font-semibold text-[#193525]">{createdCrop.farmerName} · {createdCrop.village}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#34372F]/70">Asking Price:</span>
                <span className="font-bold text-[#254832] tabular-nums">₹{createdCrop.askingPricePerKg} / kg</span>
              </div>
              <div className="flex justify-between border-t border-[#254832]/10 pt-2">
                <span className="text-[#34372F]/70">Gross Value:</span>
                <span className="font-bold text-[#193525] text-sm tabular-nums">
                  ₹{(createdCrop.quantityKg * createdCrop.askingPricePerKg).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  onProceedToOffers(createdCrop);
                  onClose();
                }}
                className="px-6 py-3 bg-[#F5CD45] text-[#193525] text-xs font-bold rounded-xl hover:bg-[#eab327] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <span>Compare 3 Buyer Offers Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3 bg-[#FFFDF8] border border-[#254832]/20 text-[#254832] text-xs font-semibold rounded-xl hover:bg-[#F7F0E3] transition-colors cursor-pointer"
              >
                Back to Marketplace
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#193525] mb-1">
                  Farmer Name *
                </label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className={`w-full px-3 py-2 text-xs bg-[#F7F0E3]/40 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#254832] text-[#34372F] ${
                    errors.farmerName ? 'border-red-500' : 'border-[#254832]/20'
                  }`}
                  placeholder="e.g. Rameshwar Patel"
                />
                {errors.farmerName && <p className="text-[11px] text-red-600 mt-1">{errors.farmerName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#193525] mb-1">
                  Village / Cluster *
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className={`w-full px-3 py-2 text-xs bg-[#F7F0E3]/40 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#254832] text-[#34372F] ${
                    errors.village ? 'border-red-500' : 'border-[#254832]/20'
                  }`}
                  placeholder="e.g. Sample Village (Rampur)"
                />
                {errors.village && <p className="text-[11px] text-red-600 mt-1">{errors.village}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#193525] mb-1">
                  Crop Name *
                </label>
                <input
                  type="text"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className={`w-full px-3 py-2 text-xs bg-[#F7F0E3]/40 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#254832] text-[#34372F] ${
                    errors.cropName ? 'border-red-500' : 'border-[#254832]/20'
                  }`}
                  placeholder="e.g. Desi Organic Tomatoes"
                />
                {errors.cropName && <p className="text-[11px] text-red-600 mt-1">{errors.cropName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#193525] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-[#F7F0E3]/40 border border-[#254832]/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#254832] text-[#34372F] cursor-pointer"
                >
                  <option value="vegetables">Vegetables</option>
                  <option value="grains">Grains & Cereals</option>
                  <option value="leafy">Leafy Greens</option>
                  <option value="pulses">Pulses & Legumes</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#193525] mb-1">
                  Quantity (kg) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(Number(e.target.value))}
                  className={`w-full px-3 py-2 text-xs bg-[#F7F0E3]/40 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#254832] text-[#34372F] tabular-nums ${
                    errors.quantityKg ? 'border-red-500' : 'border-[#254832]/20'
                  }`}
                  placeholder="100"
                />
                {errors.quantityKg && <p className="text-[11px] text-red-600 mt-1">{errors.quantityKg}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#193525] mb-1">
                  Asking Price (₹/kg) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={askingPricePerKg}
                  onChange={(e) => setAskingPricePerKg(Number(e.target.value))}
                  className={`w-full px-3 py-2 text-xs bg-[#F7F0E3]/40 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#254832] text-[#34372F] tabular-nums ${
                    errors.askingPricePerKg ? 'border-red-500' : 'border-[#254832]/20'
                  }`}
                  placeholder="20"
                />
                {errors.askingPricePerKg && <p className="text-[11px] text-red-600 mt-1">{errors.askingPricePerKg}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#193525] mb-1">
                  Harvest Timing *
                </label>
                <input
                  type="text"
                  value={expectedHarvestDate}
                  onChange={(e) => setExpectedHarvestDate(e.target.value)}
                  className={`w-full px-3 py-2 text-xs bg-[#F7F0E3]/40 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#254832] text-[#34372F] ${
                    errors.expectedHarvestDate ? 'border-red-500' : 'border-[#254832]/20'
                  }`}
                  placeholder="Tomorrow Morning"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#193525] mb-1">
                  Produce Quality / Grade
                </label>
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-[#F7F0E3]/40 border border-[#254832]/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#254832] text-[#34372F] cursor-pointer"
                >
                  <option value="Grade A (Export / Premium)">Grade A (Export / Premium Quality)</option>
                  <option value="Grade B (Standard Market)">Grade B (Standard Mandi Quality)</option>
                  <option value="Grade C (Processing)">Grade C (Processing / Value Addition)</option>
                </select>
              </div>

              {/* Calculated Value Preview */}
              <div className="bg-[#F7F0E3] p-3 rounded-xl border border-[#254832]/10 flex flex-col justify-center">
                <div className="text-[11px] text-[#34372F]/70">Calculated Asking Lot Value</div>
                <div className="text-xl font-bold font-serif-display text-[#193525] tabular-nums">
                  ₹{estimatedGross.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#193525] mb-1">
                Optional Notes & Plucking State
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F7F0E3]/40 border border-[#254832]/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#254832] text-[#34372F]"
                placeholder="Mention variety, plucking stage, packaging bags/crates..."
              />
            </div>

            <div className="pt-2 border-t border-[#254832]/10 flex items-center justify-between">
              <span className="text-[11px] text-[#34372F]/60 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#254832]" />
                Simulated demo submission
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-[#34372F] hover:bg-[#F7F0E3] rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-[#193525] bg-[#F5CD45] rounded-lg hover:bg-[#eab327] transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  Submit Harvest Listing
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
