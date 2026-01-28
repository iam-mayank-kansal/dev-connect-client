import { z } from 'zod';

// --- Sub-Schemas ---

const mobileSchema = z.object({
  countryCode: z.string().min(1, 'Country code is required'),
  number: z
    .string()
    .min(10, 'Mobile number must be at least 10 digits')
    .max(15, 'Mobile number is too long')
    .regex(/^\d+$/, 'Mobile number must contain only numbers')
    .or(z.literal('')), // Allow empty if they want to clear it
});

const locationSchema = z.object({
  address: z.string().max(100, 'Address too long').optional(),
  city: z.string().max(50, 'City name too long').optional(),
  state: z.string().max(50, 'State name too long').optional(),
  country: z.string().max(50, 'Country name too long').optional(),
});

// Strict Social Link Check
const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform name is required'),
  url: z
    .string()
    .min(1, 'URL is required')
    .url('Please enter a valid URL (https://...)'),
});

const experienceSchema = z
  .object({
    position: z.string().min(1, 'Position is required'),
    company: z.string().min(1, 'Company name is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(), // Can be empty string
    description: z.string().max(500, 'Description too long').optional(),
  })
  .refine(
    (data) => {
      if (
        data.endDate &&
        data.endDate !== '' &&
        new Date(data.endDate) < new Date(data.startDate)
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'End date cannot be before start date',
      path: ['endDate'],
    }
  );

const educationSchema = z
  .object({
    degree: z.string().min(1, 'Degree is required'),
    institution: z.string().min(1, 'Institution is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        data.endDate &&
        data.endDate !== '' &&
        new Date(data.endDate) < new Date(data.startDate)
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'End date cannot be before start date',
      path: ['endDate'],
    }
  );

const certificationSchema = z.object({
  certificate: z.string().min(1, 'Certificate name is required'),
  company: z.string().min(1, 'Issuing organization is required'),
  issueDate: z.string().optional(),
  issuedBy: z.string().optional(),
});

// --- Main Schema ---
export const userProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  designation: z.string().max(50).optional(),
  bio: z.string().max(500).optional(),

  mobile: mobileSchema.optional(),
  location: locationSchema.optional(),
  skills: z.array(z.string().min(1, 'Skill cannot be empty')).optional(),

  // Arrays
  socialLinks: z.array(socialLinkSchema).optional(),
  experience: z.array(experienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  certification: z.array(certificationSchema).optional(),

  // Files
  profilePicture: z.string().optional(),
  resume: z.string().optional(),
});
