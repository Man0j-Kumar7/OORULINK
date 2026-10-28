import React, { useState } from 'react';
import {
  Package,
  Clock,
  CheckCircle2,
  MapPin,
  Truck,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Order } from '../types';

interface OrdersViewProps {
  orders: Order[];
  onNavigateToProduce: () => void;
  onUpdateOrderStatus?: (orderId: string, newStatus: Order['status']) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onNavigateToProduce,
  onUpdateOrderStatus,
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    orders.length > 0 ? orders[0].id : null
  );

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Requested':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Preparing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'In Transit':
        return 'bg-emerald-100 text-[#234735] border-emerald-200';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusSteps: Order['status'][] = ['Requested', 'Accepted', 'Preparing', 'In Transit', 'Delivered'];

  const handleSimulateNextStep = (order: Order) => {
    const currentIndex = statusSteps.indexOf(order.status);
    if (currentIndex < statusSteps.length - 1 && onUpdateOrderStatus) {
      const nextStatus = statusSteps[currentIndex + 1];
      onUpdateOrderStatus(order.id, nextStatus);
    }
  };

  return (
    <div className="py-12 sm:py-20 bg-[#F5F0E7]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#234735]/80 mb-2">
              <Package className="w-4 h-4 text-[#D9AA45]" />
              <span>Real-Time Order Tracking</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#172D24] font-serif-display">
              My Orders & Harvest Dispatches
            </h2>
            <p className="text-xs sm:text-sm text-[#252923]/75 font-light mt-1">
              Follow your produce orders from village harvest collection point to delivery.
            </p>
          </div>

          <button
            onClick={onNavigateToProduce}
            className="px-5 py-2.5 text-xs font-semibold text-[#234735] bg-white border border-[#234735]/20 rounded-xl hover:bg-[#F5F0E7] transition-colors cursor-pointer self-start sm:self-auto"
          >
            + Browse More Crops
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-[#FFFDF8] rounded-3xl p-12 text-center border border-[#234735]/12 max-w-lg mx-auto shadow-sm space-y-3">
            <Package className="w-10 h-10 text-[#234735]/40 mx-auto" />
            <h3 className="text-xl font-bold font-serif-display text-[#172D24]">No orders placed yet</h3>
            <p className="text-xs text-[#252923]/70">Place an order for fresh produce to view live delivery progression.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((ord) => {
              const isExpanded = expandedOrderId === ord.id;
              const currentStepIdx = statusSteps.indexOf(ord.status);

              return (
                <div
                  key={ord.id}
                  className="bg-[#FFFDF8] rounded-3xl border border-[#234735]/15 overflow-hidden shadow-sm transition-all"
                >
                  {/* Card Summary Header */}
                  <div
                    onClick={() => setExpandedOrderId(isExpanded ? null : ord.id)}
                    className="p-5 sm:p-6 bg-white hover:bg-[#F5F0E7]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#F5F0E7] text-[#234735] flex items-center justify-center shrink-0">
                        <Truck className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#172D24]">{ord.orderNumber}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getStatusColor(ord.status)}`}>
                            {ord.status}
                          </span>
                        </div>
                        <span className="text-xs text-[#252923]/70 font-light block mt-0.5">
                          Placed on {ord.date} · {ord.items.length} produce varieties
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#234735]/10">
                      <div className="text-right">
                        <span className="text-[11px] text-[#252923]/60 block uppercase">Order Total</span>
                        <span className="text-lg font-bold font-serif-display text-[#172D24] tabular-nums">
                          ₹{ord.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="p-1 text-[#252923]/50">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Progress & Breakdown */}
                  {isExpanded && (
                    <div className="p-6 border-t border-[#234735]/10 bg-[#F5F0E7]/40 space-y-6 animate-in fade-in duration-200">
                      {/* Step Progression Bar */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#234735] block">
                          Fulfillment Stages
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                          {statusSteps.map((st, i) => {
                            const isDone = i <= currentStepIdx;
                            const isCurrent = i === currentStepIdx;
                            return (
                              <div
                                key={st}
                                className={`p-3 rounded-xl border text-center transition-all ${
                                  isCurrent
                                    ? 'bg-[#234735] text-white border-[#234735] font-bold shadow-xs'
                                    : isDone
                                    ? 'bg-[#FFFDF8] text-[#234735] border-[#234735]/30 font-semibold'
                                    : 'bg-white/50 text-[#252923]/40 border-transparent'
                                }`}
                              >
                                <span className="block text-[11px]">{st}</span>
                                {isDone && (
                                  <span className="text-[10px] text-[#D9AA45] block font-normal">
                                    {isCurrent ? 'Current' : 'Completed'}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Simulation Advance Action */}
                      {onUpdateOrderStatus && ord.status !== 'Delivered' && (
                        <div className="p-3 bg-white rounded-xl border border-[#234735]/12 flex items-center justify-between text-xs">
                          <span className="text-[#252923]/70">
                            Demo Simulator: Advance order to next delivery milestone
                          </span>
                          <button
                            onClick={() => handleSimulateNextStep(ord)}
                            className="px-3.5 py-1.5 bg-[#D9AA45] text-[#172D24] font-bold rounded-lg hover:bg-[#c99a37] transition-all cursor-pointer"
                          >
                            Advance to {statusSteps[currentStepIdx + 1]} ➔
                          </button>
                        </div>
                      )}

                      {/* Items & Delivery Address Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                        {/* Ordered Produce Lots */}
                        <div className="bg-white p-4.5 rounded-2xl border border-[#234735]/10 space-y-3">
                          <span className="text-xs font-bold text-[#172D24] uppercase tracking-wider block">
                            Produce Items
                          </span>
                          <div className="space-y-2">
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs">
                                <div>
                                  <span className="font-semibold text-[#172D24] block">{it.crop.cropName}</span>
                                  <span className="text-[11px] text-[#252923]/60">{it.crop.farmerName} · {it.crop.village}</span>
                                </div>
                                <span className="font-bold text-[#234735] tabular-nums">
                                  {it.quantityKg} kg · ₹{it.subtotal}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recipient Details */}
                        <div className="bg-white p-4.5 rounded-2xl border border-[#234735]/10 space-y-3 text-xs">
                          <span className="text-xs font-bold text-[#172D24] uppercase tracking-wider block">
                            Delivery Destination
                          </span>
                          <div className="space-y-1 text-[#252923]/80">
                            <p className="font-semibold text-[#172D24]">{ord.buyerName} ({ord.buyerPhone})</p>
                            <p>{ord.deliveryAddress}</p>
                            <p>{ord.deliveryVillage} — {ord.deliveryPincode}</p>
                            {ord.specialInstructions && (
                              <p className="text-[11px] text-[#234735] italic mt-2">
                                Note: {ord.specialInstructions}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
