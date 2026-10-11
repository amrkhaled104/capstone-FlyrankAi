export interface CustomerBooking {
  id: string;
  serviceTitle: string;
  category: string;
  providerName: string;
  providerRole: string;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  price: string;
  status: 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  rating?: number;
}

export interface ProviderRequest {
  id: string;
  customerName: string;
  serviceTitle: string;
  category: string;
  requestedDate: string;
  requestedTime: string;
  address: string;
  distance: string;
  estimatedPayout: string;
  status: 'pending' | 'accepted' | 'declined';
  urgency: 'urgent' | 'standard';
  notes?: string;
}

export interface ProviderCompletedJob {
  id: string;
  customerName: string;
  serviceTitle: string;
  completedDate: string;
  payout: string;
  rating: number;
  review?: string;
}
