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

export interface ProfileResponse extends AuthUser {
  _count?: {
    venues: number;
    bookings: number;
  };
}

export interface Venue {
  id: string;
  name: string;
  description?: string;
  media?: { url: string; alt?: string }[];
  price: number;
  maxGuests: number;
  location?: { address?: string; city?: string; country?: string };
  owner?: { name: string; email: string };
  avatar?: { url: string; alt?: string };
}
