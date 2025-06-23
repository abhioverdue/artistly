'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { artistOnboardSchema, type ArtistOnboardFormData } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, X } from 'lucide-react';

const CATEGORIES = [
  'Singer', 'Dancer', 'DJ', 'Speaker', 'Band', 'Comedian', 
  'Magician', 'Musician', 'Photographer', 'Event Host'
];

const LANGUAGES = [
  'English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Bengali',
  'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Urdu'
];

const FEE_RANGES = [
  '₹5,000 - ₹15,000',
  '₹15,000 - ₹30,000',
  '₹30,000 - ₹50,000',
  '₹50,000 - ₹1,00,000',
  '₹1,00,000+'
];

interface ArtistOnboardFormProps {
  onSubmit?: (data: ArtistOnboardFormData & { profileImage?: File }) => void;
  isSubmitting?: boolean; 
}

export default function ArtistOnboardForm({ onSubmit }: ArtistOnboardFormProps) {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<ArtistOnboardFormData>({
    resolver: yupResolver(artistOnboardSchema),
    defaultValues: {
      name: '',
      bio: '',
      category: [],
      languages: [],
      feeRange: '',
      location: ''
    }
  });

  const watchedCategories = watch('category');
  const watchedLanguages = watch('languages');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const currentCategories = watchedCategories || [];
    if (checked) {
      setValue('category', [...currentCategories, category]);
    } else {
      setValue('category', currentCategories.filter(c => c !== category));
    }
  };

  const handleLanguageChange = (language: string, checked: boolean) => {
    const currentLanguages = watchedLanguages || [];
    if (checked) {
      setValue('languages', [...currentLanguages, language]);
    } else {
      setValue('languages', currentLanguages.filter(l => l !== language));
    }
  };

  const onFormSubmit = async (data: ArtistOnboardFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const formData = {
        ...data,
        profileImage: profileImage || undefined
      };
      
      if (onSubmit) {
        onSubmit(formData);
      } else {
        console.log('Artist onboard data:', formData);
        alert('Artist profile created successfully!');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to create profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Artist Onboarding</h1>
        <p className="text-gray-600">Join Artistly and showcase your talent to event planners worldwide</p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artist Name *
              </label>
              <Input
                {...register('name')}
                placeholder="Enter your stage/professional name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <Input
                {...register('location')}
                placeholder="City, State"
                className={errors.location ? 'border-red-500' : ''}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio *
            </label>
            <textarea
              {...register('bio')}
              rows={4}
              placeholder="Tell us about yourself, your experience, and what makes you unique..."
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.bio ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
            )}
          </div>
        </Card>

        {/* Profile Image */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Image</h2>
          
          <div className="flex flex-col items-center">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            <label className="mt-4 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors">
                <Upload size={16} />
                <span>Upload Photo</span>
              </div>
            </label>
            <p className="mt-2 text-sm text-gray-500">Optional: JPG, PNG up to 5MB</p>
          </div>
        </Card>

        {/* Categories */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Performance Categories *</h2>
          <p className="text-gray-600 mb-4">Select all categories that match your skills</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {CATEGORIES.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={watchedCategories?.includes(category) || false}
                  onChange={(checked) => 
                    handleCategoryChange(category, checked as unknown as boolean)
                  }
                />
                <label
                  htmlFor={`category-${category}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
          
          {watchedCategories && watchedCategories.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Selected categories:</p>
              <div className="flex flex-wrap gap-2">
                {watchedCategories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {errors.category && (
            <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>
          )}
        </Card>

        {/* Languages */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Languages Spoken *</h2>
          <p className="text-gray-600 mb-4">Select all languages you can perform in</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {LANGUAGES.map((language) => (
              <div key={language} className="flex items-center space-x-2">
                <Checkbox
                  id={`language-${language}`}
                  checked={watchedLanguages?.includes(language) || false}
                  onChange={(checked) => 
                    handleLanguageChange(language, checked as unknown as boolean)
                  }
                />
                <label
                  htmlFor={`language-${language}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {language}
                </label>
              </div>
            ))}
          </div>
          
          {watchedLanguages && watchedLanguages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Selected languages:</p>
              <div className="flex flex-wrap gap-2">
                {watchedLanguages.map((language) => (
                  <Badge key={language} variant="secondary">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {errors.languages && (
            <p className="mt-2 text-sm text-red-600">{errors.languages.message}</p>
          )}
        </Card>

        {/* Fee Range */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Fee Range *</h2>
          <p className="text-gray-600 mb-4">Select your typical performance fee range</p>
          
          <Controller
            name="feeRange"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.feeRange ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select fee range</option>
                {FEE_RANGES.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            )}
          />
          
          {errors.feeRange && (
            <p className="mt-2 text-sm text-red-600">{errors.feeRange.message}</p>
          )}
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Profile...' : 'Create Artist Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
}