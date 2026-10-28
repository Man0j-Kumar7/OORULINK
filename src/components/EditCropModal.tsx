import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CropListing } from '../types';

interface EditCropModalProps {
  crop: CropListing | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveCrop: (updatedCrop: CropListing) => void;
}

export const EditCropModal: React.FC<EditCropModalProps> = ({
  crop,
  isOpen,
  onClose,
  onSaveCrop,
}) => {
  if (!isOpen || !crop) return null;

  const [cropName, setCropName] = useState(crop.cropName);
  const [quantityKg, setQuantityKg] = useState(crop.quantityKg);
  const [askingPricePerKg, setAskingPricePerKg] = useState(crop.askingPricePerKg);
  const [expectedHarvestDate, setExpectedHarvestDate] = useState(crop.expectedHarvestDate);
  const [description, setDescription] = useState(crop.description);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim()) {
      setError('Crop name is required');
      return;
    }
    if (quantityKg <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }
    if (askingPricePerKg <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    onSaveCrop({
      ...crop,
      cropName: cropName.trim(),
      quantityKg: Number(quantityKg),
      askingPricePerKg: Number(askingPricePerKg),
      expectedHarvestDate: expectedHarvestDate.trim(),
      description: description.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFDF8] rounded-3xl max-w-lg w-full border border-[#234735]/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#234735]/10 bg-[#F5F0E7]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#234735]/70 block">
              Farmer Dashboard
            </span>
            <h3 className="text-xl font-bold text-[#172D24] font-serif-display">
              Edit Crop Listing
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#252923]/60 hover:text-[#172D24] hover:bg-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#172D24] mb-1">
              Crop Name *
            </label>
            <input
              type="text"
              required
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-[#F5F0E7]/50 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#172D24] mb-1">
                Quantity (kg) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantityKg}
                onChange={(e) => setQuantityKg(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs bg-[#F5F0E7]/50 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923] tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172D24] mb-1">
                Asking Price (₹/kg) *
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                required
                value={askingPricePerKg}
                onChange={(e) => setAskingPricePerKg(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs bg-[#F5F0E7]/50 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923] tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172D24] mb-1">
              Harvest Date / Window *
            </label>
            <input
              type="text"
              required
              value={expectedHarvestDate}
              onChange={(e) => setExpectedHarvestDate(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-[#F5F0E7]/50 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172D24] mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-[#F5F0E7]/50 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#234735]/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#252923] hover:bg-[#F5F0E7] rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#234735] hover:bg-[#172D24] rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
