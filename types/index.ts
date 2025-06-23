export interface Artist {
  id: string;
  name: string;
  bio: string;
  category: string[];
  languages: string[];
  feeRange: string;
  location: string;
  profileImage?: string;
  rating?: number;
  experience?: string;
  availability?: boolean;
  submittedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Location {
  id: string;
  city: string;
  state: string;
  country: string;
}

export interface FilterState {
  category: string[];
  location: string[];
  priceRange: string[];
  searchTerm: string;
}

export interface FormData {
  name: string;
  bio: string;
  location: string;
  category: string[];
  languages: string[];
  feeRange: string;
  profileImage?: File;
}