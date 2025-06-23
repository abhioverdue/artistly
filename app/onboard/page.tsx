'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ArtistOnboardForm from '@/components/forms/artist-onboard-form';
import { ArtistOnboardFormData } from '@/lib/validations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function OnboardPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (data: ArtistOnboardFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would send the data to your backend
      console.log('Artist onboarding data:', data);
      
      // Store in localStorage for demo purposes
      const existingArtists = JSON.parse(localStorage.getItem('submittedArtists') || '[]');
      const newArtist = {
  id: Date.now().toString(),
  ...data,
  profileImage: (data as any).profileImage ? URL.createObjectURL((data as any).profileImage) : undefined,
  rating: 0,
  experience: 'New',
  availability: true,
  submittedAt: new Date().toISOString(),
};

      
      existingArtists.push(newArtist);
      localStorage.setItem('submittedArtists', JSON.stringify(existingArtists));
      
      setSubmitSuccess(true);
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-green-600">Successfully Submitted!</CardTitle>
            <CardDescription>
              Your artist profile has been submitted successfully. You will be redirected to the dashboard shortly.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Artist Onboarding</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Join our platform and showcase your talent to event planners across the country. 
          Fill out the form below to get started.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Artist Profile Information</CardTitle>
          <CardDescription>
            Please provide accurate information about your artistic services and experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ArtistOnboardForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
}