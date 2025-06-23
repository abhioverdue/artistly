import * as yup from 'yup';

export const artistOnboardSchema = yup.object({
  name: yup
    .string()
    .required('Artist name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  
  bio: yup
    .string()
    .required('Bio is required')
    .min(20, 'Bio must be at least 20 characters')
    .max(500, 'Bio must not exceed 500 characters'),
  
  category: yup
    .array()
    .of(yup.string())
    .min(1, 'Please select at least one category')
    .required('Category is required'),
  
  languages: yup
    .array()
    .of(yup.string())
    .min(1, 'Please select at least one language')
    .required('Languages are required'),
  
  feeRange: yup
    .string()
    .required('Fee range is required'),
  
  location: yup
    .string()
    .required('Location is required')
    .min(3, 'Location must be at least 3 characters'),
});

export type ArtistOnboardFormData = yup.InferType<typeof artistOnboardSchema>;