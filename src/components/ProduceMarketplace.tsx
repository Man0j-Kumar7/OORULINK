import React, { useState, useMemo } from 'react';
import {
  Search,
  PlusCircle,
  ArrowUpDown,
  MapPin,
  Calendar,
  ShoppingBag,
  Eye,
  SlidersHorizontal,
  Check,
} from 'lucide-react';
import { CropListing, CropCategory } from '../types';
import { ProduceDetailModal } from './ProduceDetailModal';

interface ProduceMarketplaceProps {
  crops: CropListing[];
  onAddToCart: (crop: CropListing, quantityKg: number) => void;
  onCompareOffers: (crop: CropListing) => void;
  onOpenSellHarvest: () => void;
}

export const ProduceMarketplace: React.FC<ProduceMarketplaceProps> = ({
  crops,
  onAddToCart,
  onCompareOffers,
  onOpenSellHarvest,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CropCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'qty-desc'>('default');
  const [selectedCropForDetail, setSelectedCropForDetail] = useState<CropListing | null>(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const categories: { id: CropCategory; label: string }[] = [
    { id: 'all', label: 'All Harvests' },
    { id: 'vegetables', label: 'Vegetables' },
    { id: 'fruits', label: 'Fruits' },
    { id: 'leafy', label: 'Leafy Greens' },
    { id: 'grains', label: 'Grains & Staples' },
    { id: 'spices', label: 'Spices' },
  ];

  const filteredCrops = useMemo(() => {
    let result = [...crops];

    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.cropName.toLowerCase().includes(q) ||
          item.farmerName.toLowerCase().includes(q) ||
          (item.farmName && item.farmName.toLowerCase().includes(q)) ||
          item.village.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.askingPricePerKg - b.askingPricePerKg);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.askingPricePerKg - a.askingPricePerKg);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.cropName.localeCompare(b.cropName));
    } else if (sortBy === 'qty-desc') {
      result.sort((a, b) => b.quantityKg - a.quantityKg);
    }

    return result;
  }, [crops, selectedCategory, searchQuery, sortBy]);

  const handleQuickAdd = (crop: CropListing) => {
    const defaultQty = Math.min(10, crop.quantityKg);
    onAddToCart(crop, defaultQty);
    setRecentlyAddedId(crop.id);
    setTimeout(() => setRecentlyAddedId(null), 1800);
  };

  return (
    <section id="produce-catalogue" className="py-16 sm:py-24 bg-[#F5F0E7]/60 border-b border-[#234735]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#234735]/80 mb-2">
              <span>Seasonal Produce Catalogue</span>
              <span className="text-[#234735]/40">·</span>
              <span>{crops.length} Farmgate Varieties</span>
            </div>
            <h2 className="text-3xl sm:text-5xl text-[#172D24] font-serif-display tracking-tight">
              Grown with care. Ready for market.
            </h2>
            <p className="text-sm sm:text-base text-[#252923]/80 mt-2.5 max-w-2xl font-light">
              Discover fresh produce and connect with the people who grow it. Direct pricing, authentic origins, and shared regional delivery.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSellHarvest}
              className="px-5 py-3 text-xs font-bold text-white bg-[#234735] hover:bg-[#172D24] rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer whitespace-nowrap active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-[#D9AA45]" />
              <span>+ Sell Your Harvest</span>
            </button>
          </div>
        </div>

        {/* Filter Bar, Search, and Sort Controls */}
        <div className="bg-[#FFFDF8] p-4 rounded-2xl border border-[#234735]/12 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#234735] text-white shadow-xs'
                        : 'text-[#252923]/80 hover:text-[#172D24] hover:bg-[#F5F0E7]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-[#252923]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tomatoes, onions, farmers, village..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-[#F5F0E7]/60 border border-[#234735]/15 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923]"
                />
              </div>

              <div className="flex items-center gap-2 bg-[#F5F0E7]/60 border border-[#234735]/15 rounded-xl px-3 py-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#234735]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-medium text-[#252923] focus:outline-none cursor-pointer"
                >
                  <option value="default">Sort by: Curated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Crop Name (A-Z)</option>
                  <option value="qty-desc">Quantity: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Produce Grid */}
        {filteredCrops.length === 0 ? (
          <div className="bg-[#FFFDF8] rounded-3xl p-12 text-center border border-[#234735]/12 max-w-lg mx-auto">
            <SlidersHorizontal className="w-10 h-10 text-[#234735]/40 mx-auto mb-3" />
            <h3 className="text-xl font-bold font-serif-display text-[#172D24]">No produce matches found</h3>
            <p className="text-xs text-[#252923]/70 mt-1.5">Try clearing filters or search by a different crop or location.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-5 py-2 text-xs font-semibold text-[#234735] bg-[#F5F0E7] rounded-xl hover:bg-[#EAE2D2] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCrops.map((crop) => {
              const isRecentlyAdded = recentlyAddedId === crop.id;

              return (
                <div
                  key={crop.id}
                  className="bg-[#FFFDF8] rounded-2xl border border-[#234735]/12 hover:border-[#234735]/30 overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Slot */}
                    <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                      <img
                        src={crop.imageUrl}
                        alt={crop.cropName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {crop.isCustom && (
                        <div className="absolute top-3 left-3 bg-[#172D24] text-[#D9AA45] px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm">
                          Direct Listing
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[#172D24] px-2.5 py-1 rounded-md text-[11px] font-bold tabular-nums shadow-xs">
                        {crop.quantityKg} {crop.unit || 'kg'}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-2.5">
                      {/* Farmer metadata - Zero-Pill discipline */}
                      <div className="flex items-center gap-1.5 text-xs text-[#234735] font-semibold">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{crop.farmerName} · {crop.village}</span>
                      </div>

                      <h3 className="text-xl font-bold text-[#172D24] font-serif-display group-hover:text-[#234735] transition-colors leading-tight">
                        {crop.cropName}
                      </h3>

                      <p className="text-xs text-[#252923]/75 line-clamp-2 leading-relaxed font-light">
                        {crop.description}
                      </p>

                      {/* Clean metadata strip */}
                      <div className="pt-2 border-t border-[#234735]/8 flex items-center justify-between text-xs text-[#252923]/70">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#234735]" />
                          <span>{crop.expectedHarvestDate.split('(')[0]}</span>
                        </span>
                        <span className="font-medium text-[#172D24]">{crop.qualityGrade.split('(')[0]}</span>
                      </div>

                      {/* Price Baseline */}
                      <div className="pt-2 flex items-baseline justify-between">
                        <div>
                          <span className="text-2xl font-bold text-[#172D24] font-serif-display tabular-nums">
                            ₹{crop.askingPricePerKg}
                          </span>
                          <span className="text-xs text-[#252923]/70 font-normal ml-1">/ {crop.unit || 'kg'}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] text-[#234735] font-semibold">Farmgate direct</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedCropForDetail(crop)}
                      className="px-3 py-2.5 text-xs font-semibold text-[#252923] bg-[#F5F0E7] hover:bg-[#EAE2D2] rounded-xl border border-[#234735]/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    <button
                      onClick={() => handleQuickAdd(crop)}
                      className={`px-3 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
                        isRecentlyAdded
                          ? 'bg-[#234735] text-[#D9AA45]'
                          : 'bg-[#D9AA45] hover:bg-[#c99a37] text-[#172D24]'
                      }`}
                    >
                      {isRecentlyAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Order</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Produce Detail Modal */}
      <ProduceDetailModal
        crop={selectedCropForDetail}
        onClose={() => setSelectedCropForDetail(null)}
        onAddToCart={onAddToCart}
        onCompareOffers={onCompareOffers}
      />
    </section>
  );
};
