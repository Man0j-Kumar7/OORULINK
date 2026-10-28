import React, { useState, useEffect } from 'react';
import { Header, AppView } from './components/Header';
import { DemoFlowBar } from './components/DemoFlowBar';
import { HeroSection } from './components/HeroSection';
import { CategorySection } from './components/CategorySection';
import { ProduceMarketplace } from './components/ProduceMarketplace';
import { BuyerOffersSection } from './components/BuyerOffersSection';
import { SharedTransportSection } from './components/SharedTransportSection';
import { EquipmentSection } from './components/EquipmentSection';
import { LocalOpportunitiesSection } from './components/LocalOpportunitiesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { ImpactPilotSection } from './components/ImpactPilotSection';
import { AboutFooter } from './components/AboutFooter';
import { SellHarvestView } from './components/SellHarvestView';
import { CartView } from './components/CartView';
import { OrdersView } from './components/OrdersView';
import { DashboardView } from './components/DashboardView';
import { EditCropModal } from './components/EditCropModal';
import { JoinModal } from './components/JoinModal';
import { TransactionStatusModal } from './components/TransactionStatusModal';
import { Toast } from './components/Toast';
import {
  INITIAL_CROPS,
  INITIAL_ORDERS,
  INITIAL_TRANSACTION,
  SAMPLE_BUYER_OFFERS,
} from './data/initialData';
import {
  CropListing,
  BuyerOffer,
  ActiveTransaction,
  CartItem,
  Order,
} from './types';
import { Search, X, ArrowRight, Sprout, ShoppingBag } from 'lucide-react';

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<AppView>('home');

  // Core Data States with localStorage persistence
  const [crops, setCrops] = useState<CropListing[]>(() => {
    try {
      const saved = localStorage.getItem('oorulink_crops');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback to initial
    }
    return INITIAL_CROPS;
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('oorulink_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('oorulink_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ORDERS;
  });

  const [activeTransaction, setActiveTransaction] = useState<ActiveTransaction>(() => {
    try {
      const saved = localStorage.getItem('oorulink_txn');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_TRANSACTION;
  });

  // Modal & Overlay States
  const [editingCrop, setEditingCrop] = useState<CropListing | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Persist State to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('oorulink_crops', JSON.stringify(crops));
    } catch {
      // ignore
    }
  }, [crops]);

  useEffect(() => {
    try {
      localStorage.setItem('oorulink_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('oorulink_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('oorulink_txn', JSON.stringify(activeTransaction));
    } catch {
      // ignore
    }
  }, [activeTransaction]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Handlers
  const handleAddToCart = (crop: CropListing, quantityKg: number) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.crop.id === crop.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantityKg + quantityKg;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantityKg: newQty,
          subtotal: newQty * crop.askingPricePerKg,
        };
        return updated;
      }
      return [
        ...prev,
        {
          crop,
          quantityKg,
          subtotal: quantityKg * crop.askingPricePerKg,
        },
      ];
    });
    showToast(`Added ${quantityKg} kg of ${crop.cropName} to order`);
  };

  const handleUpdateCartQuantity = (cropId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cropId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.crop.id === cropId
          ? {
              ...item,
              quantityKg: newQty,
              subtotal: newQty * item.crop.askingPricePerKg,
            }
          : item
      )
    );
  };

  const handleRemoveCartItem = (cropId: string) => {
    setCartItems((prev) => prev.filter((item) => item.crop.id !== cropId));
    showToast('Item removed from order.');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handlePlaceOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setCurrentView('orders');
    showToast(`Order #${newOrder.orderNumber} placed successfully!`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const newTimeline = ord.timeline.map((step, idx) => {
          if (newStatus === 'Accepted' && idx <= 1) return { ...step, completed: true };
          if (newStatus === 'Preparing' && idx <= 2) return { ...step, completed: true };
          if (newStatus === 'In Transit' && idx <= 3) return { ...step, completed: true };
          if (newStatus === 'Delivered') return { ...step, completed: true };
          return step;
        });
        return {
          ...ord,
          status: newStatus,
          timeline: newTimeline,
        };
      })
    );
    showToast(`Order advanced to status: "${newStatus}"`);
  };

  // Crop Listing Lifecycle Handlers (Create, Edit, Delete)
  const handleAddNewCrop = (newCrop: CropListing) => {
    setCrops((prev) => [newCrop, ...prev]);
    setActiveTransaction({
      id: `TXN-OL-${Math.floor(1000 + Math.random() * 9000)}`,
      cropName: newCrop.cropName,
      quantityKg: newCrop.quantityKg,
      farmerName: newCrop.farmerName,
      village: newCrop.village,
      selectedOffer: SAMPLE_BUYER_OFFERS[2], // default recommended Buyer C
      selectedTransportRouteId: 'trip-tata-ace',
      stage: 'listing',
    });
    showToast(`Listed ${newCrop.quantityKg} kg of ${newCrop.cropName} on OoruLink`);
  };

  const handleSaveCropEdit = (updatedCrop: CropListing) => {
    setCrops((prev) =>
      prev.map((c) => (c.id === updatedCrop.id ? updatedCrop : c))
    );
    if (activeTransaction.cropName === updatedCrop.cropName) {
      setActiveTransaction((prev) => ({
        ...prev,
        quantityKg: updatedCrop.quantityKg,
      }));
    }
    setEditingCrop(null);
    showToast(`Updated listing for ${updatedCrop.cropName}`);
  };

  const handleDeleteCrop = (cropId: string) => {
    setCrops((prev) => prev.filter((c) => c.id !== cropId));
    showToast('Crop listing removed.');
  };

  // Bidding & Transport Flow Handlers
  const handleCompareOffersForCrop = (crop: CropListing) => {
    setActiveTransaction((prev) => ({
      ...prev,
      cropName: crop.cropName,
      quantityKg: crop.quantityKg,
      farmerName: crop.farmerName,
      village: crop.village,
      stage: 'listing',
    }));
    setCurrentView('offers');
    showToast(`Loaded offers for ${crop.quantityKg} kg ${crop.cropName}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOffer = (offer: BuyerOffer) => {
    setActiveTransaction((prev) => ({
      ...prev,
      selectedOffer: offer,
      stage: 'offer_selected',
    }));
    showToast(`Selected: ${offer.buyerName.split(':')[0]} (₹${offer.offeredPricePerKg}/kg)`);
  };

  const handleProceedToTransport = () => {
    setCurrentView('transport');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTripJoined = (tripId: string, weightKg: number) => {
    setActiveTransaction((prev) => ({
      ...prev,
      selectedTransportRouteId: tripId,
      stage: 'transport_pooled',
    }));
    showToast(`Joined shared trip #${tripId} with ${weightKg} kg!`);
  };

  const handleTripCancelled = (tripId: string) => {
    setActiveTransaction((prev) => ({
      ...prev,
      stage: 'offer_selected',
    }));
    showToast(`Cancelled pickup allocation on route #${tripId}.`);
  };

  // Reset Dataset
  const handleResetData = () => {
    try {
      localStorage.removeItem('oorulink_crops');
      localStorage.removeItem('oorulink_cart');
      localStorage.removeItem('oorulink_orders');
      localStorage.removeItem('oorulink_txn');
      localStorage.removeItem('oorulink_trips');
      localStorage.removeItem('oorulink_equipment_bookings');
      localStorage.removeItem('oorulink_opportunity_applications');
    } catch {
      // ignore
    }
    setCrops(INITIAL_CROPS);
    setCartItems([]);
    setOrders(INITIAL_ORDERS);
    setActiveTransaction(INITIAL_TRANSACTION);
    showToast('Demonstration dataset refreshed to initial state.');
  };

  const handleNavigateToStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        handleNavigate('sell');
        break;
      case 2:
        handleNavigate('offers');
        break;
      case 3:
        handleNavigate('transport');
        break;
      case 4:
        setIsTransactionModalOpen(true);
        break;
      default:
        break;
    }
  };

  // Find currently active crop for offers display
  const currentCropListing =
    crops.find((c) => c.cropName === activeTransaction.cropName) || {
      id: 'active-crop',
      cropName: activeTransaction.cropName,
      category: 'vegetables',
      farmerName: activeTransaction.farmerName,
      village: activeTransaction.village,
      quantityKg: activeTransaction.quantityKg,
      unit: 'kg',
      askingPricePerKg: 20,
      expectedHarvestDate: 'Tomorrow Morning',
      qualityGrade: 'Grade A (Export / Premium)',
      description: 'Vine-ripened organic tomatoes for demonstration.',
      imageUrl: crops[0]?.imageUrl || '',
    };

  // Filter crops for search overlay
  const searchResults = globalSearchQuery.trim()
    ? crops.filter(
        (c) =>
          c.cropName.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
          c.farmerName.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
          c.village.toLowerCase().includes(globalSearchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-[#F5F0E7] text-[#252923] flex flex-col font-sans selection:bg-[#D9AA45] selection:text-[#172D24]">
      {/* Sticky Navigation Header with 3 Zones */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantityKg, 0)}
        onOpenSearch={() => setIsSearchOverlayOpen(true)}
      />

      {/* Demonstration Pipeline Stepper Bar */}
      <DemoFlowBar
        transaction={activeTransaction}
        onNavigateToStep={handleNavigateToStep}
        onOpenTransactionModal={() => setIsTransactionModalOpen(true)}
      />

      {/* Main Content Area based on currentView */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            {/* Hero Section */}
            <HeroSection
              onExplore={() => handleNavigate('produce')}
              onSellHarvest={() => handleNavigate('sell')}
            />

            {/* 5-Card Marketplace Categories */}
            <CategorySection onSelectCategory={handleNavigate} />

            {/* Fresh Produce Marketplace Catalog Preview */}
            <ProduceMarketplace
              crops={crops}
              onAddToCart={handleAddToCart}
              onCompareOffers={handleCompareOffersForCrop}
              onOpenSellHarvest={() => handleNavigate('sell')}
            />

            {/* Buyer Offer Comparison Engine */}
            <BuyerOffersSection
              currentCrop={currentCropListing}
              selectedOffer={activeTransaction.selectedOffer}
              onSelectOffer={handleSelectOffer}
              onProceedToTransport={handleProceedToTransport}
            />

            {/* Shared Village Freight Logistics */}
            <SharedTransportSection
              transaction={activeTransaction}
              onTripJoined={handleTripJoined}
              onTripCancelled={handleTripCancelled}
              onViewDashboard={() => handleNavigate('dashboard')}
            />

            {/* Farm Equipment Rental Bank */}
            <EquipmentSection onShowToast={showToast} />

            {/* Local Skills & Micro-Enterprises */}
            <LocalOpportunitiesSection onShowToast={showToast} />

            {/* 4-Step Operating Process */}
            <HowItWorksSection />

            {/* Impact & Pilot Roadmap */}
            <ImpactPilotSection />
          </>
        )}

        {currentView === 'produce' && (
          <div className="py-4">
            <ProduceMarketplace
              crops={crops}
              onAddToCart={handleAddToCart}
              onCompareOffers={handleCompareOffersForCrop}
              onOpenSellHarvest={() => handleNavigate('sell')}
            />
          </div>
        )}

        {currentView === 'sell' && (
          <SellHarvestView
            onListingCreated={handleAddNewCrop}
            onNavigateToProduce={() => handleNavigate('produce')}
            onNavigateToOffers={handleCompareOffersForCrop}
          />
        )}

        {currentView === 'offers' && (
          <div className="py-8">
            <BuyerOffersSection
              currentCrop={currentCropListing}
              selectedOffer={activeTransaction.selectedOffer}
              onSelectOffer={handleSelectOffer}
              onProceedToTransport={handleProceedToTransport}
            />
          </div>
        )}

        {currentView === 'transport' && (
          <div className="py-8">
            <SharedTransportSection
              transaction={activeTransaction}
              onTripJoined={handleTripJoined}
              onTripCancelled={handleTripCancelled}
              onViewDashboard={() => handleNavigate('dashboard')}
            />
          </div>
        )}

        {currentView === 'equipment' && (
          <div className="py-8">
            <EquipmentSection onShowToast={showToast} />
          </div>
        )}

        {currentView === 'opportunities' && (
          <div className="py-8">
            <LocalOpportunitiesSection onShowToast={showToast} />
          </div>
        )}

        {currentView === 'cart' && (
          <CartView
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={handleClearCart}
            onPlaceOrder={handlePlaceOrder}
            onNavigateToProduce={() => handleNavigate('produce')}
            onNavigateToOrders={() => handleNavigate('orders')}
          />
        )}

        {currentView === 'orders' && (
          <OrdersView
            orders={orders}
            onNavigateToProduce={() => handleNavigate('produce')}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            crops={crops}
            onOpenSellHarvest={() => handleNavigate('sell')}
            onEditCrop={(crop) => setEditingCrop(crop)}
            onDeleteCrop={handleDeleteCrop}
            onNavigateToOffers={handleCompareOffersForCrop}
            onNavigateToTransport={() => handleNavigate('transport')}
            onNavigateToOrders={() => handleNavigate('orders')}
            orders={orders}
          />
        )}
      </main>

      {/* Editorial Footer & Dataset Reset Action */}
      <AboutFooter
        onNavigate={handleNavigate}
        onResetData={handleResetData}
      />

      {/* Modals & Dialogs */}
      <EditCropModal
        isOpen={!!editingCrop}
        crop={editingCrop}
        onClose={() => setEditingCrop(null)}
        onSaveCrop={handleSaveCropEdit}
      />

      <JoinModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoined={(role, name) => showToast(`Welcome ${name}! Registered as ${role}.`)}
      />

      <TransactionStatusModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        transaction={activeTransaction}
      />

      {/* Global Produce Search Overlay */}
      {isSearchOverlayOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4">
          <div className="bg-[#FFFDF8] rounded-3xl max-w-2xl w-full border border-[#234735]/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-6 border-b border-[#234735]/10 flex items-center gap-3">
              <Search className="w-5 h-5 text-[#234735]" />
              <input
                type="text"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder="Search crops, vegetables, farmers, or villages..."
                className="w-full text-base sm:text-lg bg-transparent border-none focus:outline-none text-[#172D24] placeholder-[#252923]/40"
                autoFocus
              />
              <button
                onClick={() => {
                  setIsSearchOverlayOpen(false);
                  setGlobalSearchQuery('');
                }}
                className="p-1.5 text-[#252923]/60 hover:text-[#172D24] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-4 space-y-2">
              {globalSearchQuery.trim() === '' ? (
                <div className="py-8 text-center text-xs text-[#252923]/60">
                  <p>Type to search 20+ seasonal crops, village growers, and locations.</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {['Tomatoes', 'Onions', 'Carrots', 'Mangoes', 'Turmeric'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setGlobalSearchQuery(tag)}
                        className="px-2.5 py-1 rounded-full bg-[#F5F0E7] text-[11px] font-semibold text-[#234735] hover:bg-[#DCE4D5] transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((crop) => (
                  <div
                    key={crop.id}
                    onClick={() => {
                      setIsSearchOverlayOpen(false);
                      setGlobalSearchQuery('');
                      handleNavigate('produce');
                    }}
                    className="p-3 rounded-2xl hover:bg-[#F5F0E7] border border-transparent hover:border-[#234735]/10 flex items-center justify-between gap-4 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={crop.imageUrl}
                        alt={crop.cropName}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-[#172D24]">{crop.cropName}</h4>
                        <p className="text-xs text-[#252923]/70">
                          {crop.farmerName} · {crop.village}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-[#234735]">
                        ₹{crop.askingPricePerKg}/kg
                      </span>
                      <span className="text-[11px] text-[#252923]/60 block">
                        {crop.quantityKg} {crop.unit} available
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-[#252923]/60">
                  No crops found matching "{globalSearchQuery}".
                </div>
              )}
            </div>

            <div className="p-4 bg-[#F5F0E7] border-t border-[#234735]/10 flex items-center justify-between text-xs text-[#234735]">
              <span>Showing results from verified farmgate listings</span>
              <button
                onClick={() => {
                  setIsSearchOverlayOpen(false);
                  handleNavigate('produce');
                }}
                className="font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                Browse All 20 Crops <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Global Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
