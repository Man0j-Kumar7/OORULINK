export type CropCategory = 'all' | 'vegetables' | 'fruits' | 'grains' | 'spices' | 'leafy';

export interface CropListing {
  id: string;
  cropName: string;
  category: CropCategory;
  farmerName: string;
  farmName?: string;
  village: string;
  quantityKg: number;
  unit?: string;
  askingPricePerKg: number;
  expectedHarvestDate: string;
  qualityGrade: 'Grade A (Export / Premium)' | 'Grade B (Standard Market)' | 'Grade C (Processing)';
  description: string;
  imageUrl: string;
  isCustom?: boolean;
}

export interface BuyerOffer {
  id: string;
  buyerName: string;
  buyerType: 'Wholesale Mandi Buyer' | 'Urban Organic Co-op' | 'Food Processing Aggregator';
  offeredPricePerKg: number;
  transportDeductionPerKg: number;
  deliveryRequirement: string;
  paymentTerms: string;
  pickupLocation: string;
  rating: number;
  verifiedBadge: boolean;
  status?: 'pending' | 'accepted' | 'declined';
}

export interface TransportParticipant {
  id: string;
  farmerName: string;
  village: string;
  cropName: string;
  weightKg: number;
  fareShare: number;
}

export interface TransportRouteTrip {
  id: string;
  routeName: string;
  pickupLocation: string;
  destination: string;
  vehicleName: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  maxCapacityKg: number;
  currentPooledKg: number;
  baseFareTotal: number;
  costPerKg: number;
  pickupTime: string;
  routeStops: string[];
  participants: TransportParticipant[];
  userJoined?: boolean;
  userContributionKg?: number;
}

export interface EquipmentListing {
  id: string;
  name: string;
  category: 'Tractor' | 'Tiller' | 'Pumping' | 'Seeding' | 'Sprayer';
  powerSpec: string;
  dailyRate: number;
  ownerName: string;
  ownerVillage: string;
  availability: 'Available Today' | 'Available in 2 Days' | 'Seasonal Booking';
  description: string;
  imageUrl: string;
  bookedDates?: string[];
}

export interface EquipmentBooking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  farmerName: string;
  village: string;
  startDate: string;
  days: number;
  totalCost: number;
  withOperator: boolean;
  status: 'Confirmed' | 'Pending Verification';
  createdAt: string;
}

export interface LocalOpportunity {
  id: string;
  title: string;
  category: 'Agricultural Labor' | 'Harvest & Packing' | 'Rural Artisans' | 'Food Producers' | 'Repair & Maintenance';
  providerName: string;
  location: string;
  dailyRateOrPrice: string;
  experience: string;
  description: string;
  contactMasked: string;
  assistedAccessAvailable: boolean;
  openingsOrSlots?: string;
}

export interface OpportunityApplication {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  applicantName: string;
  applicantPhone: string;
  preferredDates: string;
  message: string;
  assistedVoiceRequested: boolean;
  submittedAt: string;
  status: 'Application Received' | 'Facilitator Reviewing';
}

export interface CartItem {
  crop: CropListing;
  quantityKg: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  buyerName: string;
  buyerPhone: string;
  deliveryVillage: string;
  deliveryPincode: string;
  deliveryAddress: string;
  specialInstructions?: string;
  status: 'Requested' | 'Accepted' | 'Preparing' | 'In Transit' | 'Delivered';
  timeline: { title: string; time: string; completed: boolean }[];
}

export interface ActiveTransaction {
  id: string;
  cropName: string;
  quantityKg: number;
  farmerName: string;
  village: string;
  selectedOffer: BuyerOffer | null;
  selectedTransportRouteId?: string;
  stage: 'listing' | 'offer_selected' | 'transport_pooled' | 'delivery_confirmed';
  confirmedAt?: string;
}
