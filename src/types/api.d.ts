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
