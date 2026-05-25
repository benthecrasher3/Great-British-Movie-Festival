export interface Movie {
  id: string;
  title: string;
  director: string;
  description: string;
  rating: number;
  year: number;
  genre: string[];
  imageUrl: string;
  trailerUrl?: string;
  color: string;
  awards?: string[];
  starring: string[];
  quotes: { text: string; actor: string }[];
  locations: string[];
  watchUrl?: string;
  watchLocationName?: string;
  isRemoved?: boolean;
  removalReason?: string;
  isLocked?: boolean;
}

export interface FestivalEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
}

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: 'Snacks' | 'Drinks' | 'Combos';
  isRemoved?: boolean;
}

export interface Booking {
  id: string;
  type: 'movie' | 'event';
  title: string;
  itemId: string;
  quantity: number;
  location?: string;
  price: number;
  date: string;
  isPaid?: boolean;
  refundStatus?: 'none' | 'requested' | 'refunded';
}

export interface FoodOrder {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  orderId?: string;
  isPaid?: boolean;
}

export interface FestivalUser {
  email: string;
  password: string;
  status: 'active' | 'blocked';
  appealRequest?: string;
  appealStatus?: 'pending' | 'declined' | 'approved' | 'none';
  appealResponse?: string;
}
