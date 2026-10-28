import React, { useState } from 'react';
import {
  Menu,
  X,
  Sprout,
  Search,
  User,
  ShoppingBag,
  ArrowRight,
  Package,
  Truck,
  Wrench,
  Briefcase,
  Layers,
} from 'lucide-react';

export type AppView =
  | 'home'
  | 'produce'
  | 'sell'
  | 'offers'
  | 'transport'
  | 'equipment'
  | 'opportunities'
  | 'cart'
  | 'orders'
  | 'dashboard';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  cartCount: number;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  cartCount,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNavItems: { id: AppView; label: string }[] = [
    { id: 'produce', label: 'Discover Produce' },
    { id: 'sell', label: 'Sell Your Harvest' },
    { id: 'offers', label: 'Buyer Offers' },
    { id: 'transport', label: 'Shared Transport' },
    { id: 'equipment', label: 'Equipment' },
    { id: 'opportunities', label: 'Opportunities' },
  ];

  const handleNavClick = (view: AppView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F5F0E7]/95 backdrop-blur-md border-b border-[#234735]/12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark with botanical symbol */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-[#234735] flex items-center justify-center text-[#D9AA45] shadow-xs group-hover:bg-[#172D24] transition-colors">
            <Sprout className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tight text-[#172D24] font-serif-display block leading-none">
              OoruLink
            </span>
            <span className="text-[10px] font-semibold text-[#234735]/75 tracking-widest uppercase block mt-1">
              Farm to Fair Market
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-[13px] font-medium text-[#252923]">
          {mainNavItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors whitespace-nowrap cursor-pointer py-1 relative ${
                  isActive
                    ? 'text-[#234735] font-semibold'
                    : 'text-[#252923]/80 hover:text-[#234735]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#234735] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Interactive Affordances (Search, Dashboard, Cart, Sell CTA) */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            aria-label="Search produce"
            className="p-2.5 rounded-xl hover:bg-[#EAE2D2] text-[#234735] transition-colors cursor-pointer"
            title="Search Produce & Farmers"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Account / Dashboard */}
          <button
            onClick={() => handleNavClick('dashboard')}
            aria-label="Farmer Dashboard"
            className={`p-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
              currentView === 'dashboard'
                ? 'bg-[#234735] text-white'
                : 'hover:bg-[#EAE2D2] text-[#234735]'
            }`}
            title="Farmer & Buyer Dashboard"
          >
            <User className="w-4 h-4" />
            <span className="hidden lg:inline">Dashboard</span>
          </button>

          {/* Cart Icon with Live Badge */}
          <button
            onClick={() => handleNavClick('cart')}
            aria-label="Cart & Order Summary"
            className="p-2.5 rounded-xl hover:bg-[#EAE2D2] text-[#234735] transition-colors cursor-pointer relative"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C85B45] text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Primary Action: Sell Your Harvest */}
          <button
            onClick={() => handleNavClick('sell')}
            className={`px-4.5 py-2.5 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap cursor-pointer active:scale-95 ${
              currentView === 'sell'
                ? 'bg-[#172D24] text-white'
                : 'bg-[#234735] hover:bg-[#172D24] text-white'
            }`}
          >
            <span>+ Sell Harvest</span>
          </button>
        </div>

        {/* Mobile Action Controls */}
        <div className="flex xl:hidden items-center gap-2">
          <button
            onClick={() => handleNavClick('cart')}
            className="p-2 text-[#234735] relative"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-[#C85B45] text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#234735] hover:bg-[#EAE2D2] rounded-lg cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#F5F0E7] border-b border-[#234735]/15 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 gap-1 text-sm font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left py-2.5 px-3 rounded-xl transition-colors ${
                currentView === 'home' ? 'bg-[#234735] text-white font-semibold' : 'text-[#252923] hover:bg-[#EAE2D2]'
              }`}
            >
              Home
            </button>
            {mainNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left py-2.5 px-3 rounded-xl transition-colors ${
                  currentView === item.id ? 'bg-[#234735] text-white font-semibold' : 'text-[#252923] hover:bg-[#EAE2D2]'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('orders')}
              className={`w-full text-left py-2.5 px-3 rounded-xl transition-colors ${
                currentView === 'orders' ? 'bg-[#234735] text-white font-semibold' : 'text-[#252923] hover:bg-[#EAE2D2]'
              }`}
            >
              My Orders & Deliveries
            </button>
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full text-left py-2.5 px-3 rounded-xl transition-colors ${
                currentView === 'dashboard' ? 'bg-[#234735] text-white font-semibold' : 'text-[#252923] hover:bg-[#EAE2D2]'
              }`}
            >
              Farmer Dashboard & My Listings
            </button>
          </div>

          <div className="pt-3 border-t border-[#234735]/10 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('sell')}
              className="w-full py-3 text-center text-sm font-bold text-white bg-[#234735] rounded-xl shadow-xs"
            >
              + Sell Your Harvest
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
