'use client';

import { useState } from 'react';
import { useArtists } from '@/hooks/use-artists';
import ArtistGrid from '@/components/artists/artist-grid';
import ArtistFilters from '@/components/artists/artist-filters';
import { FilterState } from '@/types';

export default function ArtistsPage() {
  const { artists, categories, locations, loading, error } = useArtists();
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    location: [],
    priceRange: [],
    searchTerm: '',
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const filteredArtists = artists.filter((artist) => {
    // Search term filter
    if (filters.searchTerm && 
        !artist.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !artist.bio.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }

    // Category filter
    if (filters.category.length > 0) {
      const hasMatchingCategory = artist.category.some(cat => 
        filters.category.includes(cat)
      );
      if (!hasMatchingCategory) return false;
    }

    // Location filter
    if (filters.location.length > 0) {
      const artistLocation = artist.location.toLowerCase();
      const hasMatchingLocation = filters.location.some(loc => 
        artistLocation.includes(loc.toLowerCase())
      );
      if (!hasMatchingLocation) return false;
    }

    // Price range filter
    if (filters.priceRange.length > 0) {
      if (!filters.priceRange.includes(artist.feeRange)) return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Artists</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Artist</h1>
        <p className="text-gray-600">Browse through our talented artists and find the perfect match for your event</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ArtistFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
            categories={categories}
            locations={locations}
          />
        </div>

        {/* Artists Grid */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">
              Showing {filteredArtists.length} of {artists.length} artists
            </p>
          </div>
          
          <ArtistGrid artists={filteredArtists} />
          
          {filteredArtists.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No artists found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}