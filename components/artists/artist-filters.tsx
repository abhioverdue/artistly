'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FilterState, Category, Location } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  X,
  MapPin,
  Music,
  IndianRupee,
  RotateCcw,
} from 'lucide-react';
import { debounce } from '@/lib/utils';

interface ArtistFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  categories: Category[];
  locations: Location[];
  className?: string;
}

const priceRanges = [
  '₹5,000 - ₹15,000',
  '₹15,000 - ₹30,000',
  '₹30,000 - ₹50,000',
  '₹50,000 - ₹1,00,000',
  '₹1,00,000+',
];

// Helper to convert price range string to safe id string
const toSafeId = (str: string) =>
  str.replace(/[^\w-]/g, '').toLowerCase();

export default function ArtistFilters({
  filters,
  onFiltersChange,
  categories,
  locations,
  className = '',
}: ArtistFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || '');

  // Ref to always get latest filters inside debounce
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  // Debounced search with stable debounce instance
  const debouncedSearch = useRef(
    debounce((term: string) => {
      // Use latest filters from ref and update searchTerm
      onFiltersChange({ ...filtersRef.current, searchTerm: term });
    }, 300)
  ).current;

  // Run debounce on searchTerm changes but skip initial render
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Category change handler
  const handleCategoryChange = (categoryName: string, checked: boolean) => {
    const updatedCategories = checked
      ? [...filters.category, categoryName]
      : filters.category.filter((cat) => cat !== categoryName);

    onFiltersChange({ ...filters, category: updatedCategories });
  };

  // Location change handler
  const handleLocationChange = (locationName: string, checked: boolean) => {
    const updatedLocations = checked
      ? [...filters.location, locationName]
      : filters.location.filter((loc) => loc !== locationName);

    onFiltersChange({ ...filters, location: updatedLocations });
  };

  // Price range change handler
  const handlePriceRangeChange = (priceRange: string, checked: boolean) => {
    const updatedPriceRanges = checked
      ? [...filters.priceRange, priceRange]
      : filters.priceRange.filter((range) => range !== priceRange);

    onFiltersChange({ ...filters, priceRange: updatedPriceRanges });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    onFiltersChange({
      category: [],
      location: [],
      priceRange: [],
      searchTerm: '',
    });
  };

  // Count active filters
  const getActiveFiltersCount = () =>
    (filters.category?.length || 0) +
    (filters.location?.length || 0) +
    (filters.priceRange?.length || 0) +
    (filters.searchTerm ? 1 : 0);

  // Remove a single filter
  const removeFilter = (type: keyof FilterState, value: string) => {
    if (type === 'searchTerm') {
      setSearchTerm('');
      onFiltersChange({ ...filters, searchTerm: '' });
    } else {
      onFiltersChange({
        ...filters,
        [type]: (filters[type] as string[]).filter((item) => item !== value),
      });
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search artists by name, category, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      {/* Mobile Filter Toggle */}
      <div className="flex items-center justify-between lg:hidden">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          className="flex items-center gap-2"
          aria-expanded={isExpanded}
          aria-controls="filter-panel"
        >
          <Filter className="w-4 h-4" />
          Filters
          {getActiveFiltersCount() > 0 && (
            <Badge className="bg-purple-600 text-white ml-1">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>

        {getActiveFiltersCount() > 0 && (
          <Button
            onClick={clearAllFilters}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {filters.searchTerm}
              <X
                role="button"
                tabIndex={0}
                className="w-3 h-3 cursor-pointer hover:text-red-500"
                onClick={() => removeFilter('searchTerm', filters.searchTerm)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    removeFilter('searchTerm', filters.searchTerm);
                  }
                }}
                aria-label="Remove search filter"
              />
            </Badge>
          )}

          {filters.category.map((cat) => (
            <Badge key={cat} variant="secondary" className="flex items-center gap-1">
              {cat}
              <X
                role="button"
                tabIndex={0}
                className="w-3 h-3 cursor-pointer hover:text-red-500"
                onClick={() => removeFilter('category', cat)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    removeFilter('category', cat);
                  }
                }}
                aria-label={`Remove category filter ${cat}`}
              />
            </Badge>
          ))}

          {filters.location.map((loc) => (
            <Badge key={loc} variant="secondary" className="flex items-center gap-1">
              {loc}
              <X
                role="button"
                tabIndex={0}
                className="w-3 h-3 cursor-pointer hover:text-red-500"
                onClick={() => removeFilter('location', loc)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    removeFilter('location', loc);
                  }
                }}
                aria-label={`Remove location filter ${loc}`}
              />
            </Badge>
          ))}

          {filters.priceRange.map((range) => (
            <Badge key={range} variant="secondary" className="flex items-center gap-1">
              {range}
              <X
                role="button"
                tabIndex={0}
                className="w-3 h-3 cursor-pointer hover:text-red-500"
                onClick={() => removeFilter('priceRange', range)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    removeFilter('priceRange', range);
                  }
                }}
                aria-label={`Remove price range filter ${range}`}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Filter Panels */}
      <div
        id="filter-panel"
        className={`space-y-4 transition-max-height duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-screen' : 'max-h-0 lg:max-h-screen'
        }`}
      >
        {/* Categories Filter */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Music className="w-4 h-4 text-purple-600" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={filters.category.includes(category.name)}
                    onChange={(e) =>
                      handleCategoryChange(category.name, e.currentTarget.checked)
                    }
                  />
                  <label
                    htmlFor={category.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Locations Filter */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-600" />
              Locations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {locations.map((location) => (
                <div key={location.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={location.id}
                    checked={filters.location.includes(location.city)}
                    onChange={(e) =>
                      handleLocationChange(location.city, e.currentTarget.checked)
                    }
                  />
                  <label
                    htmlFor={location.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {location.city}, {location.state}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Price Range Filter */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-purple-600" />
              Price Range
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <div key={toSafeId(range)} className="flex items-center space-x-2">
                  <Checkbox
                    id={toSafeId(range)}
                    checked={filters.priceRange.includes(range)}
                    onChange={(e) =>
                      handlePriceRangeChange(range, e.currentTarget.checked)
                    }
                  />
                  <label
                    htmlFor={toSafeId(range)}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {range}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Clear Filters Button - Desktop */}
        {getActiveFiltersCount() > 0 && (
          <div className="hidden lg:block">
            <Button
              onClick={clearAllFilters}
              variant="outline"
              className="w-full text-gray-600 hover:text-gray-800"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
