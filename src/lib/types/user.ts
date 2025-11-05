import { ConnectionData } from './connection';

export interface Mobile {
  countryCode: string;
  number: string;
}

export interface Location {
  country: string;
  state: string;
  city: string;
  address: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Education {
  degree: string;
  institution: string;
  startDate: string;
  endDate: string | null;
}

export interface Experience {
  position: string;
  company: string;
  startDate: string;
  endDate: string | null;
  description: string;
}

export interface Certification {
  company: string;
  certificate: string;
  issuedBy: string;
  issueDate: string;
}

export interface UserProfile {
  _id: string;
  email: string;
  name: string;
  bio: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
  certification: Certification[];
  socialLinks: SocialLink[];
  profilePicture: string | File;
  resume: string | File | null;
  age: number;
  designation: string;
  dob: string;
  mobile: Mobile;
  location: Location;
  connections: ConnectionData;
}

export interface deleteUserResponse {
  message: string;
}
