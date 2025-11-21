export interface Avatar {
  url: string;
  alt?: string;
}

export interface AuthUser {
  name: string;
  email: string;
  avatar?: Avatar;
  venueManager: boolean;
}

export interface LoginResponse extends AuthUser {
  accessToken: string;
}

export interface Venue {
  id: string;
  name: string;
  description?: string;
  media?: { url: string; alt?: string }[];
  price: number;
  maxGuests: number;

  rating?: number;
  created?: string;
  updated?: string;

  meta?: {
    wifi?: boolean;
    parking?: boolean;
    breakfast?: boolean;
    pets?: boolean;
  };

  location?: {
    address?: string;
    city?: string;
    zip?: string;
    country?: string;
    continent?: string;
  };

  owner?: { name: string; email: string };
  avatar?: { url: string; alt?: string };

  bookings?: Booking[];
}
export interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  venue?: Venue;
  customer?: AuthUser;
  created?: string;
  updated?: string;
}

export interface ProfileResponse extends AuthUser {
  _count?: {
    venues: number;
    bookings: number;
  };
  venues?: Venue[];
  bookings?: Booking[];
}
