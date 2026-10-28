import React, { useState } from 'react';
import {
  User,
  Package,
  Truck,
  Wrench,
  Edit,
  Trash2,
  PlusCircle,
  Eye,
  CheckCircle2,
  MapPin,
  Calendar,
  Layers,
} from 'lucide-react';
import { CropListing, ActiveTransaction, Order } from '../types';

interface DashboardViewProps {
  crops: CropListing[];
  onOpenSellHarvest: () => void;
  onEditCrop: (crop: CropListing) => void;
  onDeleteCrop: (cropId: string) => void;
  onNavigateToOffers: (crop: CropListing) => void;
  onNavigateToTransport: () => void;
  onNavigateToOrders: () => void;
  orders: Order[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  crops,
  onOpenSellHarvest,
  onEditCrop,
  onDeleteCrop,
  onNavigateToOffers,
  onNavigateToTransport,
  onNavigateToOrders,
  orders,
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'orders' | 'profile'>('listings');

  // Filter crops that are custom or created by user, plus the primary sample crop
  const userListings = crops.filter((c) => c.isCustom || c.id === 'crop-tomatoes');

  return (
    <div className="py-12 sm:py-20 bg-[#F5F0E7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Dashboard Profile Banner */}
        <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#234735]/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#234735] text-[#D9AA45] flex items-center justify-center font-serif-display text-2xl font-bold shrink-0">
              RP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-[#172D24] font-serif-display">
                  Rameshwar Patel
                </h2>
                <span className="text-[10px] font-bold bg-[#DCE4D5] text-[#172D24] px-2 py-0.5 rounded-md">
                  Verified Grower
                </span>
              </div>
              <p className="text-xs text-[#252923]/75 font-light mt-0.5">
                Patel Natural Farms · Rampur Village, Chikkaballapur (Cluster #4)
              </p>
              <div className="flex items-center gap-4 text-xs text-[#234735] font-semibold mt-2">
                <span>Member since 2024</span>
                <span>·</span>
                <span>100% Organic Verified</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSellHarvest}
              className="px-5 py-3 text-xs font-bold text-white bg-[#234735] hover:bg-[#172D24] rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-[#D9AA45]" />
              <span>+ List New Harvest</span>
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-[#234735]/15 pb-2">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'listings'
                ? 'bg-[#234735] text-white'
                : 'text-[#252923]/70 hover:bg-white'
            }`}
          >
            My Produce Listings ({userListings.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#234735] text-white'
                : 'text-[#252923]/70 hover:bg-white'
            }`}
          >
            Buyer Orders & Dispatches ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#234735] text-white'
                : 'text-[#252923]/70 hover:bg-white'
            }`}
          >
            Farm Profile & Certifications
          </button>
        </div>

        {/* Tab 1: Produce Listings with Edit & Delete */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#172D24] uppercase tracking-wider">
                Manage Your Active Produce Lots
              </span>
              <span className="text-xs text-[#252923]/60">
                You can edit quantity, asking price, or remove lots at any time.
              </span>
            </div>

            {userListings.length === 0 ? (
              <div className="bg-[#FFFDF8] rounded-3xl p-10 text-center border border-[#234735]/12">
                <p className="text-xs text-[#252923]/70">You have no active harvest listings.</p>
                <button
                  onClick={onOpenSellHarvest}
                  className="mt-3 px-4 py-2 text-xs font-semibold text-[#234735] underline cursor-pointer"
                >
                  List your first crop
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {userListings.map((crop) => (
                  <div
                    key={crop.id}
                    className="bg-[#FFFDF8] rounded-2xl border border-[#234735]/15 p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-3">
                      <div className="h-40 rounded-xl overflow-hidden bg-slate-100 relative">
                        <img src={crop.imageUrl} alt={crop.cropName} className="w-full h-full object-cover" />
                        <div className="absolute top-2.5 right-2.5 bg-white/95 px-2 py-0.5 rounded text-[11px] font-bold text-[#172D24]">
                          {crop.quantityKg} {crop.unit || 'kg'}
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-[#234735] block">
                          {crop.village}
                        </span>
                        <h4 className="text-lg font-bold text-[#172D24] font-serif-display">
                          {crop.cropName}
                        </h4>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-xl font-bold text-[#172D24] tabular-nums font-serif-display">
                            ₹{crop.askingPricePerKg}
                          </span>
                          <span className="text-xs text-[#252923]/60">/ {crop.unit || 'kg'}</span>
                        </div>
                      </div>

                      <p className="text-xs text-[#252923]/70 line-clamp-2 font-light">
                        {crop.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#234735]/10 space-y-2">
                      <button
                        onClick={() => onNavigateToOffers(crop)}
                        className="w-full py-2 bg-[#D9AA45] hover:bg-[#c99a37] text-[#172D24] text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                      >
                        View 3 Buyer Offers
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onEditCrop(crop)}
                          className="py-1.5 px-3 bg-[#F5F0E7] hover:bg-[#EAE2D2] text-[#252923] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5 text-[#234735]" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => onDeleteCrop(crop.id)}
                          className="py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#172D24] uppercase tracking-wider">
                Buyer Orders Received
              </span>
              <button
                onClick={onNavigateToOrders}
                className="text-xs text-[#234735] underline font-semibold cursor-pointer"
              >
                Open Full Tracking View
              </button>
            </div>

            <div className="bg-[#FFFDF8] rounded-3xl p-6 border border-[#234735]/15 space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 bg-[#F5F0E7]/60 rounded-2xl border border-[#234735]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-[#172D24] text-sm block">{ord.orderNumber}</span>
                    <span className="text-[#252923]/70">
                      Buyer: {ord.buyerName} · Status: <strong>{ord.status}</strong>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-[#234735] tabular-nums block font-serif-display">
                      ₹{ord.totalAmount.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={onNavigateToOrders}
                      className="text-[11px] text-[#234735] underline font-semibold cursor-pointer"
                    >
                      Track Shipment ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Farm Profile */}
        {activeTab === 'profile' && (
          <div className="bg-[#FFFDF8] rounded-3xl p-8 border border-[#234735]/15 space-y-6">
            <h3 className="text-xl font-bold font-serif-display text-[#172D24]">
              Farm Verification & Bank Escrow
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="p-4 bg-[#F5F0E7] rounded-2xl border border-[#234735]/10 space-y-2">
                <span className="font-bold text-[#172D24] block">Kisan Credit & UPI Details</span>
                <p className="text-[#252923]/70">Direct Payout Account: State Bank of India (••• 4892)</p>
                <p className="text-[#252923]/70">UPI VPA: patelfarms@sbi</p>
                <p className="text-[#234735] font-semibold">Instant settlement active on village gate scan</p>
              </div>

              <div className="p-4 bg-[#F5F0E7] rounded-2xl border border-[#234735]/10 space-y-2">
                <span className="font-bold text-[#172D24] block">Soil & Crop Certification</span>
                <p className="text-[#252923]/70">Soil Health Card: Issued Jan 2026 (Rich in organic carbon)</p>
                <p className="text-[#252923]/70">Bio-pesticide verification: Level 1 Certified</p>
                <p className="text-[#234735] font-semibold">Single-origin QR code generation enabled</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
