import React, { useState } from 'react';
import {
  Truck,
  Users,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Info,
} from 'lucide-react';
import { TransportRouteTrip, ActiveTransaction } from '../types';
import { INITIAL_TRANSPORT_TRIPS, ASSET_IMAGES } from '../data/initialData';

interface SharedTransportSectionProps {
  transaction: ActiveTransaction;
  onTripJoined?: (tripId: string, weightKg: number) => void;
  onTripCancelled?: (tripId: string) => void;
  onViewDashboard?: () => void;
}

export const SharedTransportSection: React.FC<SharedTransportSectionProps> = ({
  transaction,
  onTripJoined,
  onTripCancelled,
  onViewDashboard,
}) => {
  const [trips, setTrips] = useState<TransportRouteTrip[]>(() => {
    try {
      const saved = localStorage.getItem('oorulink_trips');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_TRANSPORT_TRIPS;
  });

  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0].id);
  const [farmerProduceWeight, setFarmerProduceWeight] = useState<number>(transaction.quantityKg || 100);
  const [filterDestination, setFilterDestination] = useState<string>('all');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Sync trips to localStorage
  const updateTripsState = (newTrips: TransportRouteTrip[]) => {
    setTrips(newTrips);
    try {
      localStorage.setItem('oorulink_trips', JSON.stringify(newTrips));
    } catch {
      // ignore
    }
  };

  const activeTrip = trips.find((t) => t.id === selectedTripId) || trips[0];
  const remainingCapacity = activeTrip.maxCapacityKg - activeTrip.currentPooledKg;

  const handleJoinTrip = (tripId: string) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return;

    if (farmerProduceWeight <= 0) {
      setFeedbackMsg({ text: 'Please enter a valid weight in kg.', type: 'error' });
      return;
    }

    if (trip.currentPooledKg + farmerProduceWeight > trip.maxCapacityKg) {
      setFeedbackMsg({
        text: `Cannot exceed vehicle capacity. Only ${trip.maxCapacityKg - trip.currentPooledKg} kg space remaining in this vehicle.`,
        type: 'error',
      });
      return;
    }

    const calculatedShare = Math.round(farmerProduceWeight * trip.costPerKg);

    const updated = trips.map((t) => {
      if (t.id === tripId) {
        return {
          ...t,
          currentPooledKg: t.currentPooledKg + farmerProduceWeight,
          userJoined: true,
          userContributionKg: farmerProduceWeight,
          participants: [
            ...t.participants,
            {
              id: `user-p-${Date.now()}`,
              farmerName: transaction.farmerName || 'You (Rameshwar Patel)',
              village: transaction.village || 'Rampur Village',
              cropName: transaction.cropName || 'Organic Tomatoes',
              weightKg: farmerProduceWeight,
              fareShare: calculatedShare,
            },
          ],
        };
      }
      return t;
    });

    updateTripsState(updated);
    setFeedbackMsg({
      text: `Successfully reserved space for ${farmerProduceWeight} kg on ${trip.vehicleName}. Freight contribution: ₹${calculatedShare}.`,
      type: 'success',
    });

    if (onTripJoined) {
      onTripJoined(tripId, farmerProduceWeight);
    }
  };

  const handleCancelTrip = (tripId: string) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return;

    const userWeight = trip.userContributionKg || 0;

    const updated = trips.map((t) => {
      if (t.id === tripId) {
        return {
          ...t,
          currentPooledKg: Math.max(0, t.currentPooledKg - userWeight),
          userJoined: false,
          userContributionKg: 0,
          participants: t.participants.filter((p) => !p.id.startsWith('user-p-')),
        };
      }
      return t;
    });

    updateTripsState(updated);
    setFeedbackMsg({
      text: `Reservation cancelled on ${trip.vehicleName}.`,
      type: 'success',
    });

    if (onTripCancelled) {
      onTripCancelled(tripId);
    }
  };

  const filteredTrips = trips.filter((t) => {
    if (filterDestination === 'all') return true;
    return t.destination.toLowerCase().includes(filterDestination.toLowerCase());
  });

  return (
    <section id="shared-transport" className="py-16 sm:py-24 bg-[#F5F0E7] border-b border-[#234735]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#234735]/80 mb-2">
              <Truck className="w-4 h-4 text-[#D9AA45]" />
              <span>Signature Logistics Pooling Corridor</span>
            </div>
            <h2 className="text-3xl sm:text-5xl text-[#172D24] font-serif-display tracking-tight">
              More produce. One smarter journey.
            </h2>
            <p className="text-sm sm:text-base text-[#252923]/80 mt-2 max-w-2xl font-light">
              Small farms often spend 30% of their earnings hiring private mini-trucks. OoruLink coordinates shared rural freight routes so neighboring growers split the cost and maximize profit.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#FFFDF8] p-2 rounded-2xl border border-[#234735]/15 shadow-xs">
            <span className="text-xs font-semibold text-[#172D24] px-3">Filter Route:</span>
            <select
              value={filterDestination}
              onChange={(e) => setFilterDestination(e.target.value)}
              className="text-xs bg-[#F5F0E7] border border-[#234735]/15 px-3 py-1.5 rounded-xl text-[#252923] focus:outline-none cursor-pointer"
            >
              <option value="all">All Delivery Corridors</option>
              <option value="APMC">City APMC Mandi</option>
              <option value="Cold">Taluk Cold Store</option>
              <option value="Processing">Agro Processing Park</option>
            </select>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div
            className={`mb-6 p-4 rounded-2xl border flex items-center justify-between text-xs animate-in fade-in duration-200 ${
              feedbackMsg.type === 'success'
                ? 'bg-[#234735] text-white border-[#234735]'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#D9AA45]" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              <span>{feedbackMsg.text}</span>
            </div>
            <button
              onClick={() => setFeedbackMsg(null)}
              className="text-white/70 hover:text-white underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Available Shared Trips */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg font-bold text-[#172D24] font-serif-display mb-1">
              Select an Active Delivery Route
            </h3>

            <div className="space-y-4">
              {filteredTrips.map((trip) => {
                const isSelected = selectedTripId === trip.id;
                const capacityPercentage = Math.min(100, Math.round((trip.currentPooledKg / trip.maxCapacityKg) * 100));
                const spaceRemaining = trip.maxCapacityKg - trip.currentPooledKg;
                const userJoinedThis = trip.userJoined;

                return (
                  <div
                    key={trip.id}
                    onClick={() => setSelectedTripId(trip.id)}
                    className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFFDF8] border-[#234735] ring-2 ring-[#234735] shadow-xl'
                        : 'bg-[#FFFDF8]/80 hover:bg-[#FFFDF8] border-[#234735]/15 hover:border-[#234735]/35 hover:shadow-md'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#234735] uppercase tracking-wider">
                            Route: {trip.routeName.split('➔')[0]} ➔ {trip.destination.split('(')[0]}
                          </span>
                          {userJoinedThis && (
                            <span className="bg-[#234735] text-[#D9AA45] text-[10px] font-bold px-2 py-0.5 rounded-md">
                              You Joined
                            </span>
                          )}
                        </div>
                        <h4 className="text-xl font-bold text-[#172D24] font-serif-display mt-0.5">
                          {trip.vehicleName}
                        </h4>
                        <p className="text-xs text-[#252923]/70 font-light">
                          Driver: {trip.driverName} ({trip.driverPhone}) · Reg: {trip.vehicleNumber}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-2xl font-bold text-[#234735] font-serif-display tabular-nums">
                          ₹{trip.costPerKg.toFixed(2)}
                        </span>
                        <span className="text-xs text-[#252923]/70"> / kg pooled</span>
                      </div>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="bg-[#F5F0E7] p-4 rounded-2xl border border-[#234735]/10 space-y-2 my-3 text-xs">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[#252923]/70">
                          Current Pooled Cargo: <strong>{trip.currentPooledKg} kg</strong> of {trip.maxCapacityKg} kg
                        </span>
                        <span className="font-bold text-[#172D24]">{capacityPercentage}% Full</span>
                      </div>

                      <div className="w-full bg-white h-2.5 rounded-full overflow-hidden border border-[#234735]/10">
                        <div
                          className={`h-full transition-all duration-500 ${
                            capacityPercentage > 90 ? 'bg-amber-600' : 'bg-[#234735]'
                          }`}
                          style={{ width: `${capacityPercentage}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#252923]/75 pt-1">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-[#234735]" />
                          {trip.participants.length} village farmers sharing ride
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-[#234735]">
                          <Clock className="w-3.5 h-3.5" />
                          Departure: {trip.pickupTime}
                        </span>
                      </div>
                    </div>

                    {/* Interactive Join / Cancel Action */}
                    <div className="pt-3 border-t border-[#234735]/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[#252923]/70">Space available:</span>
                        <strong className="text-[#172D24] tabular-nums">{spaceRemaining} kg</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        {userJoinedThis ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelTrip(trip.id);
                            }}
                            className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-xl font-bold cursor-pointer transition-colors"
                          >
                            Cancel Participation
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleJoinTrip(trip.id);
                            }}
                            disabled={spaceRemaining <= 0}
                            className={`px-5 py-2 rounded-xl font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
                              spaceRemaining <= 0
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-[#D9AA45] hover:bg-[#c99a37] text-[#172D24]'
                            }`}
                          >
                            Join This Shared Trip
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Route Details, Dynamic Cost Split, & Active Trip Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            {/* Active Selected Trip Panel */}
            <div className="bg-[#FFFDF8] rounded-3xl border border-[#234735]/15 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#234735]/10 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#234735]/80 block">
                    Active Trip Coordination
                  </span>
                  <h4 className="text-xl font-bold text-[#172D24] font-serif-display">
                    {activeTrip.vehicleName}
                  </h4>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#234735] text-[#D9AA45] flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
              </div>

              {/* Weight Allocator */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#172D24]">
                  Your Produce Load to Pool (kg):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="10"
                    max={remainingCapacity > 0 ? remainingCapacity : 100}
                    value={farmerProduceWeight}
                    onChange={(e) => setFarmerProduceWeight(Math.max(1, Number(e.target.value)))}
                    className="w-28 px-3.5 py-2 text-xs font-bold bg-[#F5F0E7] border border-[#234735]/20 rounded-xl text-[#172D24] tabular-nums focus:outline-none"
                  />
                  <span className="text-xs text-[#252923]/70 font-semibold">kg</span>
                  <span className="text-xs text-[#252923]/40">·</span>
                  <span className="text-xs text-[#234735] font-bold">
                    Est. Freight: ₹{(farmerProduceWeight * activeTrip.costPerKg).toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Transparent Fare Sharing Breakdown */}
              <div className="bg-[#F5F0E7] p-4.5 rounded-2xl border border-[#234735]/10 text-xs space-y-2.5">
                <div className="flex justify-between font-semibold text-[#172D24]">
                  <span>Total Vehicle Hire Cost:</span>
                  <span className="tabular-nums">₹{activeTrip.baseFareTotal}</span>
                </div>
                <div className="flex justify-between text-[#252923]/80">
                  <span>Divided Across Pooled Cargo:</span>
                  <span className="font-bold text-[#234735] tabular-nums">
                    ₹{activeTrip.costPerKg.toFixed(2)} / kg
                  </span>
                </div>
                <div className="pt-2 border-t border-[#234735]/10 flex justify-between font-bold text-xs">
                  <span className="text-[#172D24]">Estimated Solo Hire Alternative:</span>
                  <span className="text-red-700 line-through tabular-nums">~₹1,200</span>
                </div>
                <div className="flex justify-between font-bold text-xs text-[#234735]">
                  <span>Savings with OoruLink:</span>
                  <span>~68% Saved on Transit</span>
                </div>
              </div>

              {/* Participating Farmers on this vehicle */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-[#172D24] uppercase tracking-wider block">
                  Participating Farmers ({activeTrip.participants.length})
                </span>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activeTrip.participants.map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 bg-[#F5F0E7]/60 rounded-xl border border-[#234735]/8 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-[#172D24] block">{p.farmerName}</span>
                        <span className="text-[11px] text-[#252923]/70">
                          {p.cropName} · {p.village}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#234735] tabular-nums">{p.weightKg} kg</span>
                        <span className="text-[11px] text-[#252923]/60 block tabular-nums">₹{p.fareShare}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Route Stops */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#172D24] uppercase tracking-wider block">
                  Scheduled Consolidation Stops
                </span>
                <div className="space-y-1.5 text-xs text-[#252923]/80">
                  {activeTrip.routeStops.map((stop, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#234735]" />
                      <span>{stop}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Logistics Guarantee */}
            <div className="p-5 rounded-3xl bg-[#234735] text-white space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D9AA45]">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Rural Freight Operator</span>
              </div>
              <p className="text-xs text-[#DCE4D5]/80 leading-relaxed font-light">
                Digital gate weighing and instant receipt dispatch. Produce is checked for crate ventilation before departure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
