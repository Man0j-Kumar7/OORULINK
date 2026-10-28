import React, { useState } from 'react';
import { Sprout, CheckCircle2, ArrowRight, Upload, Sparkles, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { CropListing, CropCategory } from '../types';
import { ASSET_IMAGES } from '../data/initialData';

interface SellHarvestViewProps {
  onListingCreated: (newCrop: CropListing) => void;
  onNavigateToProduce: () => void;
  onNavigateToOffers: (crop: CropListing) => void;
}

export const SellHarvestView: React.FC<SellHarvestViewProps> = ({
  onListingCreated,
  onNavigateToProduce,
  onNavigateToOffers,
}) => {
  const [farmerName, setFarmerName] = useState('Rameshwar Patel');
  const [farmName, setFarmName] = useState('Patel Natural Farms');
  const [village, setVillage] = useState('Rampur Village, Chikkaballapur');
  const [cropName, setCropName] = useState('Desi Organic Tomatoes');
  const [category, setCategory] = useState<CropCategory>('vegetables');
  const [quantity, setQuantity] = useState<number>(100);
  const [unit, setUnit] = useState('kg');
  const [askingPrice, setAskingPrice] = useState<number>(20);
  const [harvestDate, setHarvestDate] = useState('Tomorrow Morning');
  const [qualityGrade, setQualityGrade] = useState<CropListing['qualityGrade']>('Grade A (Export / Premium)');
  const [description, setDescription] = useState('Fresh vine-ripened organic tomatoes plucked at sunrise. High pulp density and uniform grading.');
  const [selectedImagePreset, setSelectedImagePreset] = useState<string>(ASSET_IMAGES.tomatoes);
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedCrop, setSubmittedCrop] = useState<CropListing | null>(null);

  const imagePresets = [
    { label: 'Tomatoes', url: ASSET_IMAGES.tomatoes },
    { label: 'Red Onions', url: ASSET_IMAGES.redOnions },
    { label: 'Carrots', url: ASSET_IMAGES.carrots },
    { label: 'Green Chillies', url: ASSET_IMAGES.chillies },
    { label: 'Potatoes', url: ASSET_IMAGES.potatoes },
    { label: 'Mangoes', url: ASSET_IMAGES.mangoes },
    { label: 'Turmeric', url: ASSET_IMAGES.turmeric },
    { label: 'Grains & Cereals', url: ASSET_IMAGES.wheatGrains },
    { label: 'Mixed Vegetables', url: ASSET_IMAGES.heroStillLife },
  ];

  const validate = () => {
    const err: Record<string, string> = {};
    if (!farmerName.trim()) err.farmerName = 'Farmer name is required.';
    if (!village.trim()) err.village = 'Village / location is required.';
    if (!cropName.trim()) err.cropName = 'Crop name is required.';
    if (!quantity || quantity <= 0) err.quantity = 'Quantity must be greater than 0.';
    if (!askingPrice || askingPrice <= 0) err.askingPrice = 'Asking price must be greater than ₹0.';
    if (!harvestDate.trim()) err.harvestDate = 'Harvest date is required.';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const chosenImage = customImageUrl.trim() || selectedImagePreset;

    const newCrop: CropListing = {
      id: `crop-user-${Date.now()}`,
      cropName: cropName.trim(),
      category,
      farmerName: farmerName.trim(),
      farmName: farmName.trim(),
      village: village.trim(),
      quantityKg: Number(quantity),
      unit,
      askingPricePerKg: Number(askingPrice),
      expectedHarvestDate: harvestDate.trim(),
      qualityGrade,
      description: description.trim() || 'Direct single-origin harvest from village grower.',
      imageUrl: chosenImage,
      isCustom: true,
    };

    onListingCreated(newCrop);
    setSubmittedCrop(newCrop);
  };

  const calculatedGross = (Number(quantity) || 0) * (Number(askingPrice) || 0);

  return (
    <div className="py-12 sm:py-20 bg-[#F5F0E7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {submittedCrop ? (
          /* Success Screen */
          <div className="bg-[#FFFDF8] rounded-3xl p-8 sm:p-12 border border-[#234735]/15 shadow-xl text-center space-y-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-[#234735] text-[#D9AA45] rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#234735]">
                Listing Broadcast Active
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#172D24] font-serif-display">
                Harvest Listed on OoruLink!
              </h2>
              <p className="text-sm text-[#252923]/80 max-w-lg mx-auto font-light">
                Your lot of <strong>{submittedCrop.quantityKg} {submittedCrop.unit || 'kg'} {submittedCrop.cropName}</strong> is now visible to regional wholesale buyers, co-ops, and retail aggregators.
              </p>
            </div>

            {/* Lot Summary Card */}
            <div className="bg-[#F5F0E7] p-5 rounded-2xl border border-[#234735]/12 max-w-md mx-auto text-left text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-[#252923]/70">Grower & Location:</span>
                <span className="font-semibold text-[#172D24]">{submittedCrop.farmerName} · {submittedCrop.village}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#252923]/70">Asking Price:</span>
                <span className="font-bold text-[#234735] tabular-nums">₹{submittedCrop.askingPricePerKg} / {submittedCrop.unit || 'kg'}</span>
              </div>
              <div className="flex justify-between border-t border-[#234735]/10 pt-2">
                <span className="text-[#252923]/70">Estimated Gross Value:</span>
                <span className="font-bold text-[#172D24] text-base tabular-nums">
                  ₹{calculatedGross.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <button
                onClick={() => onNavigateToOffers(submittedCrop)}
                className="px-6 py-3.5 bg-[#D9AA45] text-[#172D24] text-xs font-bold rounded-xl hover:bg-[#c99a37] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <span>Compare Wholesale Buyer Offers</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onNavigateToProduce}
                className="px-6 py-3.5 bg-white border border-[#234735]/20 text-[#234735] text-xs font-semibold rounded-xl hover:bg-[#F5F0E7] transition-colors cursor-pointer"
              >
                View in Marketplace
              </button>
            </div>
          </div>
        ) : (
          /* Form Container */
          <div className="bg-[#FFFDF8] rounded-3xl border border-[#234735]/15 shadow-xl overflow-hidden">
            {/* Form Header */}
            <div className="p-6 sm:p-10 border-b border-[#234735]/10 bg-[#F5F0E7]/60">
              <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-[#234735] mb-2">
                <Sprout className="w-4 h-4 text-[#D9AA45]" />
                <span>Farmer Direct Channel</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#172D24] font-serif-display">
                Sell Your Harvest.
              </h2>
              <p className="text-xs sm:text-sm text-[#252923]/80 mt-2 max-w-xl font-light">
                Publish crop availability, specify quality grades, and invite bids from verified wholesale co-ops and retail aggregators without middleman commissions.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
              {/* Farmer and Location Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#172D24] mb-1">
                    Farmer Name *
                  </label>
                  <input
                    type="text"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="e.g. Rameshwar Patel"
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#F5F0E7]/50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923] ${
                      errors.farmerName ? 'border-red-500' : 'border-[#234735]/20'
                    }`}
                  />
                  {errors.farmerName && <p className="text-[11px] text-red-600 mt-1">{errors.farmerName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172D24] mb-1">
                    Farm / Collective Name
                  </label>
                  <input
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="e.g. Patel Natural Farms"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#F5F0E7]/50 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172D24] mb-1">
                    Village / Block Location *
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Rampur Village, Chikkaballapur"
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#F5F0E7]/50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923] ${
                      errors.village ? 'border-red-500' : 'border-[#234735]/20'
                    }`}
                  />
                  {errors.village && <p className="text-[11px] text-red-600 mt-1">{errors.village}</p>}
                </div>
              </div>

              {/* Crop & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#172D24] mb-1">
                    Crop Variety *
                  </label>
                  <input
                    type="text"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    placeholder="e.g. Desi Organic Tomatoes"
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#F5F0E7]/50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923] ${
                      errors.cropName ? 'border-red-500' : 'border-[#234735]/20'
                    }`}
                  />
                  {errors.cropName && <p className="text-[11px] text-red-600 mt-1">{errors.cropName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172D24] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#F5F0E7]/50 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923] cursor-pointer"
                  >
                    <option value="vegetables">Fresh Vegetables</option>
                    <option value="fruits">Fruits & Orchard</option>
                    <option value="leafy">Leafy Greens</option>
                    <option value="grains">Grains, Paddy & Pulses</option>
                    <option value="spices">Spices & Plantation</option>
                  </select>
                </div>
              </div>

              {/* Quantity, Unit, Price & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#172D24] mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    placeholder="100"
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#F5F0E7]/50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923] tabular-nums ${
                      errors.quantity ? 'border-red-500' : 'border-[#234735]/20'
                    }`}
                  />
                  {errors.quantity && <p className="text-[11px] text-red-600 mt-1">{errors.quantity}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172D24] mb-1">
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#F5F0E7]/50 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923]"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="quintal">Quintals (100 kg)</option>
                    <option value="crates">Crates (25 kg)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172D24] mb-1">
                    Asking Price (₹/{unit}) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={askingPrice}
                    onChange={(e) => setAskingPrice(Number(e.target.value))}
                    placeholder="20"
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#F5F0E7]/50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923] tabular-nums ${
                      errors.askingPrice ? 'border-red-500' : 'border-[#234735]/20'
                    }`}
                  />
                  {errors.askingPrice && <p className="text-[11px] text-red-600 mt-1">{errors.askingPrice}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172D24] mb-1">
                    Harvest Date *
                  </label>
                  <input
                    type="text"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    placeholder="Tomorrow Morning"
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#F5F0E7]/50 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923] ${
                      errors.harvestDate ? 'border-red-500' : 'border-[#234735]/20'
                    }`}
                  />
                  {errors.harvestDate && <p className="text-[11px] text-red-600 mt-1">{errors.harvestDate}</p>}
                </div>
              </div>

              {/* Quality & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#172D24] mb-1">
                    Produce Quality Grade
                  </label>
                  <select
                    value={qualityGrade}
                    onChange={(e) => setQualityGrade(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#F5F0E7]/50 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923]"
                  >
                    <option value="Grade A (Export / Premium)">Grade A (Export / Premium Quality)</option>
                    <option value="Grade B (Standard Market)">Grade B (Standard Mandi Quality)</option>
                    <option value="Grade C (Processing)">Grade C (Processing / Value Addition)</option>
                  </select>
                </div>

                <div className="bg-[#F5F0E7] p-3 rounded-xl border border-[#234735]/10 flex flex-col justify-center">
                  <span className="text-[11px] text-[#252923]/70">Calculated Asking Lot Value</span>
                  <span className="text-xl font-bold font-serif-display text-[#172D24] tabular-nums">
                    ₹{calculatedGross.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Image Selection / Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#172D24]">
                  Crop Photography Selection
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                  {imagePresets.map((preset) => (
                    <div
                      key={preset.label}
                      onClick={() => {
                        setSelectedImagePreset(preset.url);
                        setCustomImageUrl('');
                      }}
                      className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${
                        selectedImagePreset === preset.url && !customImageUrl
                          ? 'border-[#234735] bg-[#F5F0E7] ring-1 ring-[#234735]'
                          : 'border-[#234735]/12 hover:bg-[#F5F0E7]/60'
                      }`}
                    >
                      <div className="h-14 w-full rounded-lg overflow-hidden bg-slate-100 mb-1">
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] font-semibold text-[#172D24] block truncate">
                        {preset.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172D24] mb-1">
                  Product Notes & Crate Specifications
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail moisture level, packaging, plucking stage, pesticide-free certifications..."
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F5F0E7]/50 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923]"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-[#234735]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-[#252923]/70">
                  Listing will appear immediately in the public produce catalogue.
                </span>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#234735] hover:bg-[#172D24] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer active:scale-95"
                >
                  Publish Harvest Listing
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
