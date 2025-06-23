'use client';

import { useState, useMemo } from 'react';
import { Artist } from '@/types';
import ArtistCard from './artist-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Grid3X3, List, Users, Search } from 'lucide-react';

interface FilterState {
  searchTerm: string;
  category: string[];
  location: string[];
  priceRange: string[];
}

interface ArtistGridProps {
  artists: Artist[];
  filters?: FilterState;
  className?: string;
  onQuoteRequest?: (artistId: string) => void;
}

type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'default';

interface ViewMode {
  type: 'grid' | 'list';
  label: string;
  icon: React.ReactNode;
}

export default function ArtistGrid({
  artists,
  filters,
  className = '',
  onQuoteRequest,
}: ArtistGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const viewModes: ViewMode[] = [
    { type: 'grid', label: 'Grid View', icon: <Grid3X3 className="w-8 h-8" /> },
    { type: 'list', label: 'List View', icon: <List className="w-7 h-7" /> },
  ];

  // Filter and search artists
  const filteredArtists = useMemo(() => {
    let filtered = artists;

    if (filters?.searchTerm && filters.searchTerm.trim() !== '') {
      const searchLower = filters.searchTerm.toLowerCase();

      filtered = filtered.filter(
        (artist) =>
          artist.name?.toLowerCase().includes(searchLower) ||
          artist.bio?.toLowerCase().includes(searchLower) ||
          artist.location?.toLowerCase().includes(searchLower) ||
          (artist.category || []).some((cat) =>
            cat?.toLowerCase().includes(searchLower)
          ) ||
          (artist.languages || []).some((lang) =>
            lang?.toLowerCase().includes(searchLower)
          )
      );
    }

    if (filters?.category?.length && filters.category.length > 0) {
      filtered = filtered.filter((artist) =>
        artist.category.some((cat) => filters.category.includes(cat))
      );
    }

    if (filters?.location?.length && filters.location.length > 0) {
      filtered = filtered.filter((artist) =>
        filters.location.some((loc: string) =>
          artist.location?.toLowerCase().includes(loc.toLowerCase())
        )
      );
    }

    if (filters?.priceRange?.length && filters.priceRange.length > 0) {
      filtered = filtered.filter((artist) =>
        filters.priceRange.includes(artist.feeRange)
      );
    }

    return filtered;
  }, [artists, filters]);

  // Sort artists
  const sortedArtists = useMemo(() => {
    const sorted = [...filteredArtists];

    const getPriceValue = (range: string): number => {
      const match = range.match(/[\d,]+/);
      return match ? parseInt(match[0].replace(/,/g, '')) : 0;
    };

    switch (sortBy) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'price-asc':
        return sorted.sort(
          (a, b) => getPriceValue(a.feeRange) - getPriceValue(b.feeRange)
        );
      case 'price-desc':
        return sorted.sort(
          (a, b) => getPriceValue(b.feeRange) - getPriceValue(a.feeRange)
        );
      case 'rating-desc':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return sorted;
    }
  }, [filteredArtists, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedArtists.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArtists = sortedArtists.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Empty state
  if (filteredArtists.length === 0) {
    return (
      <div className={`max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
        <div className="text-center py-16">
          <Search
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            aria-hidden="true"
          />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No artists found
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your filters or search terms to find more artists.
          </p>
          {((filters?.category?.length || 0) > 0 ||
            (filters?.location?.length || 0) > 0 ||
            (filters?.priceRange?.length || 0) > 0 ||
            (filters?.searchTerm && filters.searchTerm.trim() !== '')) && (
            <div className="text-sm text-gray-400" role="alert">
              Current filters are too restrictive. Consider removing some
              filters.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" aria-hidden="true" />
            <span>
              {filteredArtists.length} artist
              {filteredArtists.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {filteredArtists.length !== artists.length && (
            <Badge variant="outline" className="text-xs">
              Filtered from {artists.length} total
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <label htmlFor="sort-select" className="sr-only">
            Sort Artists
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="default">Default Order</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="price-asc">Price Low to High</option>
            <option value="price-desc">Price High to Low</option>
            <option value="rating-desc">Rating High to Low</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            {viewModes.map((mode) => (
              <Button
                key={mode.type}
                onClick={() => handleViewModeChange(mode.type)}
                variant={viewMode === mode.type ? 'default' : 'ghost'}
                size="sm"
                aria-pressed={viewMode === mode.type}
                aria-label={mode.label}
                className={`rounded-none px-3 py-1.5 ${
                  viewMode === mode.type
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                {mode.icon}
                <span className="ml-1 hidden sm:inline">{mode.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Artists Grid/List */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
            : 'space-y-4'
        }
      >
        {paginatedArtists.map((artist) => (
          <div key={artist.id} className={viewMode === 'list' ? 'max-w-none' : 'w-full'}>
            <ArtistCard artist={artist} onQuoteRequest={onQuoteRequest} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          className="flex items-center justify-center gap-2 pt-8"
          aria-label="Pagination"
        >
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            aria-label="Previous page"
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const showPage =
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1;

              if (!showPage && page === 2 && currentPage > 4) {
                return (
                  <span key="start-ellipsis" className="px-2 text-gray-400" aria-hidden="true">
                    ...
                  </span>
                );
              }

              if (!showPage && page === totalPages - 1 && currentPage < totalPages - 3) {
                return (
                  <span key="end-ellipsis" className="px-2 text-gray-400" aria-hidden="true">
                    ...
                  </span>
                );
              }

              if (!showPage) return null;

              return (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  aria-current={currentPage === page ? 'page' : undefined}
                  aria-label={`Page ${page}`}
                  className={`min-w-[40px] ${
                    currentPage === page ? 'bg-purple-600 text-white hover:bg-purple-700' : ''
                  }`}
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            aria-label="Next page"
          >
            Next
          </Button>
        </nav>
      )}

      {/* Results Summary */}
      {totalPages > 1 && (
        <div className="text-center text-sm text-gray-500" aria-live="polite">
          Showing {startIndex + 1} to{' '}
          {Math.min(startIndex + itemsPerPage, sortedArtists.length)} of{' '}
          {sortedArtists.length} results
        </div>
      )}
    </div>
  );
}
