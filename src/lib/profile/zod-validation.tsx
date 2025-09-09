import { z } from "zod";

// Zod Schema for validation
export const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform cannot be empty"),
  url: z.string().url("Must be a valid URL").min(1, "URL cannot be empty"),
});

export const educationSchema = z.object({
  degree: z.string().min(1, "Degree cannot be empty"),
  institution: z.string().min(1, "Institution cannot be empty"),
  startDate: z.string().min(1, "Start date cannot be empty"),
  endDate: z.string().optional(),
});

export const experienceSchema = z.object({
  position: z.string().min(1, "Position cannot be empty"),
  company: z.string().min(1, "Company cannot be empty"),
  startDate: z.string().min(1, "Start date cannot be empty"),
  endDate: z.string().nullable().optional(),
  description: z.string().optional(),
});

export const certificationSchema = z.object({
  company: z.string().min(1, "Company cannot be empty"),
  certificate: z.string().min(1, "Certificate cannot be empty"),
  issuedBy: z.string().min(1, "Issued by cannot be empty"),
  issueDate: z.string().min(1, "Issue date cannot be empty"),
});

export const userProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().optional(),
  designation: z.string().optional(),
  mobile: z.object({
    countryCode: z.string().optional(),
    number: z.string().optional(),
  }),
  location: z.object({
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
  }),
  skills: z.array(z.string()),
  socialLinks: z.array(socialLinkSchema),
  education: z.array(educationSchema),
  experience: z.array(experienceSchema),
  certification: z.array(certificationSchema),
});