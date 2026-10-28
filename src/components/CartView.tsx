import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { CartItem, Order } from '../types';

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (cropId: string, newQty: number) => void;
  onRemoveItem: (cropId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (order: Order) => void;
  onNavigateToProduce: () => void;
  onNavigateToOrders: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
  onNavigateToProduce,
  onNavigateToOrders,
}) => {
  const [buyerName, setBuyerName] = useState('Ananya Sen');
  const [buyerPhone, setBuyerPhone] = useState('+91 98450 88219');
  const [deliveryVillage, setDeliveryVillage] = useState('Indiranagar, Bengaluru');
  const [deliveryPincode, setDeliveryPincode] = useState('560038');
  const [deliveryAddress, setDeliveryAddress] = useState('42/1, 12th Main Road, HAL 2nd Stage');
  const [specialInstructions, setSpecialInstructions] = useState('Morning delivery preferred before 10 AM.');
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const deliveryFee = cartItems.length > 0 ? 80 : 0; // Flat shared delivery contribution
  const totalAmount = subtotal + deliveryFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setErrorMsg('Your cart is empty.');
      return;
    }
    if (!buyerName.trim() || !buyerPhone.trim() || !deliveryAddress.trim()) {
      setErrorMsg('Please complete all required delivery fields.');
      return;
    }

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `OL-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: [...cartItems],
      totalAmount,
      buyerName: buyerName.trim(),
      buyerPhone: buyerPhone.trim(),
      deliveryVillage: deliveryVillage.trim(),
      deliveryPincode: deliveryPincode.trim(),
      deliveryAddress: deliveryAddress.trim(),
      specialInstructions: specialInstructions.trim(),
      status: 'Requested',
      timeline: [
        { title: 'Order Requested by Buyer', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
        { title: 'Accepted by Farm Collective', time: 'Pending review', completed: false },
        { title: 'Produce Plucked & Crated', time: 'Scheduled for morning', completed: false },
        { title: 'Dispatched via Shared Freight', time: 'Awaiting dispatch', completed: false },
        { title: 'Delivered to Address', time: 'Pending transit', completed: false },
      ],
    };

    onPlaceOrder(newOrder);
    setConfirmedOrder(newOrder);
    onClearCart();
  };

  return (
    <div className="py-12 sm:py-20 bg-[#F5F0E7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {confirmedOrder ? (
          /* Order Confirmation Screen */
          <div className="bg-[#FFFDF8] rounded-3xl p-8 sm:p-12 border border-[#234735]/15 shadow-xl text-center space-y-6 animate-in fade-in duration-300 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-[#234735] text-[#D9AA45] rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#234735]">
                Order Confirmation
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#172D24] font-serif-display">
                Produce Order Requested!
              </h2>
              <p className="text-xs sm:text-sm text-[#252923]/80 font-light">
                Order <strong>{confirmedOrder.orderNumber}</strong> has been transmitted to the grower collectives at Rampur Village.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-[#F5F0E7] p-5 rounded-2xl border border-[#234735]/10 text-left text-xs space-y-3">
              <div className="flex justify-between border-b border-[#234735]/10 pb-2">
                <span className="text-[#252923]/70">Recipient:</span>
                <span className="font-semibold text-[#172D24]">{confirmedOrder.buyerName} ({confirmedOrder.buyerPhone})</span>
              </div>
              <div className="flex justify-between border-b border-[#234735]/10 pb-2">
                <span className="text-[#252923]/70">Destination:</span>
                <span className="font-semibold text-[#172D24]">{confirmedOrder.deliveryAddress}, {confirmedOrder.deliveryVillage}</span>
              </div>
              <div className="space-y-1 pt-1">
                <span className="font-semibold text-[#172D24] block">Ordered Items:</span>
                {confirmedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-[#252923]/80">
                    <span>{it.quantityKg} kg {it.crop.cropName}</span>
                    <span className="font-bold tabular-nums">₹{it.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between border-t border-[#234735]/10 pt-2 font-bold text-sm">
                <span className="text-[#172D24]">Total Payable:</span>
                <span className="text-[#234735] tabular-nums">₹{confirmedOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={onNavigateToOrders}
                className="px-6 py-3.5 bg-[#D9AA45] text-[#172D24] text-xs font-bold rounded-xl hover:bg-[#c99a37] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <span>Track in My Orders</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onNavigateToProduce}
                className="px-6 py-3.5 bg-white border border-[#234735]/20 text-[#234735] text-xs font-semibold rounded-xl hover:bg-[#F5F0E7] transition-colors cursor-pointer"
              >
                Explore More Produce
              </button>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="bg-[#FFFDF8] rounded-3xl p-12 sm:p-16 border border-[#234735]/12 text-center max-w-xl mx-auto shadow-sm space-y-4">
            <div className="w-16 h-16 bg-[#F5F0E7] text-[#234735]/60 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-serif-display text-[#172D24]">
              Your Harvest Cart is Empty
            </h3>
            <p className="text-xs sm:text-sm text-[#252923]/75 font-light">
              Explore freshly harvested lots directly from village growers and add fresh produce to your order.
            </p>
            <button
              onClick={onNavigateToProduce}
              className="mt-2 px-6 py-3 bg-[#234735] hover:bg-[#172D24] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Discover Farm Produce
            </button>
          </div>
        ) : (
          /* Cart with Items & Checkout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#172D24] font-serif-display">
                  Order Summary ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                </h2>
                <button
                  onClick={onClearCart}
                  className="text-xs text-[#C85B45] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Cart</span>
                </button>
              </div>

              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.crop.id}
                    className="p-4 sm:p-5 bg-[#FFFDF8] rounded-2xl border border-[#234735]/12 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-[#234735]/10">
                        <img
                          src={item.crop.imageUrl}
                          alt={item.crop.cropName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-[#234735] font-semibold block">
                          {item.crop.farmerName} · {item.crop.village}
                        </span>
                        <h4 className="text-base font-bold text-[#172D24] font-serif-display">
                          {item.crop.cropName}
                        </h4>
                        <span className="text-xs text-[#252923]/70 tabular-nums">
                          ₹{item.crop.askingPricePerKg} / kg
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-[#234735]/10">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#234735]/20 rounded-xl bg-[#F5F0E7]">
                        <button
                          onClick={() => onUpdateQuantity(item.crop.id, Math.max(1, item.quantityKg - 5))}
                          className="p-1.5 text-[#234735] hover:bg-white rounded-l-xl transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#172D24] tabular-nums">
                          {item.quantityKg} kg
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.crop.id, Math.min(item.crop.quantityKg, item.quantityKg + 5))}
                          className="p-1.5 text-[#234735] hover:bg-white rounded-r-xl transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right min-w-[70px]">
                        <span className="text-base font-bold text-[#172D24] tabular-nums font-serif-display block">
                          ₹{item.subtotal.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => onRemoveItem(item.crop.id)}
                        className="p-1.5 text-[#252923]/40 hover:text-[#C85B45] transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Checkout & Delivery Form */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#FFFDF8] rounded-3xl border border-[#234735]/15 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[#172D24] font-serif-display mb-4">
                  Delivery & Buyer Details
                </h3>

                <form onSubmit={handleCheckout} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#172D24] mb-1">
                        Buyer Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#F5F0E7]/60 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#172D24] mb-1">
                        Phone *
                      </label>
                      <input
                        type="text"
                        required
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#F5F0E7]/60 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#172D24] mb-1">
                      Delivery Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#F5F0E7]/60 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#172D24] mb-1">
                        Area / Village
                      </label>
                      <input
                        type="text"
                        value={deliveryVillage}
                        onChange={(e) => setDeliveryVillage(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#F5F0E7]/60 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#172D24] mb-1">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        value={deliveryPincode}
                        onChange={(e) => setDeliveryPincode(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#F5F0E7]/60 border border-[#234735]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#234735] text-[#252923]"
                      />
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="p-4 bg-[#F5F0E7] rounded-2xl border border-[#234735]/10 space-y-2 text-xs mt-4">
                    <div className="flex justify-between text-[#252923]/70">
                      <span>Produce Subtotal:</span>
                      <span className="font-semibold text-[#172D24] tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[#252923]/70">
                      <span>Pooled Shared Freight Contribution:</span>
                      <span className="font-semibold text-[#234735] tabular-nums">₹{deliveryFee}</span>
                    </div>
                    <div className="pt-2 border-t border-[#234735]/10 flex justify-between font-bold text-sm">
                      <span className="text-[#172D24]">Total Payable (Direct to Grower):</span>
                      <span className="text-xl font-bold font-serif-display text-[#234735] tabular-nums">
                        ₹{totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#234735] hover:bg-[#172D24] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer active:scale-95 flex items-center justify-center gap-2 mt-2"
                  >
                    <Package className="w-4 h-4 text-[#D9AA45]" />
                    <span>Confirm Order & Dispatch Request</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-[11px] text-[#252923]/60 justify-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#234735]" />
                    <span>Direct farmgate settlement. Verified at village weighing bay.</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
