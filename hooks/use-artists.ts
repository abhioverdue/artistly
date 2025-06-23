'use client';

import { useState, useEffect } from 'react';
import { Artist, Category, Location } from '@/types';

// Mock data - in a real app, this would come from your API
const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    bio: 'Classical Indian dancer with 15 years of experience in Bharatanatyam and Kathak. Performed at national and international stages.',
    category: ['Dancer', 'Cultural Performer'],
    languages: ['Hindi', 'English', 'Tamil'],
    feeRange: '25,000 - 50,000',
    location: 'Mumbai, Maharashtra',
    profileImage: '/api/placeholder/300/400',
    rating: 4.8,
    experience: '15+ years',
    availability: true,
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    bio: 'Professional DJ and music producer specializing in Bollywood, Electronic, and Fusion music for weddings and corporate events.',
    category: ['DJ', 'Music Producer'],
    languages: ['Hindi', 'English', 'Punjabi'],
    feeRange: '15,000 - 30,000',
    location: 'Delhi, NCR',
    profileImage: '/api/placeholder/300/400',
    rating: 4.6,
    experience: '8+ years',
    availability: true,
  },
  {
    id: '3',
    name: 'Anita Desai',
    bio: 'Motivational speaker and corporate trainer with expertise in leadership development and team building workshops.',
    category: ['Speaker', 'Trainer'],
    languages: ['English', 'Hindi', 'Gujarati'],
    feeRange: '10,000 - 25,000',
    location: 'Bangalore, Karnataka',
    profileImage: '/api/placeholder/300/400',
    rating: 4.9,
    experience: '12+ years',
    availability: false,
  },
  {
    id: '4',
    name: 'Arjun Singh',
    bio: 'Bollywood playback singer and live performer. Winner of multiple singing competitions and featured in regional films.',
    category: ['Singer', 'Performer'],
    languages: ['Hindi', 'English', 'Punjabi', 'Haryanvi'],
    feeRange: '30,000 - 75,000',
    location: 'Chandigarh, Punjab',
    profileImage: '/api/placeholder/300/400',
    rating: 4.7,
    experience: '10+ years',
    availability: true,
  },
  {
    id: '5',
    name: 'Meera Nair',
    bio: 'Contemporary dance choreographer and performer specializing in fusion dance forms for modern events and shows.',
    category: ['Dancer', 'Choreographer'],
    languages: ['English', 'Malayalam', 'Tamil'],
    feeRange: '20,000 - 40,000',
    location: 'Kochi, Kerala',
    profileImage: '/api/placeholder/300/400',
    rating: 4.5,
    experience: '7+ years',
    availability: true,
  },
  {
    id: '6',
    name: 'Vikram Joshi',
    bio: 'Stand-up comedian and entertainment host with experience in corporate events, weddings, and private parties.',
    category: ['Comedian', 'Host'],
    languages: ['Hindi', 'English', 'Marathi'],
    feeRange: '12,000 - 25,000',
    location: 'Pune, Maharashtra',
    profileImage: '/api/placeholder/300/400',
    rating: 4.4,
    experience: '5+ years',
    availability: true,
  },
];

const mockCategories: Category[] = [
  { id: '1', name: 'Singer', icon: '🎤', description: 'Vocal performers and musicians' },
  { id: '2', name: 'Dancer', icon: '💃', description: 'Classical and contemporary dancers' },
  { id: '3', name: 'DJ', icon: '🎧', description: 'Music mixing and entertainment' },
  { id: '4', name: 'Speaker', icon: '🎯', description: 'Motivational and keynote speakers' },
  { id: '5', name: 'Comedian', icon: '😄', description: 'Stand-up and entertainment comedy' },
  { id: '6', name: 'Host', icon: '🎭', description: 'Event hosting and anchoring' },
  { id: '7', name: 'Cultural Performer', icon: '🎨', description: 'Traditional and cultural arts' },
  { id: '8', name: 'Music Producer', icon: '🎵', description: 'Music production and arrangement' },
];

const mockLocations: Location[] = [
  { id: '1', city: 'Mumbai', state: 'Maharashtra', country: 'India' },
  { id: '2', city: 'Delhi', state: 'Delhi', country: 'India' },
  { id: '3', city: 'Bangalore', state: 'Karnataka', country: 'India' },
  { id: '4', city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
  { id: '5', city: 'Hyderabad', state: 'Telangana', country: 'India' },
  { id: '6', city: 'Pune', state: 'Maharashtra', country: 'India' },
  { id: '7', city: 'Kolkata', state: 'West Bengal', country: 'India' },
  { id: '8', city: 'Ahmedabad', state: 'Gujarat', country: 'India' },
  { id: '9', city: 'Jaipur', state: 'Rajasthan', country: 'India' },
  { id: '10', city: 'Kochi', state: 'Kerala', country: 'India' },
];

interface UseArtistsReturn {
  artists: Artist[];
  categories: Category[];
  locations: Location[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useArtists(): UseArtistsReturn {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, you would fetch from your API
      // const [artistsRes, categoriesRes, locationsRes] = await Promise.all([
      //   fetch('/api/artists'),
      //   fetch('/api/categories'),
      //   fetch('/api/locations')
      // ]);

      // For now, use mock data
      setArtists(mockArtists);
      setCategories(mockCategories);
      setLocations(mockLocations);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    fetchData();
  };

  return {
    artists,
    categories,
    locations,
    loading,
    error,
    refetch,
  };
}

// Hook for fetching a single artist by ID
export function useArtist(id: string) {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        const foundArtist = mockArtists.find(a => a.id === id);
        if (!foundArtist) {
          throw new Error('Artist not found');
        }

        setArtist(foundArtist);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch artist');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArtist();
    }
  }, [id]);

  return { artist, loading, error };
}

// Hook for managing artist favorites (client-side storage)
export function useFavoriteArtists() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('favoriteArtists');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const addToFavorites = (artistId: string) => {
    const newFavorites = [...favorites, artistId];
    setFavorites(newFavorites);
    localStorage.setItem('favoriteArtists', JSON.stringify(newFavorites));
  };

  const removeFromFavorites = (artistId: string) => {
    const newFavorites = favorites.filter(id => id !== artistId);
    setFavorites(newFavorites);
    localStorage.setItem('favoriteArtists', JSON.stringify(newFavorites));
  };

  const isFavorite = (artistId: string) => {
    return favorites.includes(artistId);
  };

  const toggleFavorite = (artistId: string) => {
    if (isFavorite(artistId)) {
      removeFromFavorites(artistId);
    } else {
      addToFavorites(artistId);
    }
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };
}