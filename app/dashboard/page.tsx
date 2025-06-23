'use client';

import { useState, useEffect } from 'react';
import { Artist } from '@/types';
import ArtistTable from '@/components/dashboard/artist-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [submittedArtists, setSubmittedArtists] = useState<Artist[]>([]);
  const [stats, setStats] = useState({
    totalArtists: 0,
    pendingReview: 0,
    approved: 0,
    totalBookings: 0,
  });

  useEffect(() => {
    // Load submitted artists from localStorage
    const stored = localStorage.getItem('submittedArtists');
    if (stored) {
      const artists = JSON.parse(stored);
      setSubmittedArtists(artists);
      
      // Calculate stats
      setStats({
        totalArtists: artists.length,
        pendingReview: artists.filter((a: Artist) => !a.rating || a.rating === 0).length,
        approved: artists.filter((a: Artist) => a.rating && a.rating > 0).length,
        totalBookings: Math.floor(Math.random() * 50) + 10, // Mock data
      });
    }
  }, []);

  const handleDeleteArtist = (artistId: string) => {
    const updatedArtists = submittedArtists.filter(artist => artist.id !== artistId);
    setSubmittedArtists(updatedArtists);
    localStorage.setItem('submittedArtists', JSON.stringify(updatedArtists));
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalArtists: updatedArtists.length,
      pendingReview: updatedArtists.filter(a => !a.rating || a.rating === 0).length,
      approved: updatedArtists.filter(a => a.rating && a.rating > 0).length,
    }));
  };

  const handleApproveArtist = (artistId: string) => {
    const updatedArtists = submittedArtists.map(artist => 
      artist.id === artistId 
        ? { ...artist, rating: 4.5, experience: 'Verified' }
        : artist
    );
    setSubmittedArtists(updatedArtists);
    localStorage.setItem('submittedArtists', JSON.stringify(updatedArtists));
    
    // Update stats
    setStats(prev => ({
      ...prev,
      pendingReview: prev.pendingReview - 1,
      approved: prev.approved + 1,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manager Dashboard</h1>
            <p className="text-gray-600">Manage your artist submissions and track performance</p>
          </div>
          <Button onClick={() => router.push('/onboard')}>
            Add New Artist
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Artists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalArtists}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingReview}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalBookings}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Artist Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Artist Submissions</CardTitle>
          <CardDescription>
            Review and manage artist profile submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submittedArtists.length > 0 ? (
            <ArtistTable 
              artists={submittedArtists} 
              onDelete={handleDeleteArtist}
              onApprove={handleApproveArtist}
            />
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No artist submissions yet</h3>
              <p className="text-gray-600 mb-4">Start by adding your first artist to the platform</p>
              <Button onClick={() => router.push('/onboard')}>
                Add Artist
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}